import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONTS } from "../constants";
import { MilestoneLogo } from "../components/MilestoneLogo";
import { PremiumBackground, NoiseOverlay } from "../components/Background";

/**
 * ESCENA 5 — El Cierre (1:15 – 1:30)
 * Premium: Logo with breathing animation, closing statement,
 * Stellar Community Fund badge. Slow, cinematic. Fades to black.
 */
export const Scene5_ElCierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Breathing scale
  const breathe = 1 + Math.sin(frame * 0.03) * 0.01;

  // Closing statement
  const closingSpr = spring({
    frame: frame - 120,
    fps,
    config: { damping: 25, stiffness: 40, mass: 1 },
  });

  // Stellar badge
  const stellarSpr = spring({
    frame: frame - 200,
    fps,
    config: { damping: 22, stiffness: 45 },
  });

  // Divider line
  const lineSpr = spring({
    frame: frame - 80,
    fps,
    config: { damping: 25, stiffness: 50 },
  });

  // Slow fade to pure black at the very end
  const fadeOut = interpolate(frame, [380, 450], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <PremiumBackground variant="dark" accentColor={COLORS.blue} gridOpacity={0.02} />
      <NoiseOverlay opacity={0.02} />

      {/* Content with fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          opacity: fadeOut,
        }}
      >
        {/* Logo with breathing */}
        <div style={{ transform: `scale(${breathe})` }}>
          <MilestoneLogo delay={8} size={2.8} showTagline taglineText="Conditional grants on Stellar" />
        </div>

        {/* Divider */}
        <div
          style={{
            width: interpolate(lineSpr, [0, 1], [0, 200]),
            height: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.blue}30, transparent)`,
            marginTop: 8,
          }}
        />

        {/* Closing statement */}
        <div
          style={{
            fontSize: 34,
            fontFamily: FONTS.serif,
            fontStyle: "italic",
            color: `${COLORS.light}e0`,
            opacity: interpolate(closingSpr, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(closingSpr, [0, 1], [16, 0])}px)`,
            filter: `blur(${interpolate(closingSpr, [0, 0.5], [3, 0], { extrapolateRight: "clamp" })}px)`,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
            letterSpacing: "0.01em",
          }}
        >
          Porque financiar no debería ser un acto de fe.
        </div>

        {/* Stellar Community Fund badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: interpolate(stellarSpr, [0, 1], [0, 0.55]),
            transform: `translateY(${interpolate(stellarSpr, [0, 1], [10, 0])}px)`,
            marginTop: 16,
            padding: "8px 20px",
            borderRadius: 100,
            border: `1px solid ${COLORS.charcoal700}20`,
          }}
        >
          <span style={{ color: COLORS.blue, fontSize: 14 }}>✦</span>
          <span
            style={{
              fontSize: 13,
              fontFamily: FONTS.mono,
              color: `${COLORS.charcoal700}a0`,
              letterSpacing: "0.06em",
            }}
          >
            Built for the Stellar Community Fund
          </span>
        </div>
      </div>

      {/* Final black overlay for cinematic end */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: COLORS.charcoal950,
          opacity: interpolate(frame, [400, 450], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </div>
  );
};
