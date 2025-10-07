from fastapi import FastAPI

from app.routers.rag_router import rag_router

app = FastAPI()

app.include_router(rag_router, prefix="/api/v1")

@app.get("/")
async def root_handler():
    return {"Hello": "World"}

