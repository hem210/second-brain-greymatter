from fastapi import HTTPException, Header

from app.config import RAG_API_KEY


def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != RAG_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
