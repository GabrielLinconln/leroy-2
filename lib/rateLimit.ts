const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

// ponytail: contador em memoria por instancia serverless; trocar por Redis/KV se houver abuso real
const hits = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(req: Request, now = Date.now()): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    if (hits.size > 5000) hits.clear();
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS;
}
