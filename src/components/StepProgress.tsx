import { Check } from "lucide-react";

interface Props {
  steps: string[];
  current: number; // 1-indexed
}

export default function StepProgress({ steps, current }: Props) {
  return (
    <ol className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <li key={label} className="flex-1 flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
                done
                  ? "bg-bk-dark text-white"
                  : active
                  ? "bg-bk-yellow text-bk-dark"
                  : "bg-bk-beige text-bk-muted"
              }`}
            >
              {done ? <Check className="w-3.5 h-3.5" /> : idx}
            </div>
            <span
              className={`text-[12px] font-semibold truncate hidden sm:inline ${
                active || done ? "text-bk-dark" : "text-bk-muted"
              }`}
            >
              {label}
            </span>
            {idx < steps.length && (
              <span className={`flex-1 h-px ${done ? "bg-bk-dark" : "bg-bk-beige"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
