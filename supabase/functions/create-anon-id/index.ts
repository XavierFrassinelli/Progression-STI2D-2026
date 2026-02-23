import { serve } from "https://deno.land/std@0.220.1/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANIMALS = [
  "aigle",
  "lion",
  "loup",
  "renard",
  "tigre",
  "ours",
  "lynx",
  "faucon",
  "panda",
  "bison",
  "chevre",
  "dauphin",
  "phoenix",
  "hibou",
  "cobra",
  "taureau",
];

const COLORS = [
  "bleu",
  "vert",
  "rouge",
  "jaune",
  "orange",
  "gris",
  "noir",
  "blanc",
  "turquoise",
  "corail",
  "violet",
  "sable",
];

function randomInt(min: number, max: number) {
  const range = max - min + 1;
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return min + (buffer[0] % range);
}

function generateAnonId() {
  const animal = ANIMALS[randomInt(0, ANIMALS.length - 1)].toUpperCase();
  const color = COLORS[randomInt(0, COLORS.length - 1)].toUpperCase();
  const number = randomInt(10, 99);
  return `${animal}-${number}-${color}`;
}

serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const anonId = generateAnonId();
  const body = JSON.stringify({ anonId });
  return new Response(body, {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
