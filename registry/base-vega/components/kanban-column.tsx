// lume-custom: coluna e cartão do kanban do CRM LYX. Coluna em bg-kanban-col,
// sem borda e sem sombra; cartão bg-card com a sombra da casa; a cor da etapa
// fica só na bolinha (CUSTOM.md, item 15).
import type * as React from "react";

import { cn } from "@/registry/base-vega/lib/utils";

export function KanbanBoard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]",
        className,
      )}
      {...props}
    />
  );
}

export function KanbanColumn({
  title,
  count,
  dotClassName,
  children,
  className,
}: {
  title: string;
  count?: number;
  /** Cor da bolinha da etapa, como `bg-amber-500` ou `bg-nav-leads`. */
  dotClassName?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-lyx-card
      aria-label={title}
      className={cn(
        "flex w-72 shrink-0 flex-col gap-2 rounded-2xl bg-kanban-col p-1.5 pb-2 squircle:rounded-3xl corner-squircle",
        className,
      )}
    >
      <header className="flex items-center gap-2 px-2.5 pt-2.5 pb-1">
        <span
          aria-hidden
          className={cn(
            "size-2 shrink-0 rounded-full bg-muted-foreground",
            dotClassName,
          )}
        />
        <h2 className="truncate text-sm font-medium tracking-tight">{title}</h2>
        {count !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {count}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

export function KanbanCard({
  className,
  ...props
}: React.ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "flex flex-col gap-2.5 rounded-xl bg-card p-3.5 shadow-(--custom-shadow) transition-shadow hover:shadow-(--custom-shadow-lifted) squircle:rounded-2xl corner-squircle",
        className,
      )}
      {...props}
    />
  );
}

export function KanbanEmpty({
  children = "Nenhum item",
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="grid h-16 place-items-center rounded-xl text-xs text-muted-foreground">
      {children}
    </div>
  );
}
