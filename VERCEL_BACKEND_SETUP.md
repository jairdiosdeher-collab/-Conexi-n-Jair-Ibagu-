# Backend Gemini para JAIRRESTAURA

Este repositorio incorpora funciones serverless independientes para Vercel:

- `GET /api/health`: estado del servicio y disponibilidad de configuración (sin revelar la clave).
- `GET /api/ai/chat`: comprobación de conexión compatible con el campo de endpoint de JAIRRESTAURA.
- `POST /api/ai/chat`: consulta a Gemini. Acepta `prompt`, `query` o `message` como texto de entrada y responde `{ "success": true, "text": "..." }`.

## Variables de entorno en Vercel

Configurar en Project Settings → Environment Variables:

- `GEMINI_API_KEY`: clave privada de Google AI Studio. Nunca incluirla en el frontend, Git ni en el campo URL de JAIRRESTAURA.
- `GEMINI_MODEL` (opcional): modelo habilitado para la cuenta. Predeterminado: `gemini-2.5-flash`.
- `JAIRRESTAURA_ORIGIN`: origen exacto autorizado de la aplicación: `https://jairrestaura-j-h.vercel.app` (sin rutas ni barra final).

Seleccionar Preview y Production solo cuando se desee habilitar ambos entornos. Si la app y el backend comparten dominio, no hace falta configurar CORS.

## Despliegue y prueba

Tras desplegar esta rama en Vercel:

1. Abrir `https://DOMINIO-DEL-BACKEND.vercel.app/api/health`. Debe responder JSON con `success: true`.
2. Abrir `https://DOMINIO-DEL-BACKEND.vercel.app/api/ai/chat`. El GET debe responder JSON con `success: true`.
3. Comprobar `geminiConfigured`. Debe ser `true` después de guardar la variable y volver a desplegar.
4. Enviar un POST JSON a `/api/ai/chat` con `{ "prompt": "Responde únicamente: conexión de prueba correcta." }`.
5. En JAIRRESTAURA, pegar la URL completa `https://DOMINIO-DEL-BACKEND.vercel.app/api/ai/chat`.

No enviar datos identificables ni información clínica sensible. Este endpoint aún no implementa autenticación de usuarios, cuotas por usuario, almacenamiento clínico ni controles suficientes para tratar datos de pacientes. No utilizarlo con información real de pacientes hasta completar revisión de seguridad y privacidad.
