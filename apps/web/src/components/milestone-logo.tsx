export function MilestoneLogo({ className = "h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* M mark - three parallelograms */}
      <path d="M4 32L14 8L20 8L10 32Z" fill="#3C3C3C" />
      <path d="M16 32L26 8L32 8L22 32Z" fill="#3C3C3C" />
      <path d="M28 32L38 8L44 8L34 32Z" fill="#33B5E5" />
      {/* Wordmark */}
      <text
        x="52"
        y="28"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        fontWeight="500"
        fontSize="22"
        fill="currentColor"
      >
        Milestone
      </text>
    </svg>
  );
}

export function MilestoneLogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M4 32L14 8L20 8L10 32Z" fill="#3C3C3C" />
      <path d="M16 32L26 8L32 8L22 32Z" fill="#3C3C3C" />
      <path d="M28 32L38 8L44 8L34 32Z" fill="#33B5E5" />
    </svg>
  );
}
