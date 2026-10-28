// lume-custom: seleção simples por lista de textos, sobre o Select do lume
// (Base UI). Nunca o <select> nativo: a lista abre num popover com a cara do
// design system, igual em todo navegador (CUSTOM.md, item 29).
"use client";

import { cn } from "@/registry/base-vega/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/base-vega/ui/select";

export function LyxSelect({
  value,
  onValueChange,
  options,
  allLabel,
  label,
  size = "default",
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  /** Primeira opção que significa "sem filtro", como "Todos". */
  allLabel?: string;
  /** Nome acessível do campo. */
  label: string;
  size?: "sm" | "default";
  className?: string;
}) {
  const items = allLabel ? [allLabel, ...options] : options;
  return (
    <Select<string, false>
      value={value || allLabel || options[0]}
      onValueChange={(v) => v !== null && onValueChange(v)}
    >
      <SelectTrigger
        size={size}
        aria-label={label}
        className={cn("w-full justify-between", className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        align="start"
        sideOffset={6}
        className="w-auto min-w-(--anchor-width) rounded-xl p-1 squircle:rounded-2xl"
      >
        {items.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
