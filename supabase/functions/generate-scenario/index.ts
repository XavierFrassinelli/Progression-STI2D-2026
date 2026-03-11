import { serve } from "https://deno.land/std@0.220.1/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const REQUIRED_BLOCKS = [
  "acquerir",
  "traiter",
  "communiquer",
  "alimenter",
  "distribuer",
  "convertir",
  "transmettre",
];

type ScenarioItem = { name: string; targetBlock: string };
type ScenarioResponse = {
  title: string;
  instruction: string;
  items: ScenarioItem[];
};

function fallbackScenario(prompt: string): ScenarioResponse {
  return {
    title: `Scenario STI2D - ${prompt.slice(0, 32)}`,
    instruction: "Associez chaque composant a la fonction de chaine correspondante.",
    items: [
      { name: "Capteur de position", targetBlock: "acquerir" },
      { name: "Microcontroleur", targetBlock: "traiter" },
      { name: "Bus de communication", targetBlock: "communiquer" },
      { name: "Alimentation 24V", targetBlock: "alimenter" },
      { name: "Contacteur", targetBlock: "distribuer" },
      { name: "Moteur electrique", targetBlock: "convertir" },
      { name: "Transmission mecanique", targetBlock: "transmettre" },
    ],
  };
}

function parseScenario(rawText: string): ScenarioResponse {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Aucun JSON valide dans la reponse Gemini");
  }

  const scenario = JSON.parse(jsonMatch[0]);
  if (!scenario?.title || !scenario?.instruction || !Array.isArray(scenario?.items)) {
    throw new Error("Structure de scenario invalide");
  }

  const items = scenario.items
    .map((it: unknown) => {
      const obj = it as { name?: string; targetBlock?: string };
      return {
        name: String(obj?.name || "").trim(),
        targetBlock: String(obj?.targetBlock || "").trim().toLowerCase(),
      };
    })
    .filter((it: ScenarioItem) => it.name && REQUIRED_BLOCKS.includes(it.targetBlock));

  const dedup = new Map<string, ScenarioItem>();
  for (const block of REQUIRED_BLOCKS) {
    const found = items.find((it: ScenarioItem) => it.targetBlock === block);
    if (found) {
      dedup.set(block, found);
    }
  }

  if (dedup.size !== REQUIRED_BLOCKS.length) {
    const fb = fallbackScenario(String(scenario.title || "Scenario"));
    return fb;
  }

  return {
    title: String(scenario.title),
    instruction: String(scenario.instruction),
    items: REQUIRED_BLOCKS.map((b) => dedup.get(b) as ScenarioItem),
  };
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
    const body = await req.json().catch(() => ({}));
    const prompt = String(body?.prompt || "").trim();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Le champ prompt est requis." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY secret" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const promptTemplate = `Tu es un expert STI2D.
Genere un scenario de chaine d'information et d'energie pour: "${prompt}".

Retourne UNIQUEMENT un JSON strict:
{
  "title": "Titre court",
  "instruction": "Consigne claire pour l'eleve",
  "items": [
    {"name":"...","targetBlock":"acquerir"},
    {"name":"...","targetBlock":"traiter"},
    {"name":"...","targetBlock":"communiquer"},
    {"name":"...","targetBlock":"alimenter"},
    {"name":"...","targetBlock":"distribuer"},
    {"name":"...","targetBlock":"convertir"},
    {"name":"...","targetBlock":"transmettre"}
  ]
}

Contraintes:
- 7 items exactement, un par targetBlock de la liste.
- Noms techniques precis, niveau lycee STI2D.
- Pas de markdown, pas de texte hors JSON.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptTemplate }] }],
          generationConfig: { temperature: 0.7 },
        }),
      },
    );

    const payload = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: payload?.error?.message || "Gemini API error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText || typeof rawText !== "string") {
      return new Response(JSON.stringify(fallbackScenario(prompt)), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const scenario = parseScenario(rawText);
    return new Response(JSON.stringify(scenario), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", details: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
