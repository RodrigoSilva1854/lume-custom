// lume-custom: mapa de unidades do empreendimento (Disponibilidade). Andares em
// linhas, unidades em ladrilhos coloridos pela situação; um filtro apaga as
// outras e a unidade escolhida ganha anel (CUSTOM.md, item 26).
"use client";

import { cn } from "@/registry/base-vega/lib/utils";

export type UnitStatus = "disponivel" | "reservada" | "vendida" | "bloqueada";

export const UNIT_STATUS: Record<
  UnitStatus,
  { label: string; tile: string; dot: string }
> = {
  disponivel: {
    label: "Disponível",
    tile: "bg-emerald-500/12 text-emerald-800 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  reservada: {
    label: "Reservada",
    tile: "bg-amber-500/14 text-amber-800 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  vendida: {
    label: "Vendida",
    tile: "bg-muted text-foreground/80",
    dot: "bg-neutral-400",
  },
  bloqueada: {
    label: "Bloqueada",
    tile: "bg-red-500/10 text-red-800 dark:text-red-300",
    dot: "bg-red-500",
  },
};

export type Unit = { numero: string; status: UnitStatus };
export type Floor = { andar: number; units: Unit[] };

export function UnitMap({
  floors,
  filter = "todas",
  selected,
  onSelect,
  className,
}: {
  floors: Floor[];
  /** Situação em destaque; as outras ficam apagadas. */
  filter?: UnitStatus | "todas";
  selected?: string;
  onSelect?: (unit: Unit) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {floors.map((f) => (
        <div key={f.andar} className="flex items-center gap-4">
          <span className="w-16 shrink-0 text-sm whitespace-nowrap text-muted-foreground">
            {f.andar}º andar
          </span>
          <div className="flex flex-wrap gap-2">
            {f.units.map((u) => {
              const st = UNIT_STATUS[u.status];
              const off = filter !== "todas" && filter !== u.status;
              const on = selected === u.numero;
              return (
                <button
                  key={u.numero}
                  type="button"
                  aria-pressed={on}
                  aria-label={`Unidade ${u.numero}: ${st.label}`}
                  onClick={() => onSelect?.(u)}
                  className={cn(
                    "flex h-14 w-19 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg outline-none transition-[opacity,box-shadow] focus-visible:ring-[1.5px] focus-visible:ring-ring/50",
                    st.tile,
                    off && "opacity-25",
                    on &&
                      "ring-2 ring-foreground ring-offset-2 ring-offset-card",
                  )}
                >
                  <span className="text-sm font-medium tabular-nums">
                    {u.numero}
                  </span>
                  <span className="text-[11px]">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
