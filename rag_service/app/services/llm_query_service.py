import logging
from app.gemini_llm import client

logger = logging.getLogger("uvicorn")

async def llm_query(context: str, query: str):
    prompt = f"""
You are a helpful assistant who answers a user's query based on the context. The context comes from the notes, youtube videos, or social media posts saved by the user. Your task is to answer the user query based on the context provided. Only take into account the context which you find relevant and ignore those which are not relevant.

If you receive irrelevant or insufficient context, just respond with "I'm sorry, but the provided context does not contain any information related to your query."

Context: {context}

Query: {query}
"""
    try:
        response = client.models.generate_content(
            model = "gemini-2.5-flash", contents=prompt
        )
    except Exception as e:
        logger.error(f"Error occurred while calling Gemini API: {str(e)}")
        return ""

    return response.text
