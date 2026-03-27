import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { COLORS, FONTS } from "../constants";

const STEPS = [
  { label: "DEPOSIT", color: COLORS.blue, icon: "↓" },
  { label: "EVIDENCE", color: "#38A169", icon: "◆" },
  { label: "REVIEW", color: "#F6AD55", icon: "⊘" },
  { label: "RELEASE", color: COLORS.blue, icon: "→" },
];

const PAUSE_STEP = { label: "PAUSE", color: COLORS.red, icon: "‖" };

/**
 * Premium animated flow diagram with glass-morphism cards and connecting lines.
 */
export const FlowDiagram: React.FC<{
  delay?: number;
  showPause?: boolean;
}> = ({ delay = 0, showPause = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const allSteps = showPause ? [...STEPS, PAUSE_STEP] : STEPS;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        width: "100%",
        padding: "0 60px",
      }}
    >
      {allSteps.map((step, i) => {
        const stepDelay = delay + i * 20;
        const spr = spring({
          frame: frame - stepDelay,
          fps,
          config: { damping: 16, stiffness: 90, mass: 0.7 },
        });
        const opacity = interpolate(spr, [0, 1], [0, 1]);
        const scale = interpolate(spr, [0, 1], [0.85, 1]);
        const translateY = interpolate(spr, [0, 1], [15, 0]);

        // Subtle glow pulse after appearance
        const glowFrame = frame - stepDelay - 25;
        const glowOpacity =
          glowFrame > 0 ? 0.15 + Math.sin(glowFrame * 0.06) * 0.08 : 0;

        const isLast = i === allSteps.length - 1;
        const isPause = step.label === "PAUSE";

        return (
          <React.Fragment key={step.label}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                opacity,
                transform: `scale(${scale}) translateY(${translateY}px)`,
                position: "relative",
              }}
            >
              {/* Glow behind card */}
              <div
                style={{
                  position: "absolute",
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: step.color,
                  opacity: glowOpacity,
                  filter: "blur(30px)",
                  top: -10,
                }}
              />

              {/* Card */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: isPause ? 16 : 50,
                  background: `linear-gradient(135deg, ${COLORS.charcoal900}, ${COLORS.charcoal800})`,
                  border: `1.5px solid ${step.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  color: step.color,
                  position: "relative",
                  boxShadow: `0 4px 24px ${step.color}15, inset 0 1px 0 ${COLORS.white}08`,
                }}
              >
                {step.icon}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: 13,
                  fontFamily: FONTS.mono,
                  color: step.color,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  opacity: 0.9,
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 28,
                  position: "relative",
                }}
              >
                {/* Animated line */}
                <div
                  style={{
                    width: 70,
                    height: 1,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Background line */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `${COLORS.charcoal700}40`,
                    }}
                  />
                  {/* Animated fill */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${interpolate(
                        spring({
                          frame: frame - stepDelay - 15,
                          fps,
                          config: { damping: 20, stiffness: 80 },
                        }),
                        [0, 1],
                        [0, 100]
                      )}%`,
                      background: `linear-gradient(90deg, ${step.color}, ${allSteps[i + 1].color})`,
                    }}
                  />
                </div>
                {/* Arrow */}
                <div
                  style={{
                    color: allSteps[i + 1].color,
                    fontSize: 10,
                    opacity: interpolate(
                      spring({
                        frame: frame - stepDelay - 18,
                        fps,
                        config: { damping: 20, stiffness: 80 },
                      }),
                      [0, 1],
                      [0, 0.6]
                    ),
                    marginLeft: -2,
                    marginBottom: 28,
                  }}
                >
                  ▸
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
