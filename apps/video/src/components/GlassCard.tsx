import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS } from "../constants";

/**
 * Glass-morphism card with animated entrance — premium UI element.
 */
export const GlassCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
  width?: number | string;
  padding?: number;
  borderColor?: string;
  glowColor?: string;
}> = ({
  children,
  delay = 0,
  width = "100%",
  padding = 28,
  borderColor = `${COLORS.charcoal700}30`,
  glowColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80, mass: 0.8 },
  });

  const opacity = interpolate(spr, [0, 1], [0, 1]);
  const translateY = interpolate(spr, [0, 1], [20, 0]);
  const scale = interpolate(spr, [0, 1], [0.97, 1]);

  return (
    <div
      style={{
        width,
        padding,
        background: `linear-gradient(135deg, ${COLORS.charcoal900}e0, ${COLORS.charcoal800}90)`,
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 ${COLORS.white}06`,
      }}
    >
      {/* Top highlight line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.white}10, transparent)`,
        }}
      />

      {/* Optional glow */}
      {glowColor && (
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: glowColor,
            opacity: 0.06,
            filter: "blur(40px)",
          }}
        />
      )}

      {children}
    </div>
  );
};
