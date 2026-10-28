// lume-custom: os gráficos do CRM LYX. Barras verticais em degradê (claro na
// base, cor cheia no topo) com coluna realçada e etiqueta no hover, e linhas de
// medidor em degradê horizontal para "por origem", funil e metas. Mais leves
// que o evilcharts e com a cara do protótipo (CUSTOM.md, item 22).
"use client";

import type * as React from "react";
import { useId, useState } from "react";

import { cn } from "@/registry/base-vega/lib/utils";

/** Degradês por tom. Classes por extenso para o Tailwind enxergar no build. */
export const LYX_TONES = {
  violet: {
    v: "from-violet-500 to-violet-300",
    h: "from-violet-300 to-violet-500",
  },
  rose: { v: "from-rose-500 to-rose-300", h: "from-rose-300 to-rose-500" },
  sky: { v: "from-sky-500 to-sky-300", h: "from-sky-300 to-sky-500" },
  emerald: {
    v: "from-emerald-500 to-emerald-300",
    h: "from-emerald-300 to-emerald-500",
  },
  amber: { v: "from-amber-500 to-amber-300", h: "from-amber-300 to-amber-500" },
  orange: {
    v: "from-orange-500 to-orange-300",
    h: "from-orange-300 to-orange-500",
  },
  blue: { v: "from-blue-500 to-blue-300", h: "from-blue-300 to-blue-500" },
  neutral: {
    v: "from-neutral-500 to-neutral-300",
    h: "from-neutral-300 to-neutral-500",
  },
  /** Preto no claro, branco no escuro: metas e totais. */
  ink: {
    v: "from-foreground to-foreground/70",
    h: "from-foreground/80 to-foreground",
  },
} as const;

export type LyxTone = keyof typeof LYX_TONES;

function niceMax(max: number) {
  if (max <= 0) return 1;
  const step = 10 ** Math.floor(Math.log10(max));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (m * step >= max) return m * step;
  }
  return 10 * step;
}

export type BarDatum = { label: string; value: number };

/** Barras verticais em degradê com grade leve, eixo y em 5 marcas e etiqueta
 * no hover. O eixo x mostra só o primeiro e o último rótulo. */
export function GradientBarChart({
  data,
  tone = "violet",
  height = 220,
  format = (n) => n.toLocaleString("pt-BR"),
  unit = "",
  label,
  className,
}: {
  data: BarDatum[];
  tone?: LyxTone;
  height?: number;
  format?: (n: number) => string;
  /** Sufixo da etiqueta, como "leads". */
  unit?: string;
  /** Resumo para leitor de tela. */
  label: string;
  className?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const ticks = [4, 3, 2, 1, 0].map((i) => (max / 4) * i);
  const id = useId();
  const h = hover !== null ? data[hover] : undefined;

  return (
    <figure
      aria-label={label}
      className={cn("relative m-0 flex flex-col gap-2", className)}
    >
      <div className="flex gap-3" style={{ height }}>
        <div className="flex flex-col justify-between pb-px text-right text-[11px] text-muted-foreground tabular-nums">
          {ticks.map((t) => (
            <span
              key={t}
              className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0"
            >
              {format(t)}
            </span>
          ))}
        </div>
        <div className="relative flex-1">
          {ticks.map((t, i) => (
            <span
              key={t}
              aria-hidden
              className="absolute inset-x-0 h-px bg-[repeating-linear-gradient(90deg,var(--border)_0_4px,transparent_4px_8px)]"
              style={{ top: `${(i / 4) * 100}%` }}
            />
          ))}
          <div
            className="absolute inset-0 flex items-end gap-[1.2%]"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const i = Math.floor(
                ((e.clientX - r.left) / r.width) * data.length,
              );
              setHover(Math.max(0, Math.min(data.length - 1, i)));
            }}
            onPointerLeave={() => setHover(null)}
          >
            {data.map((d, i) => (
              <div
                key={`${id}-${d.label}`}
                className={cn(
                  "relative flex h-full flex-1 items-end rounded-md transition-colors",
                  hover === i && "bg-muted/70",
                )}
              >
                <span
                  className={cn(
                    "lyx-grow-y block w-full rounded-t-[5px] rounded-b-[2px] bg-linear-to-b transition-opacity",
                    LYX_TONES[tone].v,
                    hover !== null && hover !== i && "opacity-55",
                  )}
                  style={
                    {
                      height: `${(d.value / max) * 100}%`,
                      "--d": `${Math.min(i * 18, 500)}ms`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
          {h && hover !== null && (
            <div
              className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-lg bg-popover px-2.5 py-1.5 text-xs whitespace-nowrap text-popover-foreground shadow-(--custom-shadow)"
              style={{
                left: `${Math.min(88, Math.max(12, ((hover + 0.5) / data.length) * 100))}%`,
              }}
            >
              <span className="text-muted-foreground">{h.label}</span>
              <span className="ml-2 font-medium tabular-nums">
                {format(h.value)}
                {unit && ` ${unit}`}
              </span>
            </div>
          )}
        </div>
      </div>
      <figcaption className="flex justify-between pl-9 text-[11px] text-muted-foreground tabular-nums">
        <span>{data[0]?.label}</span>
        <span>{data.at(-1)?.label}</span>
      </figcaption>
    </figure>
  );
}

/** Uma linha de medidor: rótulo à esquerda, valor à direita e a barra em
 * degradê embaixo. */
export function MeterRow({
  label,
  value,
  fraction,
  tone = "violet",
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  fraction: number;
  tone?: LyxTone;
  className?: string;
}) {
  const pct = Math.min(1, Math.max(0, fraction)) * 100;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate">{label}</span>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {value}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "lyx-grow-x h-full rounded-full bg-linear-to-r",
            LYX_TONES[tone].h,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
