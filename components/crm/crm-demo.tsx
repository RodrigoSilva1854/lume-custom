// Demo do bloco lyx-shell no site: o CRM LYX com o menu de verdade e algumas
// telas de exemplo (Início, Leads, Funis). Dados fictícios. Arquivo do site,
// não entra na registry.
"use client";

import {
  IconArrowRight,
  IconBookmark,
  IconCalendarEvent,
  IconCoin,
  IconColumns3,
  IconExternalLink,
  IconLayoutKanban,
  IconList,
  IconPlus,
  IconTools,
  IconUsers,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  LyxShell,
  prefixSections,
} from "@/registry/base-vega/blocks/lyx-shell/lyx-shell";
import { CardSparkline } from "@/registry/base-vega/components/card-sparkline";
import { EmptyState } from "@/registry/base-vega/components/empty-state";
import {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  KanbanEmpty,
} from "@/registry/base-vega/components/kanban-column";
import { StatCard } from "@/registry/base-vega/components/stat-card";
import { ViewToggle } from "@/registry/base-vega/components/view-toggle";
import { SECTIONS, type Section } from "@/registry/base-vega/lib/sections";
import { cn } from "@/registry/base-vega/lib/utils";
import { Badge } from "@/registry/base-vega/ui/badge";
import { Button } from "@/registry/base-vega/ui/button";
import { Label } from "@/registry/base-vega/ui/label";
import { Switch } from "@/registry/base-vega/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/base-vega/ui/table";

export const CRM_BASE = "/crm";
const SECTIONS_CRM = prefixSections(SECTIONS, CRM_BASE);

/** Logo LYX: casa em traço com as letras, na cor do texto. */
function LyxMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-label="LYX" role="img">
      <path
        d="M5 14.5 16 5l11 9.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 13v6M24.5 13v6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <text
        x="16"
        y="27.5"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="currentColor"
        fontFamily="inherit"
      >
        LYX
      </text>
    </svg>
  );
}

