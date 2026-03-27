import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Milestone — Pitch",
  description:
    "Fund outcomes, not promises. Conditional grant disbursement on Stellar.",
};

export default function PitchPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        gap: 32,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Milestone
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#33B5E5",
            marginTop: 8,
            fontStyle: "italic",
            fontFamily: "Georgia, serif",
          }}
        >
          Fund outcomes, not promises.
        </p>
      </div>

      {/* Video player */}
      <video
        controls
        autoPlay
        playsInline
        style={{
          width: "100%",
          maxWidth: 1120,
          borderRadius: 12,
          border: "1px solid #2a2a2a",
          backgroundColor: "#000",
        }}
      >
        <source src="/video/milestone-pitch.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Footer caption */}
      <p
        style={{
          fontSize: 14,
          color: "#3C3C3C",
          textAlign: "center",
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: "0.04em",
        }}
      >
        90s pitch — Conditional grants on Stellar &middot; Built for the Stellar
        Community Fund
      </p>
    </div>
  );
}
