// The natural voices offered on the Ask page, shared by the page and the Worker.
// Each id is a Deepgram Aura-2 speaker. After changing this list, make the preview files again
// with scripts/make-voice-samples.sh.
export const VOICES = [
  { id: "draco", label: "Draco (British, male)" },
  { id: "pandora", label: "Pandora (British, female)" },
  { id: "apollo", label: "Apollo (American, male)" },
  { id: "arcas", label: "Arcas (American, male)" },
  { id: "orion", label: "Orion (American, male)" },
  { id: "thalia", label: "Thalia (American, female)" },
  { id: "andromeda", label: "Andromeda (American, female)" },
  { id: "helena", label: "Helena (American, female)" },
] as const;

export const DEFAULT_VOICE = "draco";

export const isVoice = (id: string) => VOICES.some((v) => v.id === id);

export const VOICE_SAMPLE = "Hello, this is how I sound when I read my answers out loud.";

/** Spell out the few words a speech model tends to stumble over. Only changes what is heard. */
export function forSpeech(text: string): string {
  return text
    .replace(/xg\s?gaffer/gi, "X G Gaffer")
    .replace(/\bMSc\b/g, "M.S.C.")
    .replace(/\bBSc\b/g, "B.S.C.")
    .replace(/\s*[·|]\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}
