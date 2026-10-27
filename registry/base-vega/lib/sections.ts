// lume-custom: as seções do CRM LYX num lugar só (ícone, cor e rota).
// Consumido pelo menu (trilho, expandido, horizontal e gaveta do mobile) e
// pelo PageHeader, para a cor de cada área nunca ser escolhida por tela.
// As cores são tokens de globals.css (--nav-*), usados como utilitários
// Tailwind: text-nav-leads, bg-nav-leads/12, ring-nav-leads.
import {
  type Icon,
  IconBookmark,
  IconBookmarkFilled,
  IconChartAreaLine,
  IconChartAreaLineFilled,
  IconChartDots3,
  IconFileText,
  IconFileTextFilled,
  IconHome,
  IconHomeFilled,
  IconLayoutGrid,
  IconLayoutGridFilled,
  IconLayoutKanban,
  IconLayoutKanbanFilled,
  IconPercentage,
  IconStack2,
  IconStack2Filled,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";

export type SectionId =
  | "inicio"
  | "inicio-2"
  | "leads"
  | "pre-cadastros"
  | "disponibilidade"
  | "reservas"
  | "funis"
  | "comissoes"
  | "componentes"
  | "graficos";

export type SectionItem = { label: string; href: string };

export type Section = {
  id: SectionId;
  label: string;
  /** Ícone inativo (outline). */
  icon: Icon;
  /** Ícone ativo (filled quando o Tabler tem). */
  iconActive: Icon;
  /** Classes de cor da seção: texto, fundo translúcido e anel do item ativo no trilho. */
  tone: { text: string; soft: string; ring: string };
  /** Grupo do menu: "home" fica no topo; "sistema" depois do rótulo Sistema. */
  group: "home" | "comercial" | "sistema";
  items: SectionItem[];
  /** Comissões usa abas na página em vez de submenu. */
  tabs?: boolean;
};

// Classes escritas por extenso para o Tailwind enxergar no build.
export const SECTIONS: Section[] = [
  {
    id: "inicio",
    label: "Início",
    icon: IconHome,
    iconActive: IconHomeFilled,
    tone: {
      text: "text-nav-inicio",
      soft: "bg-nav-inicio/12",
      ring: "ring-nav-inicio",
    },
    group: "home",
    items: [{ label: "Visão geral", href: "/" }],
  },
  {
    id: "inicio-2",
    label: "Início 2",
    icon: IconChartAreaLine,
    iconActive: IconChartAreaLineFilled,
    tone: {
      text: "text-nav-inicio-2",
      soft: "bg-nav-inicio-2/12",
      ring: "ring-nav-inicio-2",
    },
    group: "home",
    items: [{ label: "Início 2", href: "/inicio-2" }],
  },
  {
    id: "leads",
    label: "Leads",
    icon: IconUsers,
    iconActive: IconUsersGroup,
    tone: {
      text: "text-nav-leads",
      soft: "bg-nav-leads/12",
      ring: "ring-nav-leads",
    },
    group: "comercial",
    items: [
      { label: "Gestão", href: "/leads" },
      { label: "Andamento", href: "/leads/andamento" },
      { label: "Distribuição", href: "/leads/distribuicao" },
    ],
  },
  {
    id: "pre-cadastros",
    label: "Pré-cadastros",
    icon: IconFileText,
    iconActive: IconFileTextFilled,
    tone: {
      text: "text-nav-pre-cadastros",
      soft: "bg-nav-pre-cadastros/12",
      ring: "ring-nav-pre-cadastros",
    },
    group: "comercial",
    items: [
      { label: "Gestão", href: "/pre-cadastros" },
      { label: "Andamento", href: "/pre-cadastros/andamento" },
      { label: "Distribuição", href: "/pre-cadastros/distribuicao" },
    ],
  },
  {
    id: "disponibilidade",
    label: "Disponibilidade",
    icon: IconLayoutGrid,
    iconActive: IconLayoutGridFilled,
    tone: {
      text: "text-nav-disponibilidade",
      soft: "bg-nav-disponibilidade/12",
      ring: "ring-nav-disponibilidade",
    },
    group: "comercial",
    items: [{ label: "Mapa", href: "/disponibilidade" }],
  },
  {
    id: "reservas",
    label: "Reservas",
    icon: IconBookmark,
    iconActive: IconBookmarkFilled,
    tone: {
      text: "text-nav-reservas",
      soft: "bg-nav-reservas/12",
      ring: "ring-nav-reservas",
    },
    group: "comercial",
    items: [
      { label: "Gestão", href: "/reservas" },
      { label: "Andamento", href: "/reservas/andamento" },
      { label: "Distribuição", href: "/reservas/distribuicao" },
    ],
  },
  {
    id: "funis",
    label: "Funis",
    icon: IconLayoutKanban,
    iconActive: IconLayoutKanbanFilled,
    tone: {
      text: "text-nav-funis",
      soft: "bg-nav-funis/12",
      ring: "ring-nav-funis",
    },
    group: "comercial",
    items: [{ label: "Kanban", href: "/funis" }],
  },
  {
    id: "comissoes",
    label: "Comissões",
    icon: IconPercentage,
    iconActive: IconPercentage,
    tone: {
      text: "text-nav-comissoes",
      soft: "bg-nav-comissoes/12",
      ring: "ring-nav-comissoes",
    },
    group: "comercial",
    tabs: true,
    items: [
      { label: "Buscar", href: "/comissoes" },
      { label: "Lista", href: "/comissoes/lista" },
      { label: "Configurações", href: "/comissoes/configuracoes" },
    ],
  },
  {
    id: "componentes",
    label: "Componentes",
    icon: IconStack2,
    iconActive: IconStack2Filled,
    tone: {
      text: "text-nav-componentes",
      soft: "bg-nav-componentes/12",
      ring: "ring-nav-componentes",
    },
    group: "sistema",
    items: [{ label: "Biblioteca", href: "/componentes" }],
  },
  {
    id: "graficos",
    label: "Gráficos",
    icon: IconChartDots3,
    iconActive: IconChartDots3,
    tone: {
      text: "text-nav-graficos",
      soft: "bg-nav-graficos/12",
      ring: "ring-nav-graficos",
    },
    group: "sistema",
    items: [{ label: "Galeria", href: "/graficos" }],
  },
];

/** Seção dona de uma rota (a de prefixo mais longo). */
export function sectionOf(pathname: string): Section | undefined {
  let best: Section | undefined;
  let len = -1;
  for (const s of SECTIONS) {
    for (const it of s.items) {
      const hit =
        it.href === "/"
          ? pathname === "/"
          : pathname === it.href || pathname.startsWith(`${it.href}/`);
      if (hit && it.href.length > len) {
        best = s;
        len = it.href.length;
      }
    }
  }
  return best;
}

/** Seção tem submenu (mais de um item e não usa abas). */
export const hasSubmenu = (s: Section) => s.items.length > 1 && !s.tabs;
