export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  // Basic checks
  const checks = {
    apiKeyExists: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 7) + "..." : "MISSING",
    apiKeyLength: apiKey ? apiKey.length : 0,
    timestamp: new Date().toISOString(),
  };

  if (!apiKey) {
    return res.status(200).json({ 
      status: "FAIL", 
      error: "No ANTHROPIC_API_KEY environment variable found", 
      checks,
      fix: "Go to Vercel > Settings > Environment Variables and add ANTHROPIC_API_KEY" 
    });
  }

  // Try a minimal API call
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 100,
        messages: [{ role: "user", content: "Reply with exactly: {\"status\":\"ok\"}" }],
      }),
    });

    const status = response.status;
    const body = await response.text();

    if (status === 200) {
      return res.status(200).json({ 
        status: "PASS", 
        message: "API connection working!", 
        checks,
        apiResponse: body.substring(0, 500),
      });
    } else {
      return res.status(200).json({ 
        status: "FAIL", 
        error: "API returned status " + status, 
        checks,
        apiResponse: body.substring(0, 500),
        fix: status === 401 ? "API key is invalid. Generate a new one at console.anthropic.com" 
           : status === 429 ? "Rate limited. Wait 60 seconds and refresh this page."
           : "Check the API response for details"
      });
    }
  } catch (err) {
    return res.status(200).json({ 
      status: "FAIL", 
      error: err.message, 
      checks,
      fix: "Network error connecting to Anthropic API" 
    });
  }
}
