import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface CTA {
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  primaryCta?: CTA;
  secondaryCta?: CTA;
}

function CtaButton({ cta }: { cta: CTA }) {
  const cls =
    cta.variant === "secondary"
      ? "inline-flex items-center justify-center text-[14px] font-semibold border border-bk-beige text-bk-dark px-5 py-2.5 rounded-full hover:bg-bk-page transition"
      : "inline-flex items-center justify-center text-[14px] font-semibold bg-bk-yellow text-bk-dark px-6 py-3 rounded-full hover:bg-bk-yellow-hover transition";
  if (cta.to) {
    return (
      <Link to={cta.to as any} className={cls}>
        {cta.label}
      </Link>
    );
  }
  return (
    <button onClick={cta.onClick} className={cls}>
      {cta.label}
    </button>
  );
}

export default function EmptyState({ icon: Icon, title, description, primaryCta, secondaryCta }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-bk-beige p-10 md:p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-bk-page flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-bk-muted" />
      </div>
      <h3 className="text-[18px] font-bold text-bk-dark mb-1.5">{title}</h3>
      {description && <p className="text-[14px] text-bk-muted max-w-md mx-auto mb-6">{description}</p>}
      {(primaryCta || secondaryCta) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {primaryCta && <CtaButton cta={primaryCta} />}
          {secondaryCta && <CtaButton cta={{ ...secondaryCta, variant: secondaryCta.variant ?? "secondary" }} />}
        </div>
      )}
    </div>
  );
}
