/**
 * ElevenLabs Voiceover Generator for Milestone Pitch Video
 *
 * Generates audio for each scene and a combined full voiceover.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=your-key pnpm generate-audio
 *
 * Requires:
 *   - ElevenLabs API key (https://elevenlabs.io)
 *   - A voice ID (defaults to "pMsXgVXv3BLzUgSXRplE" — a warm male Spanish voice)
 *     You can browse voices at https://elevenlabs.io/voice-library
 */

import fs from "node:fs";
import path from "node:path";

// ─── Config ───────────────────────────────────────────────────────────────────

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error(
    "Error: ELEVENLABS_API_KEY is required.\n" +
      "Usage: ELEVENLABS_API_KEY=your-key pnpm generate-audio"
  );
  process.exit(1);
}

// Voice ID — change this to match your preferred voice.
// Browse: https://api.elevenlabs.io/v1/voices
// "pMsXgVXv3BLzUgSXRplE" = Mateo (Spanish, male, warm)
// You can also use "ErXwobaYiN019PkySvjV" = Antoni (English/neutral)
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "pMsXgVXv3BLzUgSXRplE";

const MODEL_ID = "eleven_multilingual_v2"; // best for Spanish

const OUTPUT_DIR = path.resolve(__dirname, "../public/audio");

// ─── Narration segments ───────────────────────────────────────────────────────

const SEGMENTS: { name: string; text: string }[] = [
  {
    name: "01_quiebre",
    text: "Un grant se aprueba. Se transfieren los fondos. Y después... silencio. Nadie sabe si el dinero se usó bien hasta que es demasiado tarde.",
  },
  {
    name: "02_giro",
    text: "Milestone es infraestructura para quienes financian trabajo real. Una capa de control que convierte grants en flujos condicionales: los fondos se liberan solo cuando hay evidencia verificada de avance. No después. No antes. Cuando corresponde.",
  },
  {
    name: "03_mecanismo",
    text: "El sponsor deposita en un vault on-chain. El beneficiario sube evidencia — código, demos, entregables. Un reviewer evalúa y libera un tramo. Si algo no cierra, el grant se congela. Sin burocracia. Sin idas y vueltas por email. El cashflow responde a lo que realmente está pasando en el proyecto.",
  },
  {
    name: "04_producto",
    text: "Para el granter, Milestone simplifica lo que hoy es un proceso manual y opaco. Crear un grant, asignar reviewers, definir caps de liberación — todo desde un solo lugar. Para el público, cada grant tiene una página de transparencia abierta: sin cuenta, sin fricción. Y cada decisión — cada liberación, cada pausa — queda anclada en Stellar con un hash verificable.",
  },
  {
    name: "05_cierre",
    text: "Milestone. Porque financiar no debería ser un acto de fe.",
  },
];

// ─── ElevenLabs TTS ───────────────────────────────────────────────────────────

async function generateSpeech(
  text: string,
  outputPath: string
): Promise<void> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY!,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.6,
        similarity_boost: 0.78,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `ElevenLabs API error (${response.status}): ${errorBody}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  console.log(`  -> ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Ensure output dir
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("Generating voiceover segments with ElevenLabs...\n");
  console.log(`Voice ID: ${VOICE_ID}`);
  console.log(`Model:    ${MODEL_ID}`);
  console.log(`Output:   ${OUTPUT_DIR}\n`);

  // Generate individual segments
  for (const segment of SEGMENTS) {
    const outputPath = path.join(OUTPUT_DIR, `${segment.name}.mp3`);
    console.log(`[${segment.name}]`);
    await generateSpeech(segment.text, outputPath);
  }

  // Generate full combined voiceover
  console.log("\n[full voiceover]");
  const fullText = SEGMENTS.map((s) => s.text).join("\n\n");
  const fullPath = path.join(OUTPUT_DIR, "voiceover.mp3");
  await generateSpeech(fullText, fullPath);

  console.log("\nDone! Audio files saved to public/audio/");
  console.log(
    "\nNext steps:"
  );
  console.log(
    "  1. Uncomment the <Audio> tag in src/MilestonePitch.tsx"
  );
  console.log("  2. Run: pnpm dev (to preview in Remotion Studio)");
  console.log("  3. Run: pnpm render (to export final MP4)");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
