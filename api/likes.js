const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PAGE_PATTERN = /^[a-z0-9-]{1,40}$/;

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

  if (!['GET', 'POST'].includes(request.method)) {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !secretKey) {
    log("error", "Supabase environment variables are missing", {
      hasUrl: Boolean(supabaseUrl),
      hasSecretKey: Boolean(secretKey)
    });
    return response.status(503).json({ error: "Likes are not configured" });
  }

  const page = String(request.query.page || "");
  const visitor = String(request.query.visitor || "");
  if (!PAGE_PATTERN.test(page) || !UUID_PATTERN.test(visitor)) {
    return response.status(400).json({ error: "Invalid page or visitor" });
  }

  const headers = { apikey: secretKey };
  const tableUrl = `${supabaseUrl}/rest/v1/site_likes`;

  try {
    if (request.method === 'POST') {
      let body = request.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); }
        catch (_) { return response.status(400).json({ error: "Invalid JSON" }); }
      }
      const shouldLike = body?.liked;
      if (typeof shouldLike !== "boolean") return response.status(400).json({ error: "Invalid payload" });

      if (shouldLike) {
        const write = await fetch(`${tableUrl}?on_conflict=page_key,visitor_id`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" },
          body: JSON.stringify({ page_key: page, visitor_id: visitor })
        });
        if (!write.ok) throw new Error(`Supabase insert failed: ${write.status}`);
      } else {
        const remove = await fetch(`${tableUrl}?page_key=eq.${encodeURIComponent(page)}&visitor_id=eq.${encodeURIComponent(visitor)}`, {
          method: "DELETE",
          headers
        });
        if (!remove.ok) throw new Error(`Supabase delete failed: ${remove.status}`);
      }
    }

    const [countResult, visitorResult] = await Promise.all([
      fetch(`${tableUrl}?page_key=eq.${encodeURIComponent(page)}&select=visitor_id`, {
        method: "HEAD",
        headers: { ...headers, Prefer: "count=exact" }
      }),
      fetch(`${tableUrl}?page_key=eq.${encodeURIComponent(page)}&visitor_id=eq.${encodeURIComponent(visitor)}&select=visitor_id&limit=1`, { headers })
    ]);

    if (!countResult.ok || !visitorResult.ok) {
      const visitorError = visitorResult.ok ? "" : (await visitorResult.text()).slice(0, 500);
      log("error", "Supabase read failed", {
        countStatus: countResult.status,
        visitorStatus: visitorResult.status,
        supabaseError: visitorError
      });
      return response.status(502).json({
        error: "Database request failed",
        code: visitorResult.status === 404 ? "TABLE_NOT_FOUND" : "SUPABASE_READ_FAILED"
      });
    }
    const range = countResult.headers.get("content-range") || "*/0";
    const count = Number(range.split("/")[1]) || 0;
    const visitorRows = await visitorResult.json();
    log("info", "Likes request completed", { method: request.method, count, liked: visitorRows.length > 0 });
    return response.status(200).json({ count, liked: visitorRows.length > 0 });
  } catch (error) {
    log("error", "Likes API failed", { error: error instanceof Error ? error.message : String(error) });
    return response.status(502).json({ error: "Database request failed" });
  }
};
