import { Link } from "@tanstack/react-router";

interface Props {
  /** "dark" for light backgrounds, "light" for dark backgrounds (footer) */
  tone?: "dark" | "light";
  /** size in px for the wordmark */
  size?: number;
  /** show small tagline under brand */
  withTagline?: boolean;
  /** wrap in Link to / */
  asLink?: boolean;
  className?: string;
}

export default function BrandLogo({
  tone = "dark",
  size = 22,
  withTagline = false,
  asLink = true,
  className = "",
}: Props) {
  const base = tone === "light" ? "text-white" : "text-bk-dark";
  const accent = "text-bk-yellow";

  const inner = (
    <span className={`flex flex-col leading-none ${className}`}>
      <span
        className={`font-extrabold tracking-tight lowercase ${base}`}
        style={{ fontSize: `${size}px`, letterSpacing: "-0.02em" }}
      >
        bluekios<span className={accent}>k</span>
      </span>
      {withTagline && (
        <span
          className={`text-[10px] font-medium mt-0.5 ${tone === "light" ? "text-white/60" : "text-bk-muted"}`}
        >
          Ghana's marketplace
        </span>
      )}
    </span>
  );

  if (!asLink) return inner;

  return (
    <Link to="/" className="inline-flex items-center shrink-0" aria-label="bluekiosk home">
      {inner}
    </Link>
  );
}
