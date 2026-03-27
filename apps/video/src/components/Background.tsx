import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../constants";

/**
 * Premium animated background with grid, radial glow, and floating particles.
 */
export const PremiumBackground: React.FC<{
  variant?: "dark" | "gradient" | "glow";
  accentColor?: string;
  gridOpacity?: number;
}> = ({
  variant = "dark",
  accentColor = COLORS.blue,
  gridOpacity = 0.04,
}) => {
  const frame = useCurrentFrame();

  // Slow drift for glow position
  const glowX = 50 + Math.sin(frame * 0.008) * 10;
  const glowY = 50 + Math.cos(frame * 0.006) * 8;

  const bgColor =
    variant === "gradient"
      ? `linear-gradient(135deg, ${COLORS.charcoal950} 0%, ${COLORS.charcoal900} 50%, ${accentColor}08 100%)`
      : COLORS.charcoal950;

  return (
    <>
      {/* Base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: bgColor,
        }}
      />

      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${COLORS.white}${Math.round(gridOpacity * 255).toString(16).padStart(2, "0")} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.white}${Math.round(gridOpacity * 255).toString(16).padStart(2, "0")} 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Moving radial glow */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse 800px 600px at ${glowX}% ${glowY}%, ${accentColor}0a 0%, transparent 70%)`,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => {
        const speed = 0.3 + i * 0.15;
        const x = (15 + i * 28 + Math.sin(frame * 0.01 * speed + i) * 12) % 100;
        const y = (20 + i * 15 + Math.cos(frame * 0.008 * speed + i * 2) * 10) % 100;
        const particleOpacity = 0.03 + Math.sin(frame * 0.02 + i) * 0.02;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 3 + i * 0.5,
              height: 3 + i * 0.5,
              borderRadius: "50%",
              backgroundColor: i % 2 === 0 ? accentColor : COLORS.white,
              opacity: particleOpacity,
            }}
          />
        );
      })}
    </>
  );
};

/**
 * Noise/grain texture overlay for film-like premium feel.
 */
export const NoiseOverlay: React.FC<{ opacity?: number }> = ({
  opacity = 0.03,
}) => {
  const frame = useCurrentFrame();
  // Shift noise pattern slightly each frame
  const offset = (frame * 7) % 200;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundPosition: `${offset}px ${offset}px`,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};
