import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONTS } from "../constants";
import { PremiumBackground, NoiseOverlay } from "../components/Background";
import { StaggeredText } from "../components/AnimatedText";

/**
 * ESCENA 1 — El Quiebre (0:00 – 0:12)
 * Premium: floating grant amounts as data points, freeze + glitch,
 * then the central question fades in with weight.
 */

const AMOUNTS = [
  { text: "$250K", x: 12, y: 15 },
  { text: "$1.2M", x: 75, y: 10 },
  { text: "$80K", x: 30, y: 72 },
  { text: "$3.5M", x: 85, y: 65 },
  { text: "$420K", x: 55, y: 20 },
  { text: "$750K", x: 18, y: 48 },
  { text: "$2.1M", x: 68, y: 78 },
  { text: "$150K", x: 42, y: 42 },
];

export const Scene1_ElQuiebre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const freezeFrame = 100; // ~3.3s
  const isFrozen = frame >= freezeFrame;

  // Glitch at freeze point
  const glitchActive = frame >= freezeFrame && frame <= freezeFrame + 15;
  const glitchX = glitchActive ? Math.sin(frame * 3.7) * 6 : 0;
  const glitchY = glitchActive ? Math.cos(frame * 5.1) * 3 : 0;

  // Central amount counter
  const displayAmount = isFrozen
    ? "$2,100,000"
    : `$${Math.floor(((frame * 137 + 500000) % 9000000) + 100000).toLocaleString()}`;

  // After freeze: "approved" check flickers then dies
  const approvedOpacity = isFrozen
    ? interpolate(frame, [freezeFrame, freezeFrame + 20, freezeFrame + 40, freezeFrame + 50], [0, 1, 1, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  // Silence dots
  const dotsStart = freezeFrame + 60;
  const dotsOpacity = interpolate(frame, [dotsStart, dotsStart + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Main question text
  const questionStart = freezeFrame + 90;

  // Scene fade out
  const fadeOut = interpolate(frame, [320, 360], [1, 0], {
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
      <PremiumBackground variant="dark" gridOpacity={0.03} />
      <NoiseOverlay opacity={0.025} />

      {/* Floating amounts — data visualization feel */}
      {AMOUNTS.map((item, i) => {
        const drift = isFrozen ? 0 : Math.sin(frame * 0.02 + i * 1.5) * 8;
        const itemOpacity = isFrozen
          ? interpolate(frame, [freezeFrame, freezeFrame + 30], [0.15, 0.03], {
              extrapolateRight: "clamp",
            })
          : 0.08 + Math.sin(frame * 0.03 + i) * 0.04;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y + drift * 0.1}%`,
              fontSize: 20,
              fontFamily: FONTS.mono,
              color: COLORS.blue,
              opacity: itemOpacity,
              transform: `translateY(${drift}px)`,
              letterSpacing: "0.05em",
            }}
          >
            {item.text}
          </div>
        );
      })}

      {/* Connecting lines between amounts — data network */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: isFrozen ? 0.02 : 0.04,
        }}
      >
        {AMOUNTS.slice(0, -1).map((a, i) => {
          const b = AMOUNTS[i + 1];
          return (
            <line
              key={i}
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke={COLORS.blue}
              strokeWidth={0.5}
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Big counter */}
        <div
          style={{
            fontSize: 110,
            fontFamily: FONTS.mono,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: "-0.03em",
            transform: `translate(${glitchX}px, ${glitchY}px)`,
            textShadow: glitchActive
              ? `${-glitchX * 2}px 0 ${COLORS.blue}80, ${glitchX * 2}px 0 ${COLORS.red}60`
              : `0 0 60px ${COLORS.blue}10`,
          }}
        >
          {displayAmount}
        </div>

        {/* "Grant approved" badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: approvedOpacity,
            padding: "8px 20px",
            borderRadius: 100,
            border: `1px solid ${COLORS.green}40`,
            background: `${COLORS.green}10`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.green,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontFamily: FONTS.mono,
              color: COLORS.green,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Grant Approved
          </span>
        </div>

        {/* Silence dots */}
        <div
          style={{
            display: "flex",
            gap: 12,
            opacity: dotsOpacity,
            marginTop: 20,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: COLORS.charcoal700,
                opacity: ((frame + i * 10) % 30) < 18 ? 0.8 : 0.2,
              }}
            />
          ))}
        </div>

        {/* Central question */}
        <div style={{ marginTop: 16, maxWidth: 900 }}>
          <StaggeredText
            text="Nadie sabe si el dinero se usó bien hasta que es demasiado tarde."
            delay={questionStart}
            fontSize={32}
            color={`${COLORS.light}90`}
            fontFamily={FONTS.serif}
            fontStyle="italic"
            staggerFrames={3}
          />
        </div>
      </div>
    </div>
  );
};
