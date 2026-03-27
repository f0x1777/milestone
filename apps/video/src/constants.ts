// Video constants
export const FPS = 30;
export const DURATION_IN_SECONDS = 90;
export const TOTAL_FRAMES = FPS * DURATION_IN_SECONDS; // 2700

// Scene timing (in frames)
export const SCENES = {
  quiebre: { start: 0, duration: 12 * FPS }, // 0:00 – 0:12
  giro: { start: 12 * FPS, duration: 16 * FPS }, // 0:12 – 0:28
  mecanismo: { start: 28 * FPS, duration: 22 * FPS }, // 0:28 – 0:50
  producto: { start: 50 * FPS, duration: 25 * FPS }, // 0:50 – 1:15
  cierre: { start: 75 * FPS, duration: 15 * FPS }, // 1:15 – 1:30
} as const;

// Brand palette
export const COLORS = {
  blue: "#33B5E5",
  charcoal950: "#0a0a0a",
  charcoal900: "#1a1a1a",
  charcoal800: "#2a2a2a",
  charcoal700: "#3C3C3C",
  light: "#f6f6f6",
  white: "#ffffff",
  red: "#E53E3E",
  green: "#38A169",
} as const;

// Fonts (system-safe fallbacks, load custom via staticFile if available)
export const FONTS = {
  sans: "'Inter', 'Geist', system-ui, sans-serif",
  serif: "'Georgia', 'Instrument Serif', serif",
  mono: "'IBM Plex Mono', 'Courier New', monospace",
} as const;

// Narration text per scene (for ElevenLabs generation)
export const NARRATION = {
  quiebre:
    "Un grant se aprueba. Se transfieren los fondos. Y después... silencio. Nadie sabe si el dinero se usó bien hasta que es demasiado tarde.",
  giro: "Milestone es infraestructura para quienes financian trabajo real. Una capa de control que convierte grants en flujos condicionales: los fondos se liberan solo cuando hay evidencia verificada de avance. No después. No antes. Cuando corresponde.",
  mecanismo:
    "El sponsor deposita en un vault on-chain. El beneficiario sube evidencia — código, demos, entregables. Un reviewer evalúa y libera un tramo. Si algo no cierra, el grant se congela. Sin burocracia. Sin idas y vueltas por email. El cashflow responde a lo que realmente está pasando en el proyecto.",
  producto:
    "Para el granter, Milestone simplifica lo que hoy es un proceso manual y opaco. Crear un grant, asignar reviewers, definir caps de liberación — todo desde un solo lugar. Para el público, cada grant tiene una página de transparencia abierta: sin cuenta, sin fricción. Y cada decisión — cada liberación, cada pausa — queda anclada en Stellar con un hash verificable.",
  cierre:
    "Milestone. Porque financiar no debería ser un acto de fe.",
} as const;
