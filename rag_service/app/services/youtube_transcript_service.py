import re
import requests
from yt_dlp import YoutubeDL
from typing import Optional, Dict

class QuietLogger:
    def debug(self, msg): pass
    def info(self, msg): pass
    def warning(self, msg): print(msg)

def get_transcript_data(
    url: str, lang: str = "en", auto: bool = True,
    remove_bracketed: bool = True, quiet: bool = True
) -> Optional[Dict[str, str]]:
    """
    Fetch transcript + metadata from a YouTube URL using yt-dlp.

    Args:
        url: YouTube video URL or id.
        lang: subtitle language code (default 'en').
        auto: whether to use auto-generated captions (True) or uploaded ones (False).
        remove_bracketed: strip things like [♪], (applause), music note chars.
        quiet: if True, suppress yt-dlp logs.

    Returns:
        dict with {"transcript": str, "title": str, "channel": str}
        or None if no captions found.
    """
    ydl_opts = {
        "skip_download": True,
        "writesubtitles": not auto,
        "writeautomaticsub": auto,
        "subtitleslangs": [lang],
        "quiet": quiet,
        "no_warnings": quiet,
    }
    if quiet:
        ydl_opts["logger"] = QuietLogger()

    def clean_line(line: str) -> str:
        if remove_bracketed:
            line = re.sub(r'[\[\(].*?[\]\)]', '', line)
            line = line.replace('♪', '').replace('♫', '')
        return line.strip()

    def extract_from_json_payload(payload: dict) -> str:
        parts = []
        for ev in payload.get("events", []):
            for seg in ev.get("segs") or []:
                text = seg.get("utf8") or ""
                if not text:
                    continue
                for line in text.splitlines():
                    line = line.strip()
                    if remove_bracketed and re.fullmatch(r'^[\[\(].{0,200}?[\]\)]$', line):
                        continue
                    cleaned = clean_line(line)
                    if cleaned:
                        parts.append(cleaned)
        return re.sub(r'\s+', ' ', " ".join(parts)).strip()

    def extract_from_vtt_or_text(text: str) -> str:
        text = re.sub(r'^\ufeff', '', text)
        text = re.sub(r'(?ims)^WEBVTT.*?\n\n', '', text)
        timestamp_re = r'(?m)^\s*(?:\d+\s*$)|^\s*(?:\d{1,4}:)?\d{1,2}:\d{2}\.\d{3}\s*-->\s*(?:\d{1,4}:)?\d{1,2}:\d{2}\.\d{3}.*$'
        text = re.sub(timestamp_re, '', text)
        lines = []
        for line in text.splitlines():
            line = line.strip()
            if not line:
                continue
            if remove_bracketed and re.fullmatch(r'^[\[\(].{0,200}?[\]\)]$', line):
                continue
            cleaned = clean_line(line)
            if cleaned:
                lines.append(cleaned)
        return re.sub(r'\s+', ' ', " ".join(lines)).strip()

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        subs = info.get("subtitles", {}) or {}
        auto_subs = info.get("automatic_captions", {}) or {}

        captions = subs.get(lang) or auto_subs.get(lang)
        if not captions:
            return None

        chosen = None
        for c in captions:
            ext = (c.get("ext") or "").lower()
            if "json" in ext or ext in ("srv3", "json3"):
                chosen = c
                break
        if chosen is None:
            chosen = captions[0]

        sub_url = chosen.get("url")
        if not sub_url:
            return None

        resp = requests.get(sub_url, timeout=15)

        transcript = None
        try:
            payload = resp.json()
            if isinstance(payload, dict) and payload.get("events"):
                transcript = extract_from_json_payload(payload)
        except ValueError:
            pass

        if transcript is None:
            transcript = extract_from_vtt_or_text(resp.text)

        if not transcript:
            return None

        return {
            "transcript": transcript,
            "title": info.get("title", ""),
            "channel": info.get("uploader", "") or info.get("channel", "")
        }


# Example usage
if __name__ == "__main__":
    url = "https://www.youtube.com/watch?v=rng_yUSwrgU"
    data = get_transcript_data(url, lang="en", auto=True)
    if data:
        print("Title:", data["title"])
        print("Channel:", data["channel"])
        print("Transcript preview:", data["transcript"][:300])
    else:
        print("No transcript available")
