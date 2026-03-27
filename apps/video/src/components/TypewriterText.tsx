import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../constants";

/**
 * Premium typewriter effect with blinking cursor.
 */
export const TypewriterText: React.FC<{
  text: string;
  delay?: number;
  charsPerFrame?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: React.CSSProperties["fontStyle"];
  showCursor?: boolean;
  cursorColor?: string;
}> = ({
  text,
  delay = 0,
  charsPerFrame = 0.5,
  fontSize = 42,
  color = COLORS.white,
  fontFamily = FONTS.mono,
  fontWeight = 400,
  fontStyle = "normal",
  showCursor = true,
  cursorColor = COLORS.blue,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - delay);
  const charCount = Math.min(Math.floor(elapsed * charsPerFrame), text.length);
  const displayedText = text.slice(0, charCount);
  const isComplete = charCount >= text.length;
  const cursorVisible = showCursor && (isComplete ? elapsed % 20 < 12 : true);

  return (
    <div
      style={{
        fontSize,
        color,
        fontFamily,
        fontWeight,
        fontStyle,
        textAlign: "center",
        maxWidth: 1400,
        margin: "0 auto",
        lineHeight: 1.4,
        letterSpacing: "-0.01em",
      }}
    >
      {displayedText}
      <span
        style={{
          opacity: cursorVisible ? 0.8 : 0,
          color: cursorColor,
          fontWeight: 300,
          transition: "opacity 0.1s",
        }}
      >
        |
      </span>
    </div>
  );
};
