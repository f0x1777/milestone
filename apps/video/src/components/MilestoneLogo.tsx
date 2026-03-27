import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONTS } from "../constants";

/**
 * Official Milestone logo — three parallelograms (M mark) + wordmark.
 * Matches apps/web/src/components/milestone-logo.tsx exactly.
 */
export const MilestoneLogo: React.FC<{
  delay?: number;
  size?: number;
  showTagline?: boolean;
  taglineText?: string;
  white?: boolean;
}> = ({
  delay = 0,
  size = 1,
  showTagline = false,
  taglineText = "Conditional grants on Stellar",
  white = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fillColor = white ? COLORS.white : COLORS.charcoal700;

  // Each parallelogram animates in sequence
  const bar1 = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
  });
  const bar2 = spring({
    frame: frame - delay - 6,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
  });
  const bar3 = spring({
    frame: frame - delay - 12,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
  });

  // Wordmark fades in after bars
  const wordmarkSpr = spring({
    frame: frame - delay - 20,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  // Tagline
  const taglineSpr = spring({
    frame: frame - delay - 40,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  // Overall scale
  const scaleFactor = size;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24 * scaleFactor,
      }}
    >
      {/* Logo row: M mark + wordmark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16 * scaleFactor,
        }}
      >
        {/* M Mark — three parallelograms */}
        <svg
          width={48 * scaleFactor}
          height={40 * scaleFactor}
          viewBox="0 0 48 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 32L14 8L20 8L10 32Z"
            fill={fillColor}
            opacity={interpolate(bar1, [0, 1], [0, 1])}
            transform={`translateY(${interpolate(bar1, [0, 1], [12, 0])})`}
          />
          <path
            d="M16 32L26 8L32 8L22 32Z"
            fill={fillColor}
            opacity={interpolate(bar2, [0, 1], [0, 1])}
            transform={`translateY(${interpolate(bar2, [0, 1], [12, 0])})`}
          />
          <path
            d="M28 32L38 8L44 8L34 32Z"
            fill={COLORS.blue}
            opacity={interpolate(bar3, [0, 1], [0, 1])}
            transform={`translateY(${interpolate(bar3, [0, 1], [12, 0])})`}
          />
        </svg>

        {/* Wordmark */}
        <span
          style={{
            fontSize: 28 * scaleFactor,
            fontFamily: FONTS.sans,
            fontWeight: 500,
            color: fillColor,
            letterSpacing: "-0.01em",
            opacity: interpolate(wordmarkSpr, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(wordmarkSpr, [0, 1], [-10, 0])}px)`,
          }}
        >
          Milestone
        </span>
      </div>

      {/* Tagline */}
      {showTagline && (
        <div
          style={{
            fontSize: 18 * scaleFactor,
            fontFamily: FONTS.serif,
            fontStyle: "italic",
            color: COLORS.blue,
            opacity: interpolate(taglineSpr, [0, 1], [0, 0.9]),
            transform: `translateY(${interpolate(taglineSpr, [0, 1], [10, 0])}px)`,
            letterSpacing: "0.02em",
          }}
        >
          {taglineText}
        </div>
      )}
    </div>
  );
};

/**
 * Just the M mark icon — for watermarks and subtle branding.
 */
export const MilestoneIcon: React.FC<{
  size?: number;
  opacity?: number;
}> = ({ size = 1, opacity = 1 }) => {
  return (
    <svg
      width={48 * size}
      height={40 * size}
      viewBox="0 0 48 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <path d="M4 32L14 8L20 8L10 32Z" fill={COLORS.white} />
      <path d="M16 32L26 8L32 8L22 32Z" fill={COLORS.white} />
      <path d="M28 32L38 8L44 8L34 32Z" fill={COLORS.blue} />
    </svg>
  );
};
