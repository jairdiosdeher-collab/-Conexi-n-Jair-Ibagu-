/**
 * Vercel serverless health endpoint.
 * Does not expose credentials or patient data.
 */
function applyCors(req: any, res: any) {
  const allowedOrigin = process.env.JAIRRESTAURA_ORIGIN;
  const origin = req.headers?.origin;
  if (allowedOrigin && origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

export default function handler(req: any, res: any) {
  applyCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ success: false, error: "Método no permitido." });
  }
  return res.status(200).json({
    success: true,
    status: "ok",
    service: "jairrestaura-gemini-backend",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
}
