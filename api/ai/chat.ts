import { GoogleGenAI } from "@google/genai";

function applyCors(req: any, res: any) {
  const allowedOrigin = process.env.JAIRRESTAURA_ORIGIN;
  const origin = req.headers?.origin;
  if (allowedOrigin && origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

export default async function handler(req: any, res: any) {
  applyCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ success: false, error: "Método no permitido." });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const prompt = [body.prompt, body.query, body.message].find(
      (value) => typeof value === "string" && value.trim().length > 0
    );
    if (typeof prompt !== "string") {
      return res.status(400).json({ success: false, error: "Escribe una consulta para el asistente." });
    }
    if (prompt.length > 12000) {
      return res.status(413).json({ success: false, error: "La consulta supera el límite permitido." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        error: "El backend está publicado, pero falta configurar GEMINI_API_KEY en las variables de entorno de Vercel.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const systemInstruction =
      typeof body.systemInstruction === "string" && body.systemInstruction.length <= 4000
        ? body.systemInstruction
        : "Eres un asistente de apoyo profesional para reflexión y organización de consultas. No diagnostiques, no prescribas y no sustituyas el juicio de un profesional. Si faltan datos, formula preguntas prudentes. No solicites información personal identificable.";

    const config: Record<string, unknown> = { systemInstruction };
    if (body.jsonMode === true) config.responseMimeType = "application/json";

    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });
    const responseText = result.text || "";
    if (!responseText.trim()) {
      return res.status(502).json({ success: false, error: "Gemini no devolvió contenido. Inténtalo nuevamente." });
    }
    return res.status(200).json({ success: true, text: responseText });
  } catch (error: any) {
    // Avoid returning provider internals, request contents, or secrets to the browser.
    console.error("Gemini backend error:", error?.message || "unknown error");
    return res.status(502).json({
      success: false,
      error: "No fue posible completar la consulta con Gemini. Revisa la configuración del modelo y los registros del backend.",
    });
  }
}
