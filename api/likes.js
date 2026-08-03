const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PAGE_PATTERN = /^[a-z0-9-]{1,40}$/;

// These are public, least-privilege Supabase credentials. RLS blocks direct
// table access; the key can only execute the two dedicated RPC functions.
const SUPABASE_URL = "https://kcbavwngttkolkmmjkwf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_YYzB8x6subpcHqCOFU6dxg_0nYs46du";

module.exports = async function handler(request, response) {
  const startedAt = Date.now();
  const requestId = request.headers?.["x-vercel-id"] || request.headers?.get?.("x-vercel-id") || null;
  const log = (level, message, details = {}) => {
    const entry = JSON.stringify({ level, message, route: "/api/likes", requestId, ...details, durationMs: Date.now() - startedAt });
    (level === "error" ? console.error : console.log)(entry);
  };

  log("info", "Likes request started", { method: request.method });
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (!["GET", "POST"].includes(request.method)) {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const page = String(request.query.page || "");
  const visitor = String(request.query.visitor || "");
  if (!PAGE_PATTERN.test(page) || !UUID_PATTERN.test(visitor)) {
    return response.status(400).json({ error: "Invalid page or visitor" });
  }

  let liked;
  if (request.method === "POST") {
    let body = request.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); }
      catch (_) { return response.status(400).json({ error: "Invalid JSON" }); }
    }
    liked = body?.liked;
    if (typeof liked !== "boolean") return response.status(400).json({ error: "Invalid payload" });
  }

  const functionName = request.method === "POST" ? "set_site_like_state" : "get_site_like_state";
  const payload = { p_page_key: page, p_visitor_id: visitor };
  if (request.method === "POST") payload.p_liked = liked;

  try {
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!supabaseResponse.ok) {
      const supabaseError = (await supabaseResponse.text()).slice(0, 500);
      log("error", "Supabase RPC failed", { status: supabaseResponse.status, functionName, supabaseError });
      return response.status(502).json({ error: "Database request failed", code: "SUPABASE_RPC_FAILED" });
    }

    const [state] = await supabaseResponse.json();
    const result = { count: Number(state?.like_count) || 0, liked: Boolean(state?.liked) };
    log("info", "Likes request completed", { method: request.method, ...result });
    return response.status(200).json(result);
  } catch (error) {
    log("error", "Likes API failed", { error: error instanceof Error ? error.message : String(error) });
    return response.status(502).json({ error: "Database request failed" });
  }
};
