export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-milestone-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-charcoal-400 sm:text-base">
        {description}
      </p>
    </div>
  );
}
