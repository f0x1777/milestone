import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SCENES, COLORS } from "./constants";
import { Scene1_ElQuiebre } from "./scenes/Scene1_ElQuiebre";
import { Scene2_ElGiro } from "./scenes/Scene2_ElGiro";
import { Scene3_ElMecanismo } from "./scenes/Scene3_ElMecanismo";
import { Scene4_ElProducto } from "./scenes/Scene4_ElProducto";
import { Scene5_ElCierre } from "./scenes/Scene5_ElCierre";

/**
 * Main composition — 90 seconds, 5 scenes.
 *
 * Audio: place the ElevenLabs-generated voiceover at public/audio/voiceover.mp3
 * Run `pnpm generate-audio` to create it, or add it manually.
 */
export const MilestonePitch: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.charcoal950,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Voiceover audio track ── */}
      <Audio src={staticFile("audio/voiceover.mp3")} volume={1} />

      {/* ── Scene 1: El Quiebre (0:00 – 0:12) ── */}
      <Sequence
        from={SCENES.quiebre.start}
        durationInFrames={SCENES.quiebre.duration}
        name="1 — El Quiebre"
      >
        <AbsoluteFill>
          <Scene1_ElQuiebre />
        </AbsoluteFill>
      </Sequence>

      {/* ── Scene 2: El Giro (0:12 – 0:28) ── */}
      <Sequence
        from={SCENES.giro.start}
        durationInFrames={SCENES.giro.duration}
        name="2 — El Giro"
      >
        <AbsoluteFill>
          <Scene2_ElGiro />
        </AbsoluteFill>
      </Sequence>

      {/* ── Scene 3: El Mecanismo (0:28 – 0:50) ── */}
      <Sequence
        from={SCENES.mecanismo.start}
        durationInFrames={SCENES.mecanismo.duration}
        name="3 — El Mecanismo"
      >
        <AbsoluteFill>
          <Scene3_ElMecanismo />
        </AbsoluteFill>
      </Sequence>

      {/* ── Scene 4: El Producto (0:50 – 1:15) ── */}
      <Sequence
        from={SCENES.producto.start}
        durationInFrames={SCENES.producto.duration}
        name="4 — El Producto"
      >
        <AbsoluteFill>
          <Scene4_ElProducto />
        </AbsoluteFill>
      </Sequence>

      {/* ── Scene 5: El Cierre (1:15 – 1:30) ── */}
      <Sequence
        from={SCENES.cierre.start}
        durationInFrames={SCENES.cierre.duration}
        name="5 — El Cierre"
      >
        <AbsoluteFill>
          <Scene5_ElCierre />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
