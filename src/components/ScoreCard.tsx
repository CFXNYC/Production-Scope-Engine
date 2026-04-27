import type { ReactNode } from "react";

interface ScoreCardProps {
  label: string;
  value: string | number;
  detail?: string;
  accent?: "clear" | "attention" | "elevated" | "critical" | "neutral";
  children?: ReactNode;
}

const accentClasses = {
  clear: "text-clear border-clear/40",
  attention: "text-attention border-attention/40",
  elevated: "text-elevated border-elevated/40",
  critical: "text-critical border-critical/40",
  neutral: "text-bone border-white/10",
};

export function ScoreCard({ label, value, detail, accent = "neutral", children }: ScoreCardProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-panel/85 p-5 shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
          <div className={`mt-3 text-4xl font-semibold ${accentClasses[accent].split(" ")[0]}`}>{value}</div>
        </div>
        <div className={`rounded-full border px-3 py-1 text-xs font-medium ${accentClasses[accent]}`}>{detail}</div>
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}
