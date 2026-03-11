import { serve } from "https://deno.land/std@0.220.1/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type RequestPayload = {
  subject?: string;
  topic?: string;
  difficulty?: string;
  questionCount?: number;
};

function badRequest(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function extractJsonText(raw: string) {
  const cleaned = raw.trim();
  if (cleaned.startsWith("```") && cleaned.includes("```")) {
    return cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
  return cleaned;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload = (await req.json()) as RequestPayload;
    const subject = payload.subject?.trim();
    const topic = payload.topic?.trim();
    const difficulty = payload.difficulty?.trim() || "Moyen";
    const questionCount = Number(payload.questionCount ?? 5);

    if (!subject) {
      return badRequest("Le champ subject est requis.");
    }
    if (!topic) {
      return badRequest("Le champ topic est requis.");
    }
    if (!Number.isFinite(questionCount) || questionCount < 1 || questionCount > 20) {
      return badRequest("questionCount doit etre entre 1 et 20.");
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY secret" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Genere un exercice QCM STI2D au format JSON strict.
Contraintes:
- Matiere: ${subject}
- Theme: ${topic}
- Difficulte: ${difficulty}
- Nombre de questions exact: ${questionCount}

Format JSON attendu:
{
  "title": "string",
  "subject": "string",
  "topic": "string",
  "difficulty": "string",
  "questions": [
    {
      "id": "string",
      "text": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "explanation": "string"
    }
  ]
}

Regles strictes:
- Retourne uniquement du JSON valide, sans markdown.
- correctAnswer doit etre un index numerique valide de options.
- Langue: francais.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    const geminiData = await geminiResponse.json();
    if (!geminiResponse.ok) {
      const details = geminiData?.error?.message || "Gemini API error";
      return new Response(JSON.stringify({ error: details }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText || typeof rawText !== "string") {
      return new Response(JSON.stringify({ error: "Empty Gemini response" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jsonText = extractJsonText(rawText);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return new Response(JSON.stringify({ error: "Gemini returned invalid JSON" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
