// lume-custom: o cartão de número do CRM LYX. Diferente do StatCard do lume
// (rótulo e valor na mesma linha), aqui o valor fica grande embaixo do rótulo
// e a linha de apoio (variação e contexto) logo abaixo, como no protótipo. No
// dark o valor ganha o degradê --stat-grad-* (CUSTOM.md, itens 18 e 25).
import type { Icon } from "@tabler/icons-react";
import type * as React from "react";

import { cn } from "@/registry/base-vega/lib/utils";

export function LyxStatCard({
  label,
  value,
  icon: IconCmp,
  iconClassName,
  delta,
  hint,
  chart,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon?: Icon;
  /** Cor do ícone, como `text-emerald-500`. */
  iconClassName?: string;
  /** Variação em fração (0.097 = +9,7%); positiva verde, negativa vermelha. */
  delta?: number;
  /** Texto de apoio depois da variação, como "vs. período anterior". */
  hint?: React.ReactNode;
  /** Minigráfico que encosta no pé do cartão. */
  chart?: React.ReactNode;
  className?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl bg-card text-card-foreground shadow-(--custom-shadow) squircle:rounded-3xl corner-squircle",
        className,
      )}
    >
      <div className="flex flex-col gap-1 p-5 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          {IconCmp && (
            <IconCmp
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground",
                iconClassName,
              )}
            />
          )}
          <span className="truncate">{label}</span>
        </div>
        <div className="w-fit text-2xl font-medium tracking-tight tabular-nums dark:bg-linear-95 dark:from-stat-grad-1 dark:via-stat-grad-2 dark:to-stat-grad-3 dark:bg-clip-text dark:text-transparent">
          {value}
        </div>
        {(delta !== undefined || hint) && (
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {delta !== undefined && (
              <span
                className={cn(
                  "font-medium tabular-nums",
                  up
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {up ? "+" : "−"}
                {Math.abs(delta * 100).toLocaleString("pt-BR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
                %
              </span>
            )}
            {hint}
          </div>
        )}
      </div>
      {chart && <div className="mt-auto">{chart}</div>}
    </div>
  );
}
