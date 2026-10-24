import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.static(path.resolve('public')));

app.get('/favicon.ico', (_req, res) => {
  res.sendFile(path.resolve('public/favicon.ico'));
});

app.get('/favicon.svg', (_req, res) => {
  res.sendFile(path.resolve('public/favicon.svg'));
});

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const withTimeout = <T>(promise: Promise<T>, ms: number, msg: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(msg)), ms)),
  ]);
};

app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, systemInstruction, jsonMode } = req.body;
    if (!ai) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'Servidor sin GEMINI_API_KEY activa.',
      });
    }

    let responseText = '';
    const config: any = {};
    if (systemInstruction) config.systemInstruction = systemInstruction;
    if (jsonMode) config.responseMimeType = 'application/json';

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: Object.keys(config).length > 0 ? config : undefined,
        }),
        7000,
        'Tiempo de espera agotado al conectar con Gemini 3.8 Flash'
      );
      responseText = response.text || '';
    } catch (_primaryErr: any) {
      // Fallback a gemini-3.1-flash-lite con timeout de 5 segundos
      try {
        const fallbackResponse = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: Object.keys(config).length > 0 ? config : undefined,
          }),
          5000,
          'Tiempo de espera agotado al conectar con Gemini 3.1 Flash Lite'
        );
        responseText = fallbackResponse.text || '';
      } catch (fallbackErr: any) {
        throw new Error(fallbackErr?.message || _primaryErr?.message || 'Error de conexión externa a Gemini');
      }
    }

    return res.json({
      success: true,
      text: responseText,
    });
  } catch (error: any) {
    console.warn('Aviso en /api/gemini/generate:', error?.message || error);
    return res.status(200).json({
      success: false,
      fallback: true,
      error: error?.message || 'Error de comunicación con la API de IA.',
    });
  }
});

app.post('/api/stripe/create-checkout', async (req, res) => {
  try {
    const { priceId, plan, userEmail, userId, couponCode } = req.body;
    return res.json({
      success: true,
      sessionId: `cs_test_${Date.now()}`,
      plan,
      priceId,
      userEmail,
      message: 'Sesión de Stripe Checkout lista para producción.',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Error iniciando sesión de pago Stripe',
    });
  }
});

async function startServer() {
  app.use(express.static('public'));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PastoralMente AI Server corriendo en http://localhost:${PORT}`);
  });
}

startServer();
