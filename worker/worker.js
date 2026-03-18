/**
 * CapShift Portfolio Intelligence — Cloudflare Worker
 *
 * This worker proxies requests from the GitHub Pages frontend
 * to the Anthropic API. Your API key lives here as an environment
 * variable (ANTHROPIC_API_KEY) and is never exposed to the browser.
 *
 * Deploy steps are in README.md.
 */

const ALLOWED_ORIGIN = "*"; // Lock this down to your GitHub Pages URL after testing
                             // e.g. "https://yourusername.github.io"

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const MODEL = "claude-sonnet-4-20250514";

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

    // Forward to Anthropic
    let anthropicResponse;
    try {
      anthropicResponse = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: JSON.stringify({ model: MODEL, max_tokens, messages }),
      });
    } catch (err) {
      return errorResponse("Failed to reach Anthropic API: " + err.message, 502);
    }

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      return new Response(JSON.stringify({ error: data?.error?.message || "Anthropic API error" }), {
        status: anthropicResponse.status,
        headers: { "Content-Type": "application/json", ...corsHeaders(ALLOWED_ORIGIN) },
      });
    }

    return new Response(JSON.stringify(data), {
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
