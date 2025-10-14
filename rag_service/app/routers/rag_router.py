from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response

from app.models import Content, Search
from app.db import pc_index
from app.services.chunking_service import chunk_text_spacy
from app.services.llm_query_service import llm_query
from app.services.verify_key_service import verify_api_key
from app.services.youtube_transcript_service import get_transcript_data

rag_router = APIRouter()

@rag_router.post("/embed")
async def embed_note_handler(payload: Content, api_key: str = Depends(verify_api_key)):
    if not payload.link and not payload.content:
        return HTTPException(
            status_code=411, detail="Either link or content is required"
        )
    
    try:
        if payload.type.lower() == "note":
            content = payload.content
            result = None
        elif payload.type.lower() == "youtube":
            # Handle Youtube
            result = get_transcript_data(payload.link, quiet=False)
            content = result.get("transcript", "")
            if not content:
                return HTTPException(
                status_code=411, detail="transcript cound not be extracted"
            )
        else:
            return Response(content="success. no chunks created.", status_code=200)

        chunks = chunk_text_spacy(content)
        records: List[Dict[str, str]] = []
        for idx, c in enumerate(chunks):
            record = {
                "id": f"{payload.note_id}#{idx}",
                "text": c,
                "link": payload.link,
                "type": payload.type,
                "title": payload.title,
                "tags": payload.tags
            }
            # Add Youtube-specific metadata
            if payload.type.lower() == "youtube" and result:
                record["youtube_title"] = getattr(result, "title", "")
                record["youtube_channel"] = getattr(result, "channel", "")
            records.append(record)
        
        pc_index.upsert_records(namespace=payload.user_id, records=records)
    except Exception as e:
        print(str(e))
        return HTTPException(status_code=503, detail="Error occurred while creating embeddings.")
    
    return Response(content="success", status_code=200)

@rag_router.post("/search")
async def embed_note_handler(payload: Search, api_key: str = Depends(verify_api_key)):
    if not payload.query:
        return HTTPException(status_code=403, detail="Query is empty")
    
    try:
        results = pc_index.search(namespace=payload.user_id, query={
            "inputs": {"text": payload.query},
            "top_k": payload.top_k
        })

        threshold = 0.3
        context = "\n".join(hit["fields"]["text"] for hit in results["result"]["hits"] if hit["_score"] > threshold)
        
        seen = set()
        sources = []
        for hit in results["result"]["hits"]:
            if hit["_score"] > threshold:
                full_id = hit["_id"]
                note_id = full_id.split("#")[0]  # take part before '#'
                title = hit["fields"].get("title", "").strip()  # handle missing titles safely
                
                key = (note_id, title)
                if key not in seen:
                    seen.add(key)
                    sources.append({"note_id": note_id, "title": title})
        
        llm_response = await llm_query(context=context, query=payload.query)
    except Exception as e:
        print(str(e))
        return HTTPException(status_code=503, detail="Error occurred while searching your query.")

    return {"llm_response": llm_response, "sources": sources}
