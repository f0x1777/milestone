import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONTS } from "../constants";
import { MilestoneLogo } from "../components/MilestoneLogo";
import { TypewriterText } from "../components/TypewriterText";
import { PremiumBackground, NoiseOverlay } from "../components/Background";

/**
 * ESCENA 2 — El Giro (0:12 – 0:28)
 * Premium: Logo reveals with sequential bar animation.
 * Tagline types out. Three value pills appear with glass effect.
 */

const VALUE_PILLS = [
  { label: "Conditional", icon: "◇" },
  { label: "Verifiable", icon: "◈" },
  { label: "Transparent", icon: "◆" },
];

export const Scene2_ElGiro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Horizontal divider line expands from center
  const lineSpr = spring({
    frame: frame - 100,
    fps,
    config: { damping: 25, stiffness: 60 },
  });

  // Value pills appear staggered
  const pillsDelay = 200;

  // Fade out
  const fadeOut = interpolate(frame, [440, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        opacity: fadeOut,
        overflow: "hidden",
      }}
    >
      <PremiumBackground variant="gradient" accentColor={COLORS.blue} gridOpacity={0.035} />
      <NoiseOverlay opacity={0.02} />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {/* Logo — uses official M mark + wordmark */}
        <MilestoneLogo delay={8} size={2.4} />

        {/* Divider line */}
        <div
          style={{
            width: interpolate(lineSpr, [0, 1], [0, 400]),
            height: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.blue}40, transparent)`,
          }}
        />

        {/* Tagline typewriter */}
        <TypewriterText
          text="Fund outcomes, not promises."
          delay={50}
          charsPerFrame={0.55}
          fontSize={44}
          fontFamily={FONTS.serif}
          fontStyle="italic"
          color={COLORS.blue}
          cursorColor={COLORS.blue}
        />

        {/* Value pills */}
        <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
          {VALUE_PILLS.map((pill, i) => {
            const spr = spring({
              frame: frame - pillsDelay - i * 16,
              fps,
              config: { damping: 18, stiffness: 90, mass: 0.7 },
            });
            const opacity = interpolate(spr, [0, 1], [0, 1]);
            const scale = interpolate(spr, [0, 1], [0.9, 1]);

            return (
              <div
                key={pill.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  borderRadius: 100,
                  background: `linear-gradient(135deg, ${COLORS.charcoal900}c0, ${COLORS.charcoal800}80)`,
                  border: `1px solid ${COLORS.charcoal700}30`,
                  opacity,
                  transform: `scale(${scale})`,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 ${COLORS.white}06`,
                }}
              >
                <span style={{ color: COLORS.blue, fontSize: 14 }}>
                  {pill.icon}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontFamily: FONTS.mono,
                    color: `${COLORS.light}a0`,
                    letterSpacing: "0.06em",
                    fontWeight: 500,
                  }}
                >
                  {pill.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
