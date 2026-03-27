import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONTS } from "../constants";
import { GlassCard } from "../components/GlassCard";
import { PremiumBackground, NoiseOverlay } from "../components/Background";

/**
 * ESCENA 4 — El Producto (0:50 – 1:15)
 * Premium: Glass-morphism dashboard cards, animated progress bars,
 * audit trail with hash reveals, then transparency view transition.
 */

const GRANTS = [
  {
    title: "DeFi Education Program",
    amount: "$120,000",
    released: 42,
    status: "Active",
    milestones: "3 / 5",
    color: COLORS.blue,
  },
  {
    title: "Open Source SDK Grant",
    amount: "$85,000",
    released: 78,
    status: "Active",
    milestones: "4 / 5",
    color: COLORS.green,
  },
  {
    title: "Community Validator Node",
    amount: "$200,000",
    released: 15,
    status: "In Review",
    milestones: "1 / 6",
    color: "#F6AD55",
  },
];

const AUDIT = [
  { action: "release_submitted", hash: "0xa3f7...c912", time: "2m ago", color: COLORS.blue },
  { action: "evidence_accepted", hash: "0xb1e4...d8f3", time: "1h ago", color: COLORS.green },
  { action: "grant_funded", hash: "0xc9d2...a4b7", time: "3h ago", color: COLORS.blue },
  { action: "milestone_approved", hash: "0xf2a8...e1c5", time: "1d ago", color: "#F6AD55" },
];

export const Scene4_ElProducto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Dashboard (0–400), Phase 2: Transparency (400–750)
  const dashboardOpacity = interpolate(frame, [380, 420], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const transparencyOpacity = interpolate(frame, [400, 440], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [700, 750], [1, 0], {
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
      <PremiumBackground variant="dark" gridOpacity={0.025} />
      <NoiseOverlay opacity={0.02} />

      {/* ── PHASE 1: Dashboard ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: dashboardOpacity,
          padding: "50px 80px",
          gap: 24,
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            opacity: interpolate(
              spring({ frame, fps, config: { damping: 20, stiffness: 70 } }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: COLORS.blue,
                boxShadow: `0 0 8px ${COLORS.blue}60`,
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontFamily: FONTS.mono,
                color: COLORS.blue,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Grant Control Room
            </span>
          </div>
          <span
            style={{
              fontSize: 12,
              fontFamily: FONTS.mono,
              color: `${COLORS.charcoal700}80`,
            }}
          >
            milestone.app/dashboard
          </span>
        </div>

        {/* Grant cards row */}
        <div style={{ display: "flex", gap: 16, width: "100%" }}>
          {GRANTS.map((grant, i) => {
            const cardSpr = spring({
              frame: frame - 15 - i * 12,
              fps,
              config: { damping: 18, stiffness: 90, mass: 0.7 },
            });
            const progressWidth = interpolate(
              spring({
                frame: frame - 60 - i * 15,
                fps,
                config: { damping: 25, stiffness: 50 },
              }),
              [0, 1],
              [0, grant.released]
            );

            return (
              <div
                key={grant.title}
                style={{
                  flex: 1,
                  opacity: interpolate(cardSpr, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(cardSpr, [0, 1], [24, 0])}px) scale(${interpolate(cardSpr, [0, 1], [0.96, 1])})`,
                }}
              >
                <GlassCard delay={15 + i * 12} padding={22} glowColor={grant.color}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: COLORS.white,
                      fontFamily: FONTS.sans,
                      marginBottom: 14,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {grant.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      fontFamily: FONTS.mono,
                      marginBottom: 16,
                    }}
                  >
                    <span style={{ color: `${COLORS.light}80` }}>{grant.amount}</span>
                    <span
                      style={{
                        color: grant.color,
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: `${grant.color}15`,
                        fontSize: 11,
                      }}
                    >
                      {grant.status}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    style={{
                      height: 3,
                      backgroundColor: `${COLORS.charcoal700}30`,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progressWidth}%`,
                        background: `linear-gradient(90deg, ${grant.color}, ${grant.color}80)`,
                        borderRadius: 2,
                        boxShadow: `0 0 8px ${grant.color}40`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 11,
                      fontFamily: FONTS.mono,
                      color: `${COLORS.charcoal700}80`,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Milestones {grant.milestones}</span>
                    <span>{grant.released}% released</span>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* Audit trail */}
        <GlassCard delay={60} padding={20}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: COLORS.green,
                boxShadow: `0 0 6px ${COLORS.green}60`,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontFamily: FONTS.mono,
                color: COLORS.blue,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Audit Trail
            </span>
          </div>
          {AUDIT.map((evt, i) => {
            const evtSpr = spring({
              frame: frame - 90 - i * 18,
              fps,
              config: { damping: 20, stiffness: 80 },
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px 0",
                  borderBottom:
                    i < AUDIT.length - 1
                      ? `1px solid ${COLORS.charcoal700}15`
                      : "none",
                  opacity: interpolate(evtSpr, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(evtSpr, [0, 1], [-12, 0])}px)`,
                  fontSize: 13,
                  fontFamily: FONTS.mono,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: evt.color,
                    }}
                  />
                  <span style={{ color: `${COLORS.light}c0` }}>{evt.action}</span>
                </div>
                <span style={{ color: `${COLORS.blue}80`, fontSize: 12 }}>{evt.hash}</span>
                <span style={{ color: `${COLORS.charcoal700}60`, fontSize: 11 }}>{evt.time}</span>
              </div>
            );
          })}
        </GlassCard>
      </div>

      {/* ── PHASE 2: Transparency ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: transparencyOpacity,
          padding: "60px 100px",
          gap: 28,
        }}
      >
        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.green,
              boxShadow: `0 0 8px ${COLORS.green}60`,
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontFamily: FONTS.mono,
              color: COLORS.green,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Public Transparency — No Login Required
          </span>
        </div>

        {/* Big transparency card */}
        <GlassCard
          delay={420}
          padding={44}
          borderColor={`${COLORS.green}25`}
          glowColor={COLORS.green}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: COLORS.white,
                fontFamily: FONTS.sans,
                letterSpacing: "-0.02em",
              }}
            >
              DeFi Education Program
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontFamily: FONTS.mono,
                color: COLORS.green,
                border: `1px solid ${COLORS.green}30`,
                padding: "5px 14px",
                borderRadius: 100,
                background: `${COLORS.green}08`,
              }}
            >
              <span>✓</span> VERIFIED ON-CHAIN
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 48, marginBottom: 24 }}>
            {[
              { label: "Total Funded", value: "$120,000", color: COLORS.white },
              { label: "Released", value: "$50,400", color: COLORS.blue },
              { label: "Milestones", value: "3 of 5", color: COLORS.white },
              { label: "Audit Events", value: "12", color: COLORS.white },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: FONTS.mono,
                    color: `${COLORS.charcoal700}90`,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: stat.color,
                    fontFamily: FONTS.mono,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Hash anchor */}
          <div
            style={{
              borderTop: `1px solid ${COLORS.charcoal700}20`,
              paddingTop: 16,
              fontSize: 12,
              fontFamily: FONTS.mono,
              color: `${COLORS.charcoal700}70`,
            }}
          >
            Decision hash:{" "}
            <span style={{ color: `${COLORS.blue}b0` }}>
              0xa3f7b2c912d8e4f5...
            </span>
            {"  ·  "}anchored on Stellar
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
