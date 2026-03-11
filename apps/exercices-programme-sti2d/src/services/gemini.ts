import { Exercise, Subject } from "../types";

const FUNCTIONS_BASE_URL =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_URL ||
  "https://pttzsstvvgvdgdsbxfuk.functions.supabase.co";

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export async function generateExercise(subject: Subject, topic: string, difficulty: string, questionCount: number): Promise<Exercise> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (SUPABASE_ANON_KEY) {
    headers.apikey = SUPABASE_ANON_KEY;
    headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
  }

  const response = await fetch(`${FUNCTIONS_BASE_URL}/generate-exercise`, {
    method: "POST",
    headers,
    body: JSON.stringify({ subject, topic, difficulty, questionCount }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const details = payload?.error || `Erreur API (${response.status})`;
    throw new Error(details);
  }

  return payload as Exercise;
}
