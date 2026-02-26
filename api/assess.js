export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured. Add ANTHROPIC_API_KEY in Vercel Environment Variables." });
  }

  try {
    const { system, userMessage } = req.body;
    if (!system || !userMessage) {
      return res.status(400).json({ error: "Missing system or userMessage" });
    }

    // Retry logic with exponential backoff for rate limits
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 3000,
          system: system,
          messages: [{ role: "user", content: userMessage }],
          tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
        }),
      });

      // If rate limited, wait and retry
      if (response.status === 429) {
        if (attempt < maxRetries) {
          const retryAfter = response.headers.get("retry-after");
          const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : 2000 * Math.pow(2, attempt);
          await new Promise(r => setTimeout(r, Math.min(waitMs, 15000)));
          continue;
        }
        return res.status(429).json({ error: "Rate limited. Please wait a moment and try again." });
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 1500 * attempt));
          continue;
        }
        return res.status(response.status).json({ error: errText.substring(0, 300) });
      }

      const data = await response.json();
      const text = (data.content || [])
        .filter(block => block.type === "text")
        .map(block => block.text)
        .join("\n");

      return res.status(200).json({ text });
    }

    return res.status(500).json({ error: "Failed after retries" });
  } catch (err) {
    console.error("API route error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
