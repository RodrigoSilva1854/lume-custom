// lume-custom: a casca do CRM LYX (CUSTOM.md, itens 1 a 11). Menu lateral em
// trilho de ícones que encolhe com a altura da tela, submenu flutuante ao
// passar o mouse, menu expandido em pílulas, botão Layout (expandir, menu
// horizontal, modo foco), chip do usuário, migalha com ícones e busca de
// telas, gaveta no celular e subida ao topo ao trocar de página.
// `pathname` vem de fora (usePathname no Next, useLocation no Router) e a
// navegação programática da busca por `navigate`, porque o bloco não importa
// roteador nenhum.
"use client";

import {
  IconBuildingSkyscraper,
  IconChevronDown,
  IconChevronRight,
  IconLayoutNavbar,
  IconLayoutSidebar,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMaximize,
  IconMenu2,
  IconMinimize,
  IconSearch,
  IconSelector,
  IconSettings2,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import type * as React from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "@/registry/base-vega/components/link";
import { ThemeSwitcher } from "@/registry/base-vega/components/theme-switcher";
import { MORPH } from "@/registry/base-vega/lib/motion";
import {
  hasSubmenu,
  SECTIONS,
  type Section,
} from "@/registry/base-vega/lib/sections";
import { cn } from "@/registry/base-vega/lib/utils";
import { Button } from "@/registry/base-vega/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/registry/base-vega/ui/dropdown-menu";
import { Kbd } from "@/registry/base-vega/ui/kbd";
import { Sheet, SheetContent, SheetTitle } from "@/registry/base-vega/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/base-vega/ui/tooltip";

import {
  LYX_ACCOUNT_ITEMS,
  type LyxAccountItem,
  LyxAccountMenuItems,
  LyxAvatar,
  type LyxUser,
} from "./lyx-account";
import { useLyxLayout } from "./use-lyx-layout";

/* ------------------------------------------------------------------ rotas */

/** Prefixa as rotas das seções (útil quando o CRM mora em /crm, por exemplo). */
export function prefixSections(sections: Section[], base: string): Section[] {
  const b = base.replace(/\/$/, "");
  return sections.map((s) => ({
    ...s,
    items: s.items.map((it) => ({
      ...it,
      href: it.href === "/" ? b || "/" : `${b}${it.href}`,
    })),
  }));
}

/** O href do item ativo: o de prefixo mais longo que casa com a rota. */
function findActive(sections: Section[], pathname: string) {
  let href: string | undefined;
  let section: Section | undefined;
  for (const s of sections) {
    for (const it of s.items) {
      const hit =
        pathname === it.href ||
        (it.href !== "/" && pathname.startsWith(`${it.href}/`));
      if (hit && (!href || it.href.length > href.length)) {
        href = it.href;
        section = s;
      }
    }
  }
  return { href, section };
}

const GROUP_LABEL = { comercial: "Comercial", sistema: "Sistema" } as const;
const GROUP_ICON = {
  comercial: IconBuildingSkyscraper,
  sistema: IconSettings2,
} as const;

/* ------------------------------------------------------- trilho de ícones */

// Mede a altura livre do trilho e calcula o círculo (44 a 28px), o espaço
// entre eles (12 a 4px) e o ícone, para o trilho nunca ter barra de rolagem.
function useRailFit(count: number, enabled: boolean) {
  const ref = useRef<HTMLElement>(null);
  const [fit, setFit] = useState({ rs: 44, rg: 12, ri: 18 });
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !count) return;
    const measure = () => {
      const h = el.clientHeight;
      const rs = Math.floor(
        Math.max(28, Math.min(44, h / (count + (count - 1) * 0.27))),
      );
      const rg = Math.max(
        4,
        Math.min(12, Math.floor((h - count * rs) / Math.max(1, count - 1))),
      );
      const ri = Math.round(Math.max(14, rs * 0.41));
      setFit((f) =>
        f.rs === rs && f.rg === rg && f.ri === ri ? f : { rs, rg, ri },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [count, enabled]);
  const style = {
    "--rs": `${fit.rs}px`,
    "--rg": `${fit.rg}px`,
    "--ri": `${fit.ri}px`,
  } as React.CSSProperties;
  return { ref, style };
}

const RAIL_CIRCLE =
  "relative grid size-(--rs) shrink-0 cursor-pointer place-items-center rounded-full outline-none transition-colors focus-visible:ring-[1.5px] focus-visible:ring-ring/50";

function RailItem({
  section,
  active,
  activeHref,
}: {
  section: Section;
  active: boolean;
  activeHref?: string;
}) {
  const Icon = active ? section.iconActive : section.icon;
  const tone = active
    ? section.tone.text
    : "bg-rail-item text-foreground/70 hover:bg-rail-item-hover hover:text-foreground";
  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="lyx-rail-active"
          transition={MORPH}
          className={cn(
            "absolute inset-0 rounded-full ring-[1.5px] ring-inset",
            section.tone.soft,
            section.tone.ring,
          )}
        />
      )}
      <Icon className="relative size-(--ri)" />
    </>
  );

  if (hasSubmenu(section)) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          openOnHover
          delay={60}
          closeDelay={150}
          aria-label={section.label}
          className={cn(RAIL_CIRCLE, tone)}
        >
          {inner}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={12}
          className="w-auto min-w-48 rounded-2xl p-1.5 squircle:rounded-3xl"
        >
          <DropdownMenuLabel>{section.label}</DropdownMenuLabel>
          {section.items.map((it) => (
            <DropdownMenuItem
              key={it.href}
              render={<Link href={it.href} />}
              className={cn(
                "h-9 rounded-lg px-2.5",
                it.href === activeHref && "bg-accent font-medium",
              )}
            >
              {it.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={section.items[0]?.href ?? "/"}
            aria-label={section.label}
            aria-current={active ? "page" : undefined}
            className={cn(RAIL_CIRCLE, tone)}
          />
        }
      >
        {inner}
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={12}
        className="rounded-xl squircle:rounded-xl"
      >
        {section.label}
      </TooltipContent>
    </Tooltip>
  );
}

/* --------------------------------------------- menu expandido e gaveta */

function SideList({
  sections,
  activeHref,
  activeSection,
  mobile,
  onNavigate,
}: {
  sections: Section[];
  activeHref?: string;
  activeSection?: Section;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  // No celular, tocar num grupo abre os subitens em vez de navegar (item 9).
  const [openId, setOpenId] = useState<string | undefined>(activeSection?.id);
  const indId = useId();

  const row =
    "relative flex h-10 w-full items-center gap-3 rounded-full px-3.5 text-left text-sm text-foreground/75 outline-none transition-colors hover:bg-rail-item hover:text-foreground focus-visible:ring-[1.5px] focus-visible:ring-ring/50 [&_svg]:size-4.5 [&_svg]:shrink-0";
  const indicator = (
    <motion.span
      layoutId={`lyx-side-active-${indId}`}
      transition={MORPH}
      className="absolute inset-0 -z-10 rounded-full bg-nav-active"
    />
  );

  return (
    <div className="isolate flex flex-col gap-1">
      {sections.map((s) => {
        const isSection = activeSection?.id === s.id;
        const Icon = isSection ? s.iconActive : s.icon;
        const iconTone = isSection ? s.tone.text : undefined;
        const first = s.items[0]?.href ?? "/";

        if (!hasSubmenu(s)) {
          const on = isSection;
          return (
            <Link
              key={s.id}
              href={first}
              onClick={onNavigate}
              aria-current={on ? "page" : undefined}
              className={cn(row, on && "font-medium text-foreground")}
            >
              {on && indicator}
              <Icon className={iconTone} />
              <span className="truncate">{s.label}</span>
            </Link>
          );
        }

        const open = mobile ? openId === s.id : isSection;
        const head = (
          <>
            <Icon className={iconTone} />
            <span className="flex-1 truncate">{s.label}</span>
            <IconChevronRight
              className={cn(
                "size-3.5! text-muted-foreground/60 transition-[rotate] duration-200",
                open && "rotate-90",
              )}
            />
          </>
        );

        return (
          <div key={s.id} className="flex flex-col">
            {mobile ? (
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenId(open ? undefined : s.id)}
                className={cn(row, "cursor-pointer")}
              >
                {head}
              </button>
            ) : (
              <Link href={first} aria-expanded={open} className={row}>
                {head}
              </Link>
            )}
            {open && (
              <div className="relative mt-0.5 mb-1.5 ml-7 flex flex-col gap-0.5 pl-3 before:absolute before:top-1 before:bottom-1 before:left-0 before:w-px before:bg-border">
                {s.items.map((it) => {
                  const on = it.href === activeHref;
                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={onNavigate}
                      aria-current={on ? "page" : undefined}
                      className={cn(
                        row,
                        "h-9 px-3.5",
                        on && "font-medium text-foreground",
                      )}
                    >
                      {on && indicator}
                      {it.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------- rodapé: Layout e conta */

function LayoutMenu({
  rail,
  onToggleRail,
  onTop,
  onFocus,
}: {
  rail: boolean;
  onToggleRail: () => void;
  onTop: () => void;
  onFocus: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Layout"
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-full text-sm text-muted-foreground outline-none transition-colors hover:bg-rail-item hover:text-foreground focus-visible:ring-[1.5px] focus-visible:ring-ring/50 data-popup-open:bg-rail-item data-popup-open:text-foreground",
          rail ? "size-(--rs) justify-center" : "h-10 w-full px-3.5",
        )}
      >
        <IconLayoutNavbar className={rail ? "size-(--ri)" : "size-4.5"} />
        {!rail && "Layout"}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={rail ? "right" : "top"}
        align={rail ? "end" : "start"}
        sideOffset={rail ? 12 : 8}
        className="w-auto min-w-56 rounded-2xl p-1.5 squircle:rounded-3xl"
      >
        <DropdownMenuLabel>Layout</DropdownMenuLabel>
        <DropdownMenuItem onClick={onToggleRail} className="h-9 rounded-lg">
          {rail ? (
            <IconLayoutSidebarLeftExpand />
          ) : (
            <IconLayoutSidebarLeftCollapse />
          )}
          {rail ? "Expandir menu" : "Recolher menu"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onTop} className="h-9 rounded-lg">
          <IconLayoutNavbar />
          Menu na horizontal
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onFocus} className="h-9 rounded-lg">
          <IconMaximize />
          <span className="flex-1">Modo foco</span>
          <span className="text-xs text-muted-foreground">tela cheia</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserChip({
  user,
  rail,
  items,
  onSelect,
}: {
  user: LyxUser;
  rail: boolean;
  items: LyxAccountItem[];
  onSelect?: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Conta de ${user.name}`}
        className={cn(
          "flex cursor-pointer items-center outline-none transition-colors focus-visible:ring-[1.5px] focus-visible:ring-ring/50",
          rail
            ? "rounded-full"
            : "w-full gap-2.5 rounded-2xl bg-card p-2 pr-3 text-left shadow-(--custom-shadow) hover:bg-accent squircle:rounded-3xl",
        )}
      >
        <LyxAvatar user={user} />
        {!rail && (
          <>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{user.name}</span>
              {user.email && (
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              )}
            </span>
            <IconSelector className="size-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={rail ? "right" : "top"}
        align="end"
        sideOffset={rail ? 12 : 8}
        className="w-64 rounded-2xl p-1.5 squircle:rounded-3xl"
      >
        <LyxAccountMenuItems user={user} items={items} onSelect={onSelect} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------------------------------- busca de telas */

type Hit = { href: string; title: string; path: string; section: Section };

function useHits(sections: Section[]) {
  return useMemo<Hit[]>(
    () =>
      sections.flatMap((s) =>
        s.items.map((it) => ({
          href: it.href,
          section: s,
          title: s.items.length > 1 ? `${s.label}: ${it.label}` : s.label,
          path:
            s.group === "home"
              ? "Início"
              : `${GROUP_LABEL[s.group]} › ${s.label}${s.items.length > 1 ? ` › ${it.label}` : ""}`,
        })),
      ),
    [sections],
  );
}

const norm = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Busca de telas com atalho Ctrl ou Cmd K (item 10). Em `compact` vira só a
 * lupa e abre por cima ao focar (item 7). */
function ScreenSearch({
  sections,
  navigate,
  compact,
  className,
}: {
  sections: Section[];
  navigate: (href: string) => void;
  compact?: boolean;
  className?: string;
}) {
  const hits = useHits(sections);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();

  const list = useMemo(() => {
    const t = norm(q.trim());
    return hits
      .filter((h) => !t || norm(`${h.title} ${h.path}`).includes(t))
      .slice(0, 8);
  }, [hits, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
        input.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (h?: Hit) => {
    if (!h) return;
    setQ("");
    setOpen(false);
    input.current?.blur();
    navigate(h.href);
  };

  const wide = !compact || open;

  return (
    <div
      className={cn(
        "relative shrink-0",
        compact ? "size-8" : "w-72",
        className,
      )}
    >
      <label
        className={cn(
          "absolute top-1/2 right-0 flex h-8 -translate-y-1/2 cursor-text items-center gap-2 overflow-hidden rounded-full text-sm text-muted-foreground transition-[width,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          wide
            ? "w-72 bg-muted px-3 focus-within:bg-popover focus-within:shadow-(--custom-shadow)"
            : "w-8 justify-center hover:bg-muted",
          compact && open && "z-30 bg-popover shadow-(--custom-shadow)",
        )}
      >
        <IconSearch className="size-4 shrink-0 text-foreground/70" />
        <input
          ref={input}
          value={q}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label="Buscar telas"
          placeholder="Buscar telas…"
          onFocus={() => {
            setSel(0);
            setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSel((i) => Math.min(list.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSel((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              go(list[sel]);
            } else if (e.key === "Escape") {
              setOpen(false);
              input.current?.blur();
            }
          }}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
            !wide && "w-0 flex-none opacity-0",
          )}
        />
      </label>
      {open && (
        <div
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+10px)] right-0 z-40 w-80 rounded-2xl bg-popover p-1.5 text-popover-foreground shadow-(--custom-shadow) duration-100 animate-in fade-in-0 zoom-in-95 squircle:rounded-3xl"
        >
          {list.length ? (
            <>
              <div className="px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground">
                Telas
              </div>
              {list.map((h, i) => (
                <button
                  key={h.href}
                  type="button"
                  role="option"
                  aria-selected={i === sel}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    go(h);
                  }}
                  onMouseEnter={() => setSel(i)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left",
                    i === sel && "bg-accent",
                  )}
                >
                  <h.section.icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm">{h.title}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {h.path}
                    </span>
                  </span>
                </button>
              ))}
            </>
          ) : (
            <div className="px-2.5 py-3 text-sm text-muted-foreground">
              Nada encontrado para "{q}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- migalha */

function Crumbs({
  section,
  activeHref,
}: {
  section?: Section;
  activeHref?: string;
}) {
  if (!section) return <span />;
  const item = section.items.find((it) => it.href === activeHref);
  const levels: {
    label: string;
    icon?: React.ElementType;
    current?: boolean;
  }[] =
    section.group === "home"
      ? [
          { label: "Início", icon: section.icon },
          { label: item?.label ?? section.label, current: true },
        ]
      : [
          {
            label: GROUP_LABEL[section.group],
            icon: GROUP_ICON[section.group],
          },
          { label: section.label, icon: section.icon },
          ...(item ? [{ label: item.label, current: true }] : []),
        ];
  return (
    <nav
      aria-label="Você está em"
      className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground/70"
    >
      {levels.map((l, i) => (
        <span key={l.label} className="flex min-w-0 items-center gap-1.5">
          {i > 0 && <IconChevronRight className="size-3 shrink-0 opacity-50" />}
          {l.icon && <l.icon className="size-3.5 shrink-0" />}
          <span
            aria-current={l.current ? "page" : undefined}
            className={cn(
              "truncate",
              l.current && "font-medium text-foreground/80",
            )}
          >
            {l.label}
          </span>
        </span>
      ))}
    </nav>
  );
}

/* ------------------------------------------------------ menu horizontal */

function TopNav({
  sections,
  activeHref,
  activeSection,
}: {
  sections: Section[];
  activeHref?: string;
  activeSection?: Section;
}) {
  const pill =
    "flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-full px-3 text-sm text-muted-foreground outline-none transition-colors hover:bg-rail-item hover:text-foreground focus-visible:ring-[1.5px] focus-visible:ring-ring/50 data-popup-open:bg-rail-item data-popup-open:text-foreground";
  return (
    <>
      {sections.map((s) => {
        const on = activeSection?.id === s.id;
        const cls = cn(pill, on && "bg-rail-item font-medium text-foreground");
        if (!hasSubmenu(s)) {
          return (
            <Link
              key={s.id}
              href={s.items[0]?.href ?? "/"}
              aria-current={on ? "page" : undefined}
              className={cls}
            >
              {s.label}
            </Link>
          );
        }
        return (
          <DropdownMenu key={s.id}>
            <DropdownMenuTrigger
              openOnHover
              delay={60}
              closeDelay={150}
              className={cls}
            >
              {s.label}
              <IconChevronDown className="size-3.5 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="w-auto min-w-48 rounded-2xl p-1.5 squircle:rounded-3xl"
            >
              {s.items.map((it) => (
                <DropdownMenuItem
                  key={it.href}
                  render={<Link href={it.href} />}
                  className={cn(
                    "h-9 rounded-lg px-2.5",
                    it.href === activeHref && "bg-accent font-medium",
                  )}
                >
                  {it.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </>
  );
}

// Quando os itens do menu horizontal não cabem, a busca vira só a lupa. A
// folga de 230px evita piscar: só volta a abrir quando sobra o tamanho dela.
function useNavOverflow(enabled: boolean) {
  const ref = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const check = () => {
      setCompact((c) =>
        c
          ? el.scrollWidth + 230 > el.clientWidth + 1
          : el.scrollWidth > el.clientWidth + 1,
      );
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled]);
  return { ref, compact };
}

/* ------------------------------------------------------- subir ao topo */

// Ao trocar de página com a tela rolada, sobe ao topo começando rápido e
// terminando suave (item 11). Rolar ou teclar durante a subida cancela.
function useScrollTopOnRoute(
  ref: React.RefObject<HTMLElement | null>,
  pathname: string,
) {
  const reduce = useReducedMotion();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = ref.current;
    if (!el || pathname === undefined) return;
    const y0 = el.scrollTop;
    if (y0 <= 0) return;
    if (reduce) {
      el.scrollTop = 0;
      return;
    }
    let raf = 0;
    const d = Math.min(700, Math.max(380, y0 * 0.45));
    const t0 = performance.now();
    const ease = (t: number) => 1 - (1 - t) ** 4;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / d);
      el.scrollTop = Math.round(y0 * (1 - ease(t)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    const stop = () => cancelAnimationFrame(raf);
    raf = requestAnimationFrame(step);
    el.addEventListener("wheel", stop, { passive: true, once: true });
    el.addEventListener("touchstart", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });
    return () => {
      stop();
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [pathname, ref, reduce]);
}

/* ----------------------------------------------------------------- casca */

export type LyxShellProps = {
  pathname: string;
  /** Logo sozinho, para o trilho. */
  brandMark: React.ReactNode;
  /** Nome ao lado do logo no menu expandido, no horizontal e no celular. */
  brandName: string;
  user: LyxUser;
  sections?: Section[];
  accountItems?: LyxAccountItem[];
  onAccountSelect?: (id: string) => void;
  /** Navegação da busca de telas (router.push no Next). */
  navigate?: (href: string) => void;
  children: React.ReactNode;
};

export function LyxShell({
  pathname,
  brandMark,
  brandName,
  user,
  sections = SECTIONS,
  accountItems = LYX_ACCOUNT_ITEMS,
  onAccountSelect,
  navigate,
  children,
}: LyxShellProps) {
  const layout = useLyxLayout();
  const { nav, rail, focus, setNav, toggleRail, setFocus } = layout;
  const { href: activeHref, section: activeSection } = useMemo(
    () => findActive(sections, pathname),
    [sections, pathname],
  );
  const go = useCallback(
    (href: string) =>
      navigate ? navigate(href) : window.location.assign(href),
    [navigate],
  );

  const side = nav === "side" && !focus;
  const top = nav === "top" && !focus;
  const railFit = useRailFit(sections.length, side && rail);
  const overflow = useNavOverflow(top);
  const main = useRef<HTMLElement>(null);
  useScrollTopOnRoute(main, pathname);

  const [drawer, setDrawer] = useState(false);
  useEffect(() => {
    if (pathname) setDrawer(false);
  }, [pathname]);

  // Esc sai do modo foco (item 8).
  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !document.querySelector("[data-open][role=dialog]")
      )
        setFocus(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus, setFocus]);

  const brand = (
    <span className="flex min-w-0 items-center gap-2.5 text-sm font-medium tracking-tight">
      <span className="grid shrink-0 place-items-center [&_svg]:size-7">
        {brandMark}
      </span>
      <span className="truncate">{brandName}</span>
    </span>
  );

  return (
    <div className="flex h-svh min-h-0 bg-app-canvas p-3 max-[860px]:p-0">
      <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden rounded-[28px] bg-background shadow-(--custom-shadow) corner-round max-[860px]:rounded-none">
        {/* Menu lateral: trilho ou expandido (só no computador). */}
        {side && (
          <aside
            data-rail={rail || undefined}
            className={cn(
              "hidden shrink-0 flex-col py-4 transition-[width] duration-250 ease-[cubic-bezier(0.32,0.72,0,1)] min-[861px]:flex",
              rail ? "w-[88px] items-center" : "w-[248px] px-3",
            )}
          >
            <div
              className={cn(
                "shrink-0",
                rail ? "pb-6 [&_svg]:size-7" : "px-2 pb-6",
              )}
            >
              {rail ? brandMark : brand}
            </div>

            {rail ? (
              <nav
                ref={railFit.ref}
                aria-label="Navegação principal"
                style={railFit.style}
                className="flex min-h-0 flex-1 flex-col items-center gap-(--rg) overflow-hidden"
              >
                {sections.map((s) => (
                  <RailItem
                    key={s.id}
                    section={s}
                    active={activeSection?.id === s.id}
                    activeHref={activeHref}
                  />
                ))}
              </nav>
            ) : (
              <nav
                aria-label="Navegação principal"
                className="min-h-0 flex-1 overflow-y-auto"
              >
                <SideList
                  sections={sections}
                  activeHref={activeHref}
                  activeSection={activeSection}
                />
              </nav>
            )}

            <div
              style={railFit.style}
              className={cn(
                "flex shrink-0 flex-col gap-2 pt-3",
                rail && "items-center gap-(--rg)",
              )}
            >
              <LayoutMenu
                rail={rail}
                onToggleRail={toggleRail}
                onTop={() => setNav("top")}
                onFocus={() => setFocus(true)}
              />
              {!rail && <ThemeSwitcher />}
              <UserChip
                user={user}
                rail={rail}
                items={accountItems}
                onSelect={onAccountSelect}
              />
            </div>
          </aside>
        )}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Menu horizontal (só no computador). */}
          {top && (
            <header className="hidden h-14 shrink-0 items-center gap-1 border-b border-border/40 px-4 min-[861px]:flex">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Menu lateral"
                onClick={() => setNav("side")}
              >
                <IconLayoutSidebar />
              </Button>
              <div className="mr-3 ml-1 shrink-0">{brand}</div>
              <nav
                ref={overflow.ref}
                aria-label="Navegação principal"
                className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden"
              >
                <TopNav
                  sections={sections}
                  activeHref={activeHref}
                  activeSection={activeSection}
                />
              </nav>
              <ScreenSearch
                sections={sections}
                navigate={go}
                compact={overflow.compact}
                className={overflow.compact ? undefined : "w-56"}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Modo foco"
                onClick={() => setFocus(true)}
              >
                <IconMaximize />
              </Button>
              <ThemeSwitcher />
              <UserChip
                user={user}
                rail
                items={accountItems}
                onSelect={onAccountSelect}
              />
            </header>
          )}

          {/* Celular: barra com a gaveta, a marca e a conta. */}
          {!focus && (
            <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/40 px-3 min-[861px]:hidden">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Abrir menu"
                onClick={() => setDrawer(true)}
              >
                <IconMenu2 />
              </Button>
              <div className="min-w-0 flex-1">{brand}</div>
              <UserChip
                user={user}
                rail
                items={accountItems}
                onSelect={onAccountSelect}
              />
            </header>
          )}

          <main ref={main} className="min-h-0 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 px-8 pt-6 pb-16 max-[860px]:px-4">
              {!focus && (
                <div className="flex min-h-9 items-center justify-between gap-4">
                  <Crumbs section={activeSection} activeHref={activeHref} />
                  {side && (
                    <ScreenSearch
                      sections={sections}
                      navigate={go}
                      className="max-[860px]:hidden"
                    />
                  )}
                </div>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Gaveta do celular com o mesmo visual do menu expandido (item 9). */}
      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(300px,86vw)] gap-0 rounded-r-3xl border-0 p-3 pt-5"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="px-2 pb-5">{brand}</div>
          <nav
            aria-label="Navegação principal"
            className="min-h-0 flex-1 overflow-y-auto"
          >
            <SideList
              sections={sections}
              activeHref={activeHref}
              activeSection={activeSection}
              mobile
              onNavigate={() => setDrawer(false)}
            />
          </nav>
          <div className="flex flex-col gap-2 pt-3">
            <ThemeSwitcher />
            <UserChip
              user={user}
              rail={false}
              items={accountItems}
              onSelect={onAccountSelect}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Modo foco: pílula flutuante para sair (item 8). */}
      {focus && (
        <button
          type="button"
          onClick={() => setFocus(false)}
          className="fixed bottom-6 left-1/2 z-40 flex h-9 -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full bg-popover pr-1.5 pl-3.5 text-sm font-medium shadow-(--custom-shadow) duration-200 animate-in fade-in-0 slide-in-from-bottom-2 hover:bg-accent"
        >
          <IconMinimize className="size-4 text-muted-foreground" />
          Sair do modo foco
          <Kbd>Esc</Kbd>
        </button>
      )}
    </div>
  );
}
