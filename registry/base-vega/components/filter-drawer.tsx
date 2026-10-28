// lume-custom: os filtros laterais do CRM LYX. Uma gaveta à direita (Sheet do
// lume) montada a partir de grupos de campos (seleção, chips de múltipla
// escolha e caixas de marcar), com visões salvas, "Limpar tudo" e "Ver
// resultados (n)"; mais o botão "Mais filtros" com a contagem e a linha de
// filtros ativos removíveis (CUSTOM.md, item 28).
"use client";

import { IconFilter, IconX } from "@tabler/icons-react";
import { useState } from "react";

import { cn } from "@/registry/base-vega/lib/utils";
import { Button } from "@/registry/base-vega/ui/button";
import { Checkbox } from "@/registry/base-vega/ui/checkbox";
import { Input } from "@/registry/base-vega/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/base-vega/ui/native-select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/registry/base-vega/ui/sheet";

export type FilterField =
  | { id: string; label: string; type: "select"; options: string[] }
  | { id: string; label: string; type: "chips"; options: string[] }
  | { id: string; label: string; type: "check" };

export type FilterGroup = { title: string; fields: FilterField[] };

export type FilterValues = Record<string, string | string[] | boolean>;

export type SavedView = { name: string; value: FilterValues };

const ALL = "Todos";

/** Quantos filtros estão de fato ativos. */
export function countFilters(value: FilterValues) {
  return Object.values(value).filter((v) =>
    Array.isArray(v)
      ? v.length > 0
      : typeof v === "boolean"
        ? v
        : !!v && v !== ALL,
  ).length;
}

/** Lista legível dos filtros ativos, para a linha de chips removíveis. */
export function activeFilters(groups: FilterGroup[], value: FilterValues) {
  const out: { key: string; id: string; label: string; option?: string }[] = [];
  for (const g of groups) {
    for (const f of g.fields) {
      const v = value[f.id];
      if (f.type === "check" && v === true)
        out.push({ key: f.id, id: f.id, label: f.label });
      if (f.type === "select" && typeof v === "string" && v && v !== ALL)
        out.push({ key: f.id, id: f.id, label: `${f.label}: ${v}` });
      if (f.type === "chips" && Array.isArray(v))
        for (const o of v)
          out.push({
            key: `${f.id}:${o}`,
            id: f.id,
            label: `${f.label}: ${o}`,
            option: o,
          });
    }
  }
  return out;
}

/** Botão "Mais filtros" com a contagem de filtros ativos. */
export function FilterButton({
  count,
  onClick,
  className,
}: {
  count: number;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button variant="outline" onClick={onClick} className={className}>
      <IconFilter />
      Mais filtros
      {count > 0 && (
        <span className="grid size-4.5 place-items-center rounded-full bg-foreground text-[10px] font-medium text-background tabular-nums">
          {count}
        </span>
      )}
    </Button>
  );
}

/** Linha de filtros ativos, cada um com um X para tirar, e "Limpar". */
export function ActiveFilters({
  groups,
  value,
  onChange,
}: {
  groups: FilterGroup[];
  value: FilterValues;
  onChange: (v: FilterValues) => void;
}) {
  const list = activeFilters(groups, value);
  if (!list.length) return null;
  const remove = (item: (typeof list)[number]) => {
    const next = { ...value };
    const cur = next[item.id];
    if (item.option && Array.isArray(cur))
      next[item.id] = cur.filter((o) => o !== item.option);
    else delete next[item.id];
    onChange(next);
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {list.map((item) => (
        <span
          key={item.key}
          className="inline-flex h-7 items-center gap-1 rounded-full bg-muted pr-1 pl-3 text-xs"
        >
          {item.label}
          <button
            type="button"
            aria-label={`Tirar ${item.label}`}
            onClick={() => remove(item)}
            className="grid size-5 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <IconX className="size-3" />
          </button>
        </span>
      ))}
      <Button variant="ghost" size="xs" onClick={() => onChange({})}>
        Limpar filtros
      </Button>
    </div>
  );
}

