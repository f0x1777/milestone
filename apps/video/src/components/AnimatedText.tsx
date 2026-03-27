import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONTS } from "../constants";

/**
 * Premium text entrance — fades in with smooth spring physics and subtle blur.
 */
export const AnimatedText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: React.CSSProperties["fontStyle"];
  textAlign?: React.CSSProperties["textAlign"];
  maxWidth?: number;
  lineHeight?: number;
  letterSpacing?: string;
}> = ({
  text,
  delay = 0,
  fontSize = 48,
  color = COLORS.white,
  fontFamily = FONTS.sans,
  fontWeight = 400,
  fontStyle = "normal",
  textAlign = "center",
  maxWidth = 1400,
  lineHeight = 1.4,
  letterSpacing = "-0.01em",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: { damping: 22, stiffness: 90, mass: 0.7 },
  });

  const opacity = interpolate(spr, [0, 1], [0, 1]);
  const translateY = interpolate(spr, [0, 1], [28, 0]);
  const blur = interpolate(spr, [0, 0.5], [4, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
        fontSize,
        color,
        fontFamily,
        fontWeight,
        fontStyle,
        textAlign,
        maxWidth,
        lineHeight,
        letterSpacing,
        margin: "0 auto",
      }}
    >
      {text}
    </div>
  );
};

/**
 * Word-by-word reveal with staggered springs — premium feel.
 */
export const StaggeredText: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: React.CSSProperties["fontStyle"];
  wordGap?: number;
  staggerFrames?: number;
}> = ({
  text,
  delay = 0,
  fontSize = 48,
  color = COLORS.white,
  fontFamily = FONTS.sans,
  fontWeight = 400,
  fontStyle = "normal",
  wordGap = 12,
  staggerFrames = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: wordGap,
      }}
    >
      {words.map((word, i) => {
        const spr = spring({
          frame: frame - delay - i * staggerFrames,
          fps,
          config: { damping: 20, stiffness: 100, mass: 0.6 },
        });
        return (
          <span
            key={i}
            style={{
              fontSize,
              color,
              fontFamily,
              fontWeight,
              fontStyle,
              opacity: interpolate(spr, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spr, [0, 1], [20, 0])}px)`,
              filter: `blur(${interpolate(spr, [0, 0.4], [3, 0], { extrapolateRight: "clamp" })}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
