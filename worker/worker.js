/**
 * CapShift Portfolio Intelligence — Cloudflare Worker
 *
 * Proxies requests from the GitHub Pages frontend to the Google Gemini API.
 * Your API key lives here as an environment variable (GEMINI_API_KEY)
 * and is never exposed to the browser.
 *
 * Deploy:  wrangler deploy
 * Set key: wrangler secret put GEMINI_API_KEY
 */

const ALLOWED_ORIGIN = "*"; // Lock to your GitHub Pages URL after testing
                             // e.g. "https://nostradamus2x.github.io"

const GEMINI_MODEL   = "gemini-2.0-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export default {
  async fetch(request, env) {

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(ALLOWED_ORIGIN),
      });
    }

    // Only allow POST to /api/generate
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/api/generate") {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders(ALLOWED_ORIGIN) },
      });
    }

    // Parse incoming request body
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON body", 400);
    }

    const { messages, max_tokens = 1200 } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return errorResponse("messages array is required", 400);
    }

    // Convert messages to Gemini format
    // Gemini uses "model" instead of "assistant" for role
    const contents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Call Gemini API
    let geminiResponse;
    try {
      geminiResponse = await fetch(`${GEMINI_API_URL}?key=${env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: max_tokens },
        }),
      });
    } catch (err) {
      return errorResponse("Failed to reach Gemini API: " + err.message, 502);
    }

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return new Response(JSON.stringify({ error: data?.error?.message || "Gemini API error" }), {
        status: geminiResponse.status,
        headers: { "Content-Type": "application/json", ...corsHeaders(ALLOWED_ORIGIN) },
      });
    }

    // Normalize response to match Anthropic format so the frontend needs no changes
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return new Response(JSON.stringify({ content: [{ text }] }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders(ALLOWED_ORIGIN) },
    });
  },
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function errorResponse(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(ALLOWED_ORIGIN) },
  });
}
