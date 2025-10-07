import spacy

# Load spaCy English pipeline
nlp = spacy.load("en_core_web_sm")

def chunk_text_spacy(text, max_words=300, overlap=50):
    overlap = max(0, min(overlap, max_words - 1))  # sanity
    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]

    chunks = []
    current_words = []

    for sent in sentences:
        sent_words = sent.split()
        # If the sentence fits in current chunk, just append
        if len(current_words) + len(sent_words) <= max_words:
            current_words.extend(sent_words)
            continue

        # Otherwise, close current chunk
        if current_words:
            chunks.append(" ".join(current_words))

        # Start next chunk with overlap from previous chunk
        if overlap > 0:
            prev_overlap = chunks[-1].split()[-overlap:] if chunks and len(chunks[-1].split()) >= overlap else (chunks[-1].split() if chunks else [])
            current_words = prev_overlap.copy()
        else:
            current_words = []

        # Now place the sentence; if it's longer than max_words, split it
        if len(sent_words) > max_words:
            i = 0
            while i < len(sent_words):
                remaining = max_words - len(current_words)
                take = min(remaining, len(sent_words) - i)
                current_words.extend(sent_words[i:i+take])
                i += take

                # If chunk full, flush it
                if len(current_words) == max_words:
                    chunks.append(" ".join(current_words))
                    if overlap > 0:
                        overlap_words = chunks[-1].split()[-overlap:] if len(chunks[-1].split()) >= overlap else chunks[-1].split()
                        current_words = overlap_words.copy()
                    else:
                        current_words = []
        else:
            # sentence fits in a fresh chunk
            current_words.extend(sent_words)

    if current_words:
        chunks.append(" ".join(current_words))

    return chunks
