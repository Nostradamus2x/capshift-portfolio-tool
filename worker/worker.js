/**
 * CapShift Portfolio Intelligence — Cloudflare Worker
 *
 * Proxies requests from the GitHub Pages frontend to the Groq API.
 * Your API key lives here as an environment variable (GROQ_API_KEY)
 * and is never exposed to the browser.
 *
 * Deploy:  wrangler deploy
 * Set key: wrangler secret put GROQ_API_KEY
 */

const ALLOWED_ORIGIN = "*"; // Lock to your GitHub Pages URL after testing
                             // e.g. "https://nostradamus2x.github.io"

const GROQ_MODEL   = "llama-3.3-70b-versatile";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

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

    // Call Groq API (OpenAI-compatible format)
    let groqResponse;
    try {
      groqResponse = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages,
          max_tokens,
        }),
      });
    } catch (err) {
      return errorResponse("Failed to reach Groq API: " + err.message, 502);
    }

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return new Response(JSON.stringify({ error: data?.error?.message || "Groq API error" }), {
        status: groqResponse.status,
        headers: { "Content-Type": "application/json", ...corsHeaders(ALLOWED_ORIGIN) },
      });
    }

    // Normalize response to match Anthropic format so the frontend needs no changes
    const text = data.choices?.[0]?.message?.content || "";
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
