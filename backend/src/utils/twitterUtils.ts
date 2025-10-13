export function normalizeXtoTwitter(inputLink?: string): string | undefined {
    if (!inputLink) return inputLink;

    try {
        // If it's a valid absolute URL, use the URL API
        const url = new URL(inputLink);

        // Normalize hostnames we consider "X"
        const host = url.hostname.toLowerCase();
        if (host === "x.com" || host === "www.x.com") {
        url.hostname = "twitter.com";
        return url.toString();
        }

        return inputLink; // no change needed
    } catch (e) {
        // If it's not an absolute URL, try a safer regex fallback
        // This will replace occurrences like "https://x.com/..." or "http://www.x.com/..."
        // but won't touch strings that aren't URL-like
        return inputLink.replace(
        /^(https?:\/\/)?(www\.)?x\.com(?=\/|$)/i,
        (match) => {
            // if original had protocol, keep it; otherwise default to https://
            if (/^https?:\/\//i.test(match)) {
            return match.replace(/x\.com/i, "twitter.com");
            }
            return "https://twitter.com";
        }
        );
    }
}
