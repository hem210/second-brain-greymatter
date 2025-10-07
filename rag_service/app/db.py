from pinecone import Pinecone

from app.config import PINECONE_API_KEY, PINECONE_INDEX

pc = Pinecone(api_key=PINECONE_API_KEY)
pc_index = pc.Index(PINECONE_INDEX)
