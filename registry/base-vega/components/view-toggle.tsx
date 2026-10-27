// lume-custom: alternador de visualização (Lista, Quadro, Compacto). Ativo com
// anel inset de 1.5px na cor do texto, ícone na cor do texto e fundo a 7%;
// cantos arredondados só nas pontas do grupo (CUSTOM.md, item 16).
"use client";

import type { Icon } from "@tabler/icons-react";

import { cn } from "@/registry/base-vega/lib/utils";

export type ViewOption<T extends string> = {
  value: T;
  label: string;
  icon: Icon;
};

export function ViewToggle<T extends string>({
  options,
  value,
  onValueChange,
  label = "Modo de visualização",
  className,
}: {
  options: ViewOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  label?: string;
  className?: string;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: grupo de botões de alternância, fieldset traria borda e legenda de formulário
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex rounded-lg bg-card shadow-(--custom-outline-shadow) squircle:rounded-xl corner-squircle",
        className,
      )}
    >
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-label={opt.label}
            title={opt.label}
            aria-pressed={active}
            onClick={() => onValueChange(opt.value)}
            className={cn(
              "grid h-8 w-9 cursor-pointer place-items-center outline-none transition-colors focus-visible:ring-[1.5px] focus-visible:ring-ring/50",
              i === 0 && "rounded-l-lg squircle:rounded-l-xl",
              i === options.length - 1 && "rounded-r-lg squircle:rounded-r-xl",
              active
                ? "bg-foreground/7 text-foreground ring-[1.5px] ring-foreground ring-inset"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <opt.icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
