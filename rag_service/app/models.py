from typing import List
from pydantic import BaseModel

class Content(BaseModel):
    note_id: str
    user_id: str
    content: str | None = ""
    link: str | None = ""
    type: str
    title: str
    tags: List[str]

class Search(BaseModel):
    user_id: str
    query: str
    top_k: int = 3