const CHIP =
  "inline-flex h-8 cursor-pointer items-center rounded-full bg-card px-3 text-sm shadow-(--custom-outline-shadow) transition-colors hover:bg-muted aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:shadow-none";

/** A gaveta de filtros. */
export function FilterDrawer({
  open,
  onOpenChange,
  groups,
  value,
  onChange,
  resultCount,
  savedViews = [],
  onSaveView,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: FilterGroup[];
  value: FilterValues;
  onChange: (v: FilterValues) => void;
  /** Quantos registros passam com os filtros atuais. */
  resultCount: number;
  savedViews?: SavedView[];
  /** Mostra "Salvar filtros atuais" quando passado. */
  onSaveView?: (name: string) => void;
}) {
  const [viewName, setViewName] = useState("");
  const set = (id: string, v: string | string[] | boolean) =>
    onChange({ ...value, [id]: v });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="px-5 py-4">
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5">
          {(savedViews.length > 0 || onSaveView) && (
            <section className="flex flex-col gap-3 border-b border-border/50 py-5">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Visões salvas
              </h3>
              {savedViews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {savedViews.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      className={CHIP}
                      onClick={() => onChange(v.value)}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              )}
              {onSaveView && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome da visão"
                    value={viewName}
                    onChange={(e) => setViewName(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    disabled={!viewName.trim()}
                    onClick={() => {
                      onSaveView(viewName.trim());
                      setViewName("");
                    }}
                  >
                    Salvar filtros atuais
                  </Button>
                </div>
              )}
            </section>
          )}

          {groups.map((g) => (
            <section
              key={g.title}
              className="flex flex-col gap-3 py-5 not-last:border-b not-last:border-border/50"
            >
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {g.title}
              </h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                {g.fields.map((f) => {
                  if (f.type === "select") {
                    return (
                      // biome-ignore lint/a11y/noLabelWithoutControl: o NativeSelect renderiza o <select> dentro do rótulo
                      <label
                        key={f.id}
                        className="flex flex-col gap-2 text-sm font-medium"
                      >
                        {f.label}
                        <NativeSelect
                          className="w-full"
                          value={(value[f.id] as string) || ALL}
                          onChange={(e) => set(f.id, e.target.value)}
                        >
                          <NativeSelectOption>{ALL}</NativeSelectOption>
                          {f.options.map((o) => (
                            <NativeSelectOption key={o}>{o}</NativeSelectOption>
                          ))}
                        </NativeSelect>
                      </label>
                    );
                  }
                  if (f.type === "chips") {
                    const cur = (value[f.id] as string[]) ?? [];
                    return (
                      <div
                        key={f.id}
                        className="col-span-2 flex flex-col gap-2"
                      >
                        <span className="text-sm font-medium">{f.label}</span>
                        <div className="flex flex-wrap gap-2">
                          {f.options.map((o) => {
                            const on = cur.includes(o);
                            return (
                              <button
                                key={o}
                                type="button"
                                aria-pressed={on}
                                className={CHIP}
                                onClick={() =>
                                  set(
                                    f.id,
                                    on
                                      ? cur.filter((x) => x !== o)
                                      : [...cur, o],
                                  )
                                }
                              >
                                {o}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return (
                    // biome-ignore lint/a11y/noLabelWithoutControl: a Checkbox do Base UI fica dentro do rótulo
                    <label
                      key={f.id}
                      className={cn(
                        "col-span-2 flex cursor-pointer items-center gap-2.5 text-sm",
                      )}
                    >
                      <Checkbox
                        checked={value[f.id] === true}
                        onCheckedChange={(c) => set(f.id, c === true)}
                      />
                      {f.label}
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <SheetFooter className="flex-row items-center justify-between border-t border-border/50 px-5 py-4">
          <Button variant="ghost" onClick={() => onChange({})}>
            Limpar tudo
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            {`Ver resultados (${resultCount})`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