function Title({
  section,
  title,
  sub,
  actions,
}: {
  section?: Section;
  title: string;
  sub: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const Icon = section?.icon;
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-base font-medium tracking-tight">
          {Icon && <Icon className={cn("size-4.5", section?.tone.text)} />}
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground text-pretty">
          {sub}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* --------------------------------------------------------------- Início */

const spark = (seed: number) =>
  Array.from({ length: 14 }, (_, i) =>
    Math.round(40 + 25 * Math.sin(i / 2 + seed) + i * 2 + ((i * seed) % 7)),
  );

function Inicio({ section }: { section?: Section }) {
  const [charts, setCharts] = useState(false);
  const cards = [
    {
      label: "Leads recebidos",
      value: "1.509",
      hint: "vs. período anterior",
      delta: { pct: 0.097, dir: "up" as const },
      icon: IconUsers,
      tone: "text-emerald-500",
      seed: 1,
    },
    {
      label: "Visitas realizadas",
      value: "395",
      hint: "26,2% dos leads",
      delta: { pct: 0.145, dir: "up" as const },
      icon: IconCalendarEvent,
      tone: "text-rose-500",
      seed: 2,
    },
    {
      label: "Reservas",
      value: "78",
      hint: "19,7% das visitas",
      delta: { pct: 0.219, dir: "up" as const },
      icon: IconBookmark,
      tone: "text-amber-500",
      seed: 3,
    },
    {
      label: "Vendas",
      value: "17",
      hint: "R$ 10,5 mi em VGV",
      delta: { pct: 0.545, dir: "up" as const },
      icon: IconCoin,
      tone: "text-sky-500",
      seed: 4,
    },
  ];
  return (
    <>
      <Title
        section={section}
        title="Início"
        sub={
          <>
            Como está o comercial agora: leads, visitas, reservas e vendas do
            período.
            <Label className="ml-1 inline-flex cursor-pointer items-center gap-2 rounded-full bg-muted py-1 pr-1.5 pl-2.5 text-xs font-medium">
              Minigráficos
              <Switch checked={charts} onCheckedChange={setCharts} size="sm" />
            </Label>
          </>
        }
      />
      <div className="@container">
        <div className="grid gap-4 @lg:grid-cols-2 @min-[62rem]:grid-cols-4">
          {cards.map((c) => (
            <StatCard
              key={c.label}
              size="sm"
              label={c.label}
              value={c.value}
              hint={c.hint}
              delta={c.delta}
              icon={c.icon}
              iconClassName={c.tone}
              chart={
                charts ? (
                  <CardSparkline data={spark(c.seed)} className={c.tone} />
                ) : undefined
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Leads */

const LEADS = [
  [
    "774301",
    "Marina Albuquerque",
    "Google",
    "Atlanta Condomínio Clube",
    "Dercy Ramos",
    "Em atendimento",
    "amber",
  ],
  [
    "774464",
    "Otávio Brandão",
    "Google",
    "Madison II Condomínio Clube",
    "Nicolas Prado",
    "Em atendimento",
    "amber",
  ],
  [
    "774455",
    "Helena Vasques",
    "Facebook",
    "Blue Lake Fase II",
    "Samara Leite",
    "1ª visita",
    "blue",
  ],
  [
    "775054",
    "Caio Figueiredo",
    "Instagram",
    "Sem empreendimento",
    "Sem corretor",
    "Aguardando",
    "secondary",
  ],
  [
    "773918",
    "Lívia Monteiro",
    "Indicação",
    "Kentucky Fase III",
    "Anna Rezende",
    "Com reserva",
    "violet",
  ],
] as const;

function Leads({ section }: { section?: Section }) {
  return (
    <>
      <Title
        section={section}
        title="Leads"
        sub="Acompanhe cada contato, do primeiro atendimento à venda."
        actions={
          <Button onClick={() => toast("Novo lead: tela de exemplo")}>
            <IconPlus />
            Novo lead
          </Button>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contato</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Empreendimento</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Situação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {LEADS.map(([code, name, origem, emp, resp, sit, cor]) => (
            <TableRow key={code}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-normal">{name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    #{code}
                  </span>
                </div>
              </TableCell>
              <TableCell>{origem}</TableCell>
              <TableCell>{emp}</TableCell>
              <TableCell>{resp}</TableCell>
              <TableCell>
                <Badge variant={cor}>{sit}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

/* ---------------------------------------------------------------- Funis */

const COLS = [
  {
    title: "MRV",
    dot: "bg-neutral-500",
    items: ["Sensia Horizon", "Château de Vermont", "Residencial Cortese"],
  },
  { title: "Hercasa", dot: "bg-blue-500", items: ["Residencial Roma"] },
  {
    title: "Valor Real",
    dot: "bg-orange-500",
    items: ["Residencial Santa Clara", "Duna House", "Luna House"],
  },
  { title: "Make IT", dot: "bg-violet-500", items: ["Now", "Horizon"] },
  { title: "Tenda", dot: "bg-emerald-500", items: [] as string[] },
];

function Funis({ section }: { section?: Section }) {
  const [mode, setMode] = useState<"lista" | "quadro" | "compacto">("quadro");
  return (
    <>
      <Title
        section={section}
        title="Funis"
        sub="Acompanhe os processos de cada funil, coluna por coluna."
        actions={
          <ViewToggle
            value={mode}
            onValueChange={setMode}
            options={[
              { value: "lista", label: "Lista", icon: IconList },
              { value: "quadro", label: "Quadro", icon: IconLayoutKanban },
              {
                value: "compacto",
                label: "Quadro compacto",
                icon: IconColumns3,
              },
            ]}
          />
        }
      />
      <KanbanBoard>
        {COLS.map((c) => (
          <KanbanColumn
            key={c.title}
            title={c.title}
            count={c.items.length}
            dotClassName={c.dot}
          >
            {c.items.length ? (
              c.items.map((it) => (
                <KanbanCard key={it}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium tracking-tight">
                      {it}
                    </span>
                    <IconExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                  </div>
                  {mode !== "compacto" && (
                    <Badge variant="amber" className="w-fit">
                      Em obras
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Adriana Fontes
                  </span>
                </KanbanCard>
              ))
            ) : (
              <KanbanEmpty>Nenhum processo</KanbanEmpty>
            )}
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </>
  );
}

/* ---------------------------------------------------------------- casca */

/** Conteúdo de cada tela de exemplo (a casca fica no layout de /crm). */
export function CrmPage({ path }: { path: string }) {
  const router = useRouter();
  const pathname = path ? `${CRM_BASE}/${path}` : CRM_BASE;
  const section = SECTIONS_CRM.find(
    (s) =>
      s.items.some(
        (it) => pathname === it.href || pathname.startsWith(`${it.href}/`),
      ) &&
      (s.id !== "inicio" || pathname === CRM_BASE),
  );

  let page: React.ReactNode;
  if (!path) page = <Inicio section={section} />;
  else if (path === "leads") page = <Leads section={section} />;
  else if (path === "funis") page = <Funis section={section} />;
  else
    page = (
      <>
        <Title
          section={section}
          title={section?.label ?? "Tela"}
          sub="Tela de exemplo: o menu, a migalha e a busca já funcionam."
        />
        <EmptyState
          icon={IconTools}
          title="Conteúdo de exemplo"
          description="Esta demo mostra a casca do CRM. Veja Início, Leads e Funis para telas preenchidas."
        >
          <Button
            variant="outline"
            onClick={() => router.push(`${CRM_BASE}/leads`)}
          >
            Ir para Leads
            <IconArrowRight />
          </Button>
        </EmptyState>
      </>
    );

  return (
    <>
      {page}
      <p className="pt-4 text-xs text-muted-foreground">
        Dados de exemplo: nomes e valores são fictícios.
      </p>
    </>
  );
}

/** A casca do CRM, montada uma vez no layout: trocar de tela não remonta o
 * menu, então ele não fecha e abre a cada clique. */
export function CrmShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <LyxShell
      pathname={pathname}
      brandMark={<LyxMark />}
      brandName="CRM Comercial"
      user={{ name: "Rafael Souza", email: "rafael.souza@exemplo.com" }}
      sections={SECTIONS_CRM}
      navigate={(href) => router.push(href)}
      onAccountSelect={(id) => toast(`${id}: tela de exemplo`)}
    >
      {children}
    </LyxShell>
  );
}
