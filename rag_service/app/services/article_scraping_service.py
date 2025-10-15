import logging
import re
from firecrawl import Firecrawl

from app.config import FIRECRAWL_API_KEY

firecrawl = Firecrawl(api_key=FIRECRAWL_API_KEY)

logger = logging.getLogger("uvicorn")

def extract_article_firecrawl(url: str):
    try:
        doc = firecrawl.scrape(url, formats=["markdown"])
        return clean_markdown(doc.markdown)
    except Exception as e:
        logger.error(f"Firecrawl extraction failed: {e}")
        return ""

def clean_markdown(md: str) -> str:
    # Remove front-matter (YAML blocks like --- title: blah ---)
    md = re.sub(r"^---[\s\S]*?---", "", md, flags=re.MULTILINE)
    
    # Remove HTML tags inside Markdown
    md = re.sub(r"<[^>]+>", "", md)
    
    # Remove links but keep text
    md = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", md)
    
    # Remove inline images ![alt](url)
    md = re.sub(r"!\[.*?\]\(.*?\)", "", md)
    
    # Remove boilerplate lines
    boilerplate_patterns = [
        r"(?i)subscribe", r"(?i)related articles", r"(?i)comments",
        r"(?i)follow us", r"(?i)share this", r"(?i)posted by",
        r"(?i)copyright", r"(?i)cookie policy", r"(?i)advertisement"
    ]
    for pat in boilerplate_patterns:
        md = re.sub(pat + r".*\n?", "", md)
    
    # Remove multiple blank lines
    md = re.sub(r"\n{3,}", "\n\n", md)
    
    # Strip whitespace
    md = md.strip()
    
    return md


if __name__ == "__main__":
    url = "https://medium.com/@yaduvanshineelam09/introduction-to-fastapi-123c0b2778a5"
    # doc = extract_article_firecrawl(url)
    # with open("./temp.txt", "w") as f:
    #     f.write(doc)
    with open("./temp.md", "r") as f:
        text = f.read()
    
    cleaned = clean_markdown(text)
    with open("./temp_cleaned.md", "w") as f:
        f.write(cleaned)
