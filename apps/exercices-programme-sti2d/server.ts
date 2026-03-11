import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  console.log("Gemini API Key present:", !!process.env.GEMINI_API_KEY);

  // API Route for generating exercises
  app.post("/api/generate", async (req, res) => {
    const { subject, topic, difficulty, questionCount } = req.body;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Génère un exercice de type QCM pour un élève de STI2D.
        Matière: ${subject}
        Thème: ${topic}
        Difficulté: ${difficulty}
        Nombre de questions: ${questionCount || 5}
        L'exercice doit comporter exactement ${questionCount || 5} questions techniques précises avec des explications pédagogiques.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    correctAnswer: { type: Type.NUMBER },
                    explanation: { type: Type.STRING }
                  },
                  required: ["id", "text", "options", "correctAnswer", "explanation"]
                }
              }
            },
            required: ["title", "subject", "topic", "difficulty", "questions"]
          }
        }
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Erreur lors de la génération de l'exercice" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting Vite in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in production mode...");
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist", "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log("Environment:", process.env.NODE_ENV || 'development');
  });

  server.on('error', (err) => {
    console.error("Server error:", err);
  });
}

startServer();
