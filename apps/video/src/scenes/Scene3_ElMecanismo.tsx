import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONTS } from "../constants";
import { FlowDiagram } from "../components/FlowDiagram";
import { AnimatedText } from "../components/AnimatedText";
import { PremiumBackground, NoiseOverlay } from "../components/Background";
import { MilestoneIcon } from "../components/MilestoneLogo";

/**
 * ESCENA 3 — El Mecanismo (0:28 – 0:50)
 * Premium: Section label reveals, flow diagram builds piece by piece,
 * bottom insight line. Stellar badge orbits.
 */
export const Scene3_ElMecanismo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section label
  const labelSpr = spring({
    frame: frame - 5,
    fps,
    config: { damping: 20, stiffness: 70 },
  });

  // Subtitle line
  const subtitleDelay = 260;

  // Stellar orbit
  const orbitAngle = frame * 0.012;

  // Fade out
  const fadeOut = interpolate(frame, [620, 660], [1, 0], {
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
      <PremiumBackground variant="dark" accentColor={COLORS.blue} gridOpacity={0.03} />
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
          gap: 56,
          padding: "0 80px",
        }}
      >
        {/* Section label with line accents */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: interpolate(labelSpr, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(labelSpr, [0, 1], [10, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 32,
              height: 1,
              background: `${COLORS.blue}60`,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontFamily: FONTS.mono,
              color: COLORS.blue,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            How it works
          </span>
          <div
            style={{
              width: 32,
              height: 1,
              background: `${COLORS.blue}60`,
            }}
          />
        </div>

        {/* Flow diagram */}
        <FlowDiagram delay={30} showPause />

        {/* Bottom insight line */}
        <div style={{ maxWidth: 800 }}>
          <AnimatedText
            text="El cashflow responde a lo que realmente está pasando en el proyecto."
            delay={subtitleDelay}
            fontSize={26}
            color={`${COLORS.light}70`}
            fontFamily={FONTS.serif}
            fontStyle="italic"
            letterSpacing="0.01em"
          />
        </div>
      </div>

      {/* Stellar badge — bottom right with orbit */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          right: 44,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: interpolate(
            spring({
              frame: frame - 80,
              fps,
              config: { damping: 22, stiffness: 50 },
            }),
            [0, 1],
            [0, 0.5]
          ),
        }}
      >
        <div
          style={{
            transform: `rotate(${orbitAngle}rad)`,
            display: "flex",
          }}
        >
          <MilestoneIcon size={0.5} opacity={0.6} />
        </div>
        <span
          style={{
            fontSize: 12,
            fontFamily: FONTS.mono,
            color: COLORS.charcoal700,
            letterSpacing: "0.06em",
          }}
        >
          Built on Stellar
        </span>
      </div>
    </div>
  );
};
