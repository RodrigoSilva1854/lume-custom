// Demo do bloco lyx-shell no site: o CRM LYX com o menu de verdade e todas as
// telas preenchidas com dados de exemplo (./mock.ts). Arquivo do site, não
// entra na registry.
"use client";

import {
  IconBookmark,
  IconBox,
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconCheck,
  IconCoin,
  IconColumns3,
  IconDownload,
  IconExternalLink,
  IconLayoutKanban,
  IconList,
  IconPlus,
  IconSearch,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  LyxShell,
  prefixSections,
} from "@/registry/base-vega/blocks/lyx-shell/lyx-shell";
import { CardSparkline } from "@/registry/base-vega/components/card-sparkline";
import * as BarChart from "@/registry/base-vega/components/evilcharts/charts/bar-chart";
import type { ChartConfig } from "@/registry/base-vega/components/evilcharts/core/chart";
import {
  ActiveFilters,
  countFilters,
  FilterButton,
  FilterDrawer,
  type FilterGroup,
  type FilterValues,
  type SavedView,
} from "@/registry/base-vega/components/filter-drawer";
import {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  KanbanEmpty,
} from "@/registry/base-vega/components/kanban-column";
import { Link } from "@/registry/base-vega/components/link";
import {
  GradientBarChart,
  type LyxTone,
  MeterRow,
} from "@/registry/base-vega/components/lyx-charts";
import { LyxSelect } from "@/registry/base-vega/components/lyx-select";
import { LyxStatCard } from "@/registry/base-vega/components/lyx-stat-card";
import { PillMeter } from "@/registry/base-vega/components/pill-meter";
import {
  ChartLegend,
  themed,
} from "@/registry/base-vega/components/trend-charts";
import {
  UNIT_STATUS,
  type Unit,
  UnitMap,
  type UnitStatus,
} from "@/registry/base-vega/components/unit-map";
import { ViewToggle } from "@/registry/base-vega/components/view-toggle";
import { SECTIONS, type Section } from "@/registry/base-vega/lib/sections";
import { cn } from "@/registry/base-vega/lib/utils";
import { Badge } from "@/registry/base-vega/ui/badge";
import { Button } from "@/registry/base-vega/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/base-vega/ui/card";
import { Input } from "@/registry/base-vega/ui/input";
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

import {
  Avancados,
  CalorChart,
  DiaADia,
  FunilChart,
  SectionTitle,
} from "./charts-demo";
import {
  BLOCOS,
  COMISSOES,
  DIST,
  DOT,
  EMPREENDIMENTOS_DISP,
  LEAD_STAGES,
  LEADS,
  LEADS_POR_DIA,
  money,
  ORIGEM,
  PRE_CADASTROS,
  PRE_STAGES,
  RES_STAGES,
  RESERVAS,
  type Row,
  type Stage,
  ULTIMOS_ACESSOS,
  unitInfo,
  units,
  VENDAS_POR_MES,
} from "./mock";

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

/* ---------------------------------------------------------------- peças */

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
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

const Code = ({ n }: { n: number }) => (
  <span className="text-xs text-muted-foreground tabular-nums">#{n}</span>
);

function StageBadge({ stages, stage }: { stages: Stage[]; stage: string }) {
  const s = stages.find((x) => x.key === stage) ?? stages[0];
  return (
    <Badge variant={s.tone} className="normal-case">
      {s.label}
    </Badge>
  );
}

const CHIP_ON = "bg-muted font-medium shadow-none";

/** Chips de etapa com contagem, que filtram a lista. */
function StageChips({
  stages,
  rows,
  value,
  onChange,
}: {
  stages: Stage[];
  rows: Row[];
  value: string;
  onChange: (v: string) => void;
}) {
  const chip = (key: string, label: string, n: number, dot?: string) => (
    <Button
      key={key}
      variant="outline"
      size="sm"
      aria-pressed={value === key}
      onClick={() => onChange(key)}
      className={cn("font-normal", value === key && CHIP_ON)}
    >
      {dot && <span className={cn("size-1.5 rounded-full", dot)} />}
      {label}
      <span className="text-muted-foreground tabular-nums">{n}</span>
    </Button>
  );
  return (
    <div className="flex flex-wrap gap-2">
      {chip("todos", "Todos", rows.length)}
      {stages.map((s) =>
        chip(
          s.key,
          s.label,
          rows.filter((r) => r.stage === s.key).length,
          DOT[s.tone],
        ),
      )}
    </div>
  );
}

const LEAD_VIEWS: SavedView[] = [
  { name: "Sem corretor", value: { responsavel: "Sem corretor" } },
  {
    name: "Score alto sem tarefa",
    value: { score: ["76 a 100"], semTarefa: true },
  },
];

const SCORE_FAIXAS = ["0 a 25", "26 a 50", "51 a 75", "76 a 100"];

function inFaixa(score: number | undefined, faixa: string) {
  if (score === undefined) return false;
  const [lo, hi] = faixa.split(" a ").map(Number);
  return score >= lo && score <= hi;
}

/** Monta os grupos da gaveta a partir das colunas da lista. */
function filterGroups(rows: Row[], cols: Col[]): FilterGroup[] {
  const uniq = (k: string) =>
    [...new Set(rows.map((r) => r.cols[k]).filter(Boolean))].sort();
  const has = (k: string) => cols.some((c) => c.key === k);
  const resp = has("responsavel") ? "responsavel" : "imobiliaria";
  const emp = has("empreendimento") ? "empreendimento" : "unidade";
  const groups: FilterGroup[] = [
    {
      title: "Quem atende",
      fields: [
        {
          id: resp,
          label: resp === "imobiliaria" ? "Imobiliária" : "Responsável",
          type: "select",
          options: uniq(resp),
        },
        ...(has("area")
          ? [
              {
                id: "area",
                label: "Área",
                type: "select" as const,
                options: uniq("area"),
              },
            ]
          : []),
      ],
    },
    {
      title: "O que procura",
      fields: [
        {
          id: emp,
          label: "Empreendimento",
          type: "select",
          options: uniq(emp),
        },
        ...(has("origem")
          ? [
              {
                id: "origem",
                label: "Origem",
                type: "chips" as const,
                options: uniq("origem"),
              },
            ]
          : []),
      ],
    },
  ];
  if (has("score"))
    groups.push({
      title: "Qualidade e urgência",
      fields: [
        { id: "score", label: "Score", type: "chips", options: SCORE_FAIXAS },
        { id: "semTarefa", label: "Sem tarefa agendada", type: "check" },
      ],
    });
  return groups;
}

function applyFilters(rows: Row[], f: FilterValues, q: string) {
  const t = q.trim().toLowerCase();
  return rows.filter((r) => {
    if (
      t &&
      !`${r.name} ${r.code} ${Object.values(r.cols).join(" ")}`
        .toLowerCase()
        .includes(t)
    )
      return false;
    for (const [k, v] of Object.entries(f)) {
      if (k === "score" && Array.isArray(v) && v.length) {
        if (!v.some((faixa) => inFaixa(r.score, faixa))) return false;
      } else if (k === "semTarefa" && v === true) {
        if (r.foot !== "Sem tarefa") return false;
      } else if (Array.isArray(v) && v.length) {
        if (!v.includes(r.cols[k] ?? "")) return false;
      } else if (typeof v === "string" && v && v !== "Todos") {
        if (r.cols[k] !== v) return false;
      }
    }
    return true;
  });
}

function Toolbar({
  placeholder,
  query,
  onQuery,
  filterCount,
  onFilters,
}: {
  placeholder: string;
  query: string;
  onQuery: (q: string) => void;
  filterCount: number;
  onFilters: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full max-w-sm">
        <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-9"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>
      <FilterButton count={filterCount} onClick={onFilters} />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Exportar"
        onClick={() => toast("Exportar: tela de exemplo")}
      >
        <IconDownload />
      </Button>
    </div>
  );
}

type Col = { key: string; label: string; align?: "right" };

function ScoreBar({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-2 tabular-nums">
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
        <span
          className={cn(
            "lyx-grow-x block h-full rounded-full",
            score >= 70
              ? "bg-emerald-500"
              : score >= 50
                ? "bg-blue-500"
                : "bg-orange-500",
          )}
          style={{ width: `${score}%` }}
        />
      </span>
      {score}
    </span>
  );
}

/** Gestão: chips de etapa, busca e tabela. */
function ListPage({
  section,
  title,
  sub,
  newLabel,
  stages,
  rows,
  first,
  cols,
}: {
  section?: Section;
  title: string;
  sub: string;
  newLabel: string;
  stages: Stage[];
  rows: Row[];
  first: string;
  cols: Col[];
}) {
  const [stage, setStage] = useState("todos");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [drawer, setDrawer] = useState(false);
  const [views, setViews] = useState<SavedView[]>(() =>
    cols.some((c) => c.key === "score") ? LEAD_VIEWS : [],
  );
  const groups = useMemo(() => filterGroups(rows, cols), [rows, cols]);
  const filtered = applyFilters(rows, filters, query);
  const list =
    stage === "todos" ? filtered : filtered.filter((r) => r.stage === stage);
  return (
    <>
      <Title
        section={section}
        title={title}
        sub={sub}
        actions={
          <>
            <Button variant="outline">
              <IconCalendarEvent />
              Minha agenda
            </Button>
            <Button onClick={() => toast(`${newLabel}: tela de exemplo`)}>
              <IconPlus />
              {newLabel}
            </Button>
          </>
        }
      />
      <StageChips
        stages={stages}
        rows={rows}
        value={stage}
        onChange={setStage}
      />
      <Toolbar
        placeholder="Buscar por nome, código ou responsável…"
        query={query}
        onQuery={setQuery}
        filterCount={countFilters(filters)}
        onFilters={() => setDrawer(true)}
      />
      <ActiveFilters groups={groups} value={filters} onChange={setFilters} />
      <FilterDrawer
        open={drawer}
        onOpenChange={setDrawer}
        groups={groups}
        value={filters}
        onChange={setFilters}
        resultCount={list.length}
        savedViews={views}
        onSaveView={(name) => {
          setViews((v) => [...v, { name, value: filters }]);
          toast(`Visão "${name}" salva`);
        }}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{first}</TableHead>
            {cols.map((c) => (
              <TableHead
                key={c.key}
                className={c.align === "right" ? "text-right" : undefined}
              >
                {c.label}
              </TableHead>
            ))}
            <TableHead>Situação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((r) => (
            <TableRow key={r.code}>
              <TableCell>
                <div className="flex flex-col">
                  <span>{r.name}</span>
                  <Code n={r.code} />
                </div>
              </TableCell>
              {cols.map((c) => (
                <TableCell
                  key={c.key}
                  className={cn(
                    c.align === "right" && "text-right tabular-nums",
                    /^Sem /.test(r.cols[c.key] ?? "") &&
                      "text-muted-foreground",
                  )}
                >
                  {c.key === "score" ? (
                    <ScoreBar score={r.score ?? 0} />
                  ) : c.key === "area" ? (
                    <Badge variant="outline">{r.cols.area}</Badge>
                  ) : (
                    r.cols[c.key]
                  )}
                </TableCell>
              ))}
              <TableCell>
                <StageBadge stages={stages} stage={r.stage} />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  Abrir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-xs text-muted-foreground tabular-nums">
        {list.length} de {rows.length} registros
      </p>
    </>
  );
}

type Mode = "lista" | "quadro" | "compacto";
const MODES = [
  { value: "lista" as const, label: "Lista", icon: IconList },
  { value: "quadro" as const, label: "Quadro", icon: IconLayoutKanban },
  { value: "compacto" as const, label: "Quadro compacto", icon: IconColumns3 },
];

/** Andamento: kanban por etapa, com o alternador de visualização. */
function BoardPage({
  section,
  title,
  sub,
  stages,
  rows,
  extra,
}: {
  section?: Section;
  title: string;
  sub: string;
  stages: Stage[];
  rows: Row[];
  extra?: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>("quadro");
  return (
    <>
      <Title
        section={section}
        title={title}
        sub={sub}
        actions={
          <ViewToggle value={mode} onValueChange={setMode} options={MODES} />
        }
      />
      {extra}
      {mode === "lista" ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Próximo passo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.code}>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{r.name}</span>
                    <Code n={r.code} />
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{r.phone}</TableCell>
                <TableCell>
                  <StageBadge stages={stages} stage={r.stage} />
                </TableCell>
                <TableCell>{r.foot}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <KanbanBoard>
          {stages.map((s) => {
            const items = rows.filter((r) => r.stage === s.key);
            return (
              <KanbanColumn
                key={s.key}
                title={s.label}
                count={items.length}
                dotClassName={DOT[s.tone]}
                className={mode === "compacto" ? "w-60" : undefined}
              >
                {items.length ? (
                  items.map((r) => (
                    <KanbanCard key={r.code}>
                      <div className="flex items-center justify-between gap-2">
                        <Code n={r.code} />
                        <IconExternalLink className="size-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium tracking-tight">
                          {r.name}
                        </span>
                        {mode === "quadro" && (
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {r.phone}
                          </span>
                        )}
                      </div>
                      {mode === "quadro" && (
                        <div className="flex items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
                          {r.foot}
                          <Button variant="outline" size="xs">
                            Abrir
                          </Button>
                        </div>
                      )}
                    </KanbanCard>
                  ))
                ) : (
                  <KanbanEmpty>Nada nesta etapa</KanbanEmpty>
                )}
              </KanbanColumn>
            );
          })}
        </KanbanBoard>
      )}
    </>
  );
}

type StatItem = {
  label: string;
  value: string;
  icon: typeof IconUsers;
  tone: string;
  hint?: string;
  delta?: { pct: number; dir: "up" | "down" | "flat" };
};

function Stats({ items, charts }: { items: StatItem[]; charts?: boolean }) {
  return (
    <div className="@container">
      <div className="grid gap-4 @lg:grid-cols-2 @min-[62rem]:grid-cols-4">
        {items.map((c, i) => (
          <LyxStatCard
            key={c.label}
            label={c.label}
            value={c.value}
            hint={c.hint}
            delta={
              c.delta
                ? c.delta.dir === "down"
                  ? -c.delta.pct
                  : c.delta.pct
                : undefined
            }
            icon={c.icon}
            iconClassName={c.tone}
            chart={
              charts ? (
                <CardSparkline
                  data={LEADS_POR_DIA.slice(i * 3, i * 3 + 14).map(
                    (d) => d.leads,
                  )}
                  className={c.tone}
                />
              ) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}

/** Distribuição: métricas e carga por corretor. */
function DistPage({
  section,
  title,
  sub,
  noun,
  extra,
}: {
  section?: Section;
  title: string;
  sub: string;
  noun: string;
  extra?: React.ReactNode;
}) {
  const total = DIST.reduce((a, d) => a + d.active, 0);
  return (
    <>
      <Title
        section={section}
        title={title}
        sub={sub}
        actions={
          <Button onClick={() => toast("Distribuir: tela de exemplo")}>
            Distribuir agora
          </Button>
        }
      />
      <Stats
        items={[
          {
            label: `${noun} ativos`,
            value: String(total),
            icon: IconUsers,
            tone: "text-emerald-500",
          },
          {
            label: "Corretores",
            value: String(DIST.length),
            icon: IconUserCheck,
            tone: "text-blue-500",
          },
          {
            label: "Média por corretor",
            value: (total / DIST.length).toLocaleString("pt-BR", {
              maximumFractionDigits: 1,
            }),
            icon: IconCoin,
            tone: "text-amber-500",
          },
          {
            label: `${noun} sem corretor`,
            value: "4",
            icon: IconBookmark,
            tone: "text-rose-500",
          },
        ]}
      />
      {extra}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Corretor</TableHead>
            <TableHead>Equipe</TableHead>
            <TableHead>Carga</TableHead>
            <TableHead className="text-right">Ativos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DIST.map((d) => (
            <TableRow key={d.name}>
              <TableCell>{d.name}</TableCell>
              <TableCell className="text-muted-foreground">{d.team}</TableCell>
              <TableCell>
                <PillMeter
                  fraction={d.active / d.total}
                  count={24}
                  className="max-w-48"
                />
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {d.active}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

/* --------------------------------------------------------------- gráficos */

const vendasConfig = {
  reservas: { label: "Reservas", colors: themed("var(--nav-reservas)") },
  vendas: { label: "Vendas", colors: themed("var(--nav-comissoes)") },
} satisfies ChartConfig;

function useMode() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? "dark" : "light";
}

function VendasChart() {
  const [sel, setSel] = useState<string | null>(null);
  const mode = useMode();
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <div>
          <CardTitle>Reservas e vendas</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </div>
        <ChartLegend
          config={vendasConfig}
          selected={sel}
          onSelect={setSel}
          mode={mode}
        />
      </CardHeader>
      <CardContent className="mt-3">
        <BarChart.EvilBarChart
          config={vendasConfig}
          data={VENDAS_POR_MES}
          xDataKey="mes"
          selectedDataKey={sel}
          onSelectionChange={setSel}
          className="h-56 w-full"
          chartProps={{
            margin: { top: 5, right: 5, bottom: 5, left: 2 },
            barCategoryGap: "35%",
          }}
        >
          <BarChart.Grid />
          <BarChart.XAxis dataKey="mes" />
          <BarChart.YAxis allowDecimals={false} />
          <BarChart.Tooltip />
          <BarChart.Bar dataKey="reservas" isClickable />
          <BarChart.Bar dataKey="vendas" isClickable />
        </BarChart.EvilBarChart>
      </CardContent>
    </Card>
  );
}

const ORIGEM_TONES: LyxTone[] = [
  "violet",
  "rose",
  "sky",
  "emerald",
  "amber",
  "neutral",
];

function OrigemCard() {
  const total = ORIGEM.reduce((a, o) => a + o.qtd, 0);
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Por origem</CardTitle>
        <CardDescription>
          De onde vieram os leads do período. Google e Instagram somam mais da
          metade.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {ORIGEM.map((o, i) => (
          <MeterRow
            key={o.nome}
            label={o.nome}
            value={`${o.qtd} leads · ${((o.qtd / total) * 100).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`}
            fraction={o.qtd / ORIGEM[0].qtd}
            tone={ORIGEM_TONES[i]}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function LeadsPorDia() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Leads por dia</CardTitle>
        <CardDescription>Últimos 30 dias</CardDescription>
      </CardHeader>
      <CardContent className="mt-2">
        <GradientBarChart
          label="Leads por dia nos últimos 30 dias"
          data={LEADS_POR_DIA.map((d) => ({ label: d.dia, value: d.leads }))}
          unit="leads"
        />
      </CardContent>
    </Card>
  );
}

const FUNIL: { label: string; qtd: number; tone: LyxTone }[] = [
  { label: "Aguardando atendimento", qtd: 208, tone: "neutral" },
  { label: "Em atendimento", qtd: 608, tone: "amber" },
  { label: "1ª visita", qtd: 389, tone: "sky" },
  { label: "Com reserva", qtd: 79, tone: "violet" },
  { label: "Venda realizada", qtd: 16, tone: "emerald" },
];

function SeeAll({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function FunilCard() {
  const total = FUNIL.reduce((a, f) => a + f.qtd, 0);
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Funil do período</CardTitle>
          <CardDescription>Onde está cada lead recebido.</CardDescription>
        </div>
        <SeeAll href={`${CRM_BASE}/leads/andamento`}>Ver andamento</SeeAll>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {FUNIL.map((f) => (
          <MeterRow
            key={f.label}
            label={f.label}
            value={`${f.qtd} leads · ${((f.qtd / total) * 100).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`}
            fraction={f.qtd / FUNIL[1].qtd}
            tone={f.tone}
          />
        ))}
      </CardContent>
    </Card>
  );
}

const RANKING = [
  {
    nome: "Dercy Ramos",
    equipe: "Equipe Laura · POA",
    leads: 193,
    visitas: 56,
    vendas: 3,
  },
  {
    nome: "Nicolas Prado",
    equipe: "Equipe Menna · POA",
    leads: 163,
    visitas: 47,
    vendas: 3,
  },
  {
    nome: "Samara Leite",
    equipe: "Equipe Karoline · CWB",
    leads: 178,
    visitas: 51,
    vendas: 2,
  },
  {
    nome: "Paulo Venturini",
    equipe: "Equipe Laura · POA",
    leads: 134,
    visitas: 39,
    vendas: 2,
  },
  {
    nome: "Anna Rezende",
    equipe: "Equipe Adalberto · CWB",
    leads: 119,
    visitas: 34,
    vendas: 2,
  },
];

function RankingCard() {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Ranking de corretores</CardTitle>
          <CardDescription>
            Quem mais converteu lead em venda no período.
          </CardDescription>
        </div>
        <SeeAll href={`${CRM_BASE}/leads/distribuicao`}>Ver equipes</SeeAll>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Corretor</TableHead>
              <TableHead className="text-right">Leads</TableHead>
              <TableHead className="text-right">Visitas</TableHead>
              <TableHead className="text-right">Vendas</TableHead>
              <TableHead className="text-right">Conversão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RANKING.map((r) => {
              const conv = r.vendas / r.leads;
              return (
                <TableRow key={r.nome}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs text-muted-foreground">
                        {r.nome
                          .split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <div className="flex flex-col">
                        <span>{r.nome}</span>
                        <span className="text-xs text-muted-foreground">
                          {r.equipe}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.leads}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.visitas}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.vendas}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2 tabular-nums">
                      {(conv * 100).toLocaleString("pt-BR", {
                        maximumFractionDigits: 1,
                        minimumFractionDigits: 1,
                      })}
                      %
                      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <span
                          className="lyx-grow-x block h-full rounded-full bg-linear-to-r from-violet-300 to-violet-500"
                          style={{
                            width: `${Math.min(100, conv * 100 * 25)}%`,
                          }}
                        />
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const VISITAS = [
  {
    quando: "Hoje, 14h",
    nome: "Marina Albuquerque",
    emp: "Atlanta Condomínio Clube",
    corretor: "Dercy Ramos",
  },
  {
    quando: "Hoje, 16h30",
    nome: "Helena Vasques",
    emp: "Blue Lake Fase II",
    corretor: "Samara Leite",
  },
  {
    quando: "Amanhã, 10h",
    nome: "Otávio Brandão",
    emp: "Madison II Condomínio Clube",
    corretor: "Nicolas Prado",
  },
  {
    quando: "Sexta, 9h",
    nome: "Lívia Monteiro",
    emp: "Kentucky Fase III",
    corretor: "Anna Rezende",
  },
];

function VisitasCard() {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Próximas visitas</CardTitle>
          <CardDescription>Agenda da equipe nos próximos dias.</CardDescription>
        </div>
        <SeeAll href={`${CRM_BASE}/leads`}>Ver agenda</SeeAll>
      </CardHeader>
      <CardContent className="flex flex-col">
        {VISITAS.map((v) => (
          <div
            key={v.nome}
            className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 py-2.5 text-sm not-last:border-b not-last:border-border/50"
          >
            <span className="font-medium">{v.quando}</span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate">{v.nome}</span>
              <span className="truncate text-xs text-muted-foreground">
                {v.emp}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">{v.corretor}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const METAS = [
  { label: "Leads atendidos", feito: 1184, meta: 1500 },
  { label: "Visitas realizadas", feito: 395, meta: 450 },
  { label: "Reservas", feito: 78, meta: 100 },
  { label: "Vendas", feito: 17, meta: 25 },
];

function MetasCard() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Metas do mês</CardTitle>
        <CardDescription>
          Quanto da meta de outubro já foi atingido.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {METAS.map((m) => (
          <MeterRow
            key={m.label}
            label={m.label}
            value={`${m.feito.toLocaleString("pt-BR")} de ${m.meta.toLocaleString("pt-BR")} · ${Math.round((m.feito / m.meta) * 100)}%`}
            fraction={m.feito / m.meta}
            tone="ink"
          />
        ))}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ telas */

function Inicio({ section }: { section?: Section }) {
  const [charts, setCharts] = useState(false);
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
      <Stats
        charts={charts}
        items={[
          {
            label: "Leads recebidos",
            value: "1.509",
            hint: "vs. período anterior",
            delta: { pct: 0.097, dir: "up" },
            icon: IconUsers,
            tone: "text-emerald-500",
          },
          {
            label: "Visitas realizadas",
            value: "395",
            hint: "26,2% dos leads",
            delta: { pct: 0.145, dir: "up" },
            icon: IconCalendarEvent,
            tone: "text-rose-500",
          },
          {
            label: "Reservas",
            value: "78",
            hint: "19,7% das visitas",
            delta: { pct: 0.219, dir: "up" },
            icon: IconBookmark,
            tone: "text-amber-500",
          },
          {
            label: "Vendas",
            value: "17",
            hint: "R$ 10,5 mi em VGV",
            delta: { pct: 0.545, dir: "up" },
            icon: IconCoin,
            tone: "text-sky-500",
          },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <LeadsPorDia />
        <OrigemCard />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
        <FunilCard />
        <RankingCard />
      </div>
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <VisitasCard />
        <MetasCard />
      </div>
    </>
  );
}

function Inicio2({ section }: { section?: Section }) {
  return (
    <>
      <Title
        section={section}
        title="Início 2"
        sub="Boa tarde, Rafael! Carteira, unidades e processos de hoje."
      />
      <Stats
        items={[
          {
            label: "Total de processos",
            value: "1.222",
            hint: "1.222 ativos",
            icon: IconLayoutKanban,
            tone: "text-emerald-500",
          },
          {
            label: "Contratos assinados",
            value: "64",
            hint: "no mês",
            delta: { pct: 0.08, dir: "up" },
            icon: IconUserCheck,
            tone: "text-rose-500",
          },
          {
            label: "Unidades disponíveis",
            value: "312",
            hint: "em 6 empreendimentos",
            icon: IconBookmark,
            tone: "text-amber-500",
          },
          {
            label: "VGV do mês",
            value: "R$ 10,5 mi",
            hint: "meta R$ 12 mi",
            icon: IconCoin,
            tone: "text-sky-500",
          },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <VendasChart />
        <Card size="sm">
          <CardHeader>
            <CardTitle>Processos de hoje</CardTitle>
            <CardDescription>O que precisa de atenção agora.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            {RESERVAS.slice(0, 5).map((r) => (
              <div
                key={r.code}
                className="flex items-center justify-between gap-3 py-2.5 text-sm not-last:border-b not-last:border-border/50"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate">{r.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.foot}
                  </span>
                </div>
                <StageBadge stages={RES_STAGES} stage={r.stage} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

const UNIT_FILTERS = [
  "todas",
  "disponivel",
  "reservada",
  "vendida",
  "bloqueada",
] as const;

function Disponibilidade({ section }: { section?: Section }) {
  const [uf, setUf] = useState("Todos");
  const [emp, setEmp] = useState(EMPREENDIMENTOS_DISP[0]);
  const [bloco, setBloco] = useState(0);
  const [filtro, setFiltro] = useState<UnitStatus | "todas">("todas");
  const [sel, setSel] = useState<Unit | undefined>();
  const andares = useMemo(() => units(bloco), [bloco]);
  const all = andares.flatMap((a) => a.units);
  const count = (s: UnitStatus) => all.filter((u) => u.status === s).length;
  const livres = (b: number) =>
    units(b)
      .flatMap((a) => a.units)
      .filter((u) => u.status === "disponivel").length;
  const info = sel ? unitInfo(sel.numero) : undefined;

  return (
    <>
      <Title
        section={section}
        title="Mapa de disponibilidade"
        sub="Escolha um empreendimento e veja a situação de cada unidade."
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Estado</span>
        <LyxSelect
          label="Estado"
          className="w-28"
          value={uf}
          onValueChange={setUf}
          options={["RS", "PR"]}
          allLabel="Todos"
        />
        <span className="text-sm text-muted-foreground">Empreendimento</span>
        <LyxSelect
          label="Empreendimento"
          className="w-[22rem] max-w-full"
          value={emp}
          onValueChange={(v) => {
            setEmp(v);
            setSel(undefined);
          }}
          options={EMPREENDIMENTOS_DISP.filter(
            (e) => uf === "Todos" || e.endsWith(`/${uf}`),
          )}
        />
        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => toast("Visão 3D: em breve")}
        >
          <IconBox />
          Visão 3D
          <Badge variant="outline" className="font-normal normal-case">
            Em breve
          </Badge>
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted-foreground">
          Últimos acessos
        </span>
        {ULTIMOS_ACESSOS.map((u) => (
          <Button
            key={u}
            variant="outline"
            size="sm"
            onClick={() => {
              const e = EMPREENDIMENTOS_DISP.find((x) => x.startsWith(u));
              if (e) setEmp(e);
            }}
          >
            {u}
          </Button>
        ))}
      </div>
      <Stats
        items={[
          {
            label: "Unidades no empreendimento",
            value: "80",
            icon: IconBuildingSkyscraper,
            tone: "text-emerald-500",
          },
          {
            label: "Disponíveis",
            value: "23",
            icon: IconCheck,
            tone: "text-emerald-500",
          },
          {
            label: "Reservadas",
            value: "18",
            icon: IconBookmark,
            tone: "text-amber-500",
          },
          {
            label: "Vendidas",
            value: "34",
            icon: IconCoin,
            tone: "text-sky-500",
          },
        ]}
      />
      <Card
        size="sm"
        className="gap-0 py-0 data-[size=sm]:gap-0 data-[size=sm]:py-0"
      >
        <div className="flex flex-wrap gap-2 border-b border-border/50 px-5 py-4">
          {BLOCOS.map((b, i) => (
            <Button
              key={b}
              variant="outline"
              size="sm"
              aria-pressed={bloco === i}
              onClick={() => {
                setBloco(i);
                setSel(undefined);
              }}
              className={cn("font-normal", bloco === i && CHIP_ON)}
            >
              {b}
              <span className="text-muted-foreground tabular-nums">
                {livres(i)} livres
              </span>
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 border-b border-border/50 px-5 py-4">
          {UNIT_FILTERS.map((s) => (
            <Button
              key={s}
              variant="outline"
              size="sm"
              aria-pressed={filtro === s}
              onClick={() => setFiltro(s)}
              className={cn("font-normal", filtro === s && CHIP_ON)}
            >
              {s !== "todas" && (
                <span
                  className={cn("size-1.5 rounded-full", UNIT_STATUS[s].dot)}
                />
              )}
              {s === "todas" ? "Todas" : UNIT_STATUS[s].label}
              <span className="text-muted-foreground tabular-nums">
                {s === "todas" ? all.length : count(s)}
              </span>
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-6 p-5 lg:flex-row lg:items-start lg:justify-between">
          <UnitMap
            floors={andares}
            filter={filtro}
            selected={sel?.numero}
            onSelect={setSel}
          />
          <div className="w-full shrink-0 rounded-2xl bg-card p-4 shadow-(--custom-shadow) lg:w-64 squircle:rounded-3xl corner-squircle">
            {sel && info ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    Unidade {sel.numero}
                  </span>
                  <Badge
                    variant={
                      sel.status === "disponivel"
                        ? "emerald"
                        : sel.status === "reservada"
                          ? "amber"
                          : sel.status === "bloqueada"
                            ? "red"
                            : "secondary"
                    }
                    className="normal-case"
                  >
                    {UNIT_STATUS[sel.status].label}
                  </Badge>
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Bloco</dt>
                  <dd className="text-right">{BLOCOS[bloco]}</dd>
                  <dt className="text-muted-foreground">Área</dt>
                  <dd className="text-right tabular-nums">{info.area}</dd>
                  <dt className="text-muted-foreground">Dormitórios</dt>
                  <dd className="text-right tabular-nums">
                    {info.dormitorios}
                  </dd>
                  <dt className="text-muted-foreground">Vagas</dt>
                  <dd className="text-right tabular-nums">{info.vagas}</dd>
                  <dt className="text-muted-foreground">Valor</dt>
                  <dd className="text-right font-medium tabular-nums">
                    {info.valor}
                  </dd>
                </dl>
                <Button
                  disabled={sel.status !== "disponivel"}
                  onClick={() =>
                    toast(`Reserva da unidade ${sel.numero}: tela de exemplo`)
                  }
                >
                  Reservar unidade
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">
                  Nenhuma unidade selecionada
                </span>
                <span className="text-sm text-muted-foreground text-pretty">
                  Clique em um apartamento para ver área, valor e situação.
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}

function ComissoesTabs({ path }: { path: string }) {
  const tabs = [
    { href: `${CRM_BASE}/comissoes`, label: "Buscar" },
    { href: `${CRM_BASE}/comissoes/lista`, label: "Lista" },
    { href: `${CRM_BASE}/comissoes/configuracoes`, label: "Configurações" },
  ];
  const cur = `${CRM_BASE}/${path}`;
  return (
    <div className="inline-flex w-fit items-center gap-0.5 rounded-full bg-muted p-[3px]">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={cur === t.href ? "page" : undefined}
          className={cn(
            "rounded-full px-3 py-1 text-sm transition-colors",
            cur === t.href
              ? "bg-background font-medium text-foreground shadow-(--custom-shadow)"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

const CONFIGS = [
  {
    t: "Calcular comissão na assinatura",
    d: "A comissão nasce quando o contrato é assinado.",
    on: true,
  },
  {
    t: "Avisar o corretor por e-mail",
    d: "Envia o extrato quando a comissão é paga.",
    on: true,
  },
  {
    t: "Bloquear estorno após 90 dias",
    d: "Estornos antigos passam pela gerência.",
    on: false,
  },
];

function Comissoes({ section, path }: { section?: Section; path: string }) {
  return (
    <>
      <Title
        section={section}
        title="Comissões"
        sub="Busque comissões por empresa, período, situação e espécie."
      />
      <ComissoesTabs path={path} />
      {path === "comissoes" && (
        <Card size="sm">
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2.5">
                <Label>CNPJ da empresa</Label>
                <Input placeholder="00.000.000/0000-00" />
              </div>
              <div className="flex flex-col gap-2.5">
                <Label>Período</Label>
                <Input placeholder="Out/2026" />
              </div>
              <div className="flex flex-col gap-2.5">
                <Label>Situação</Label>
                <Input placeholder="Todas" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => toast("Buscar: tela de exemplo")}>
                <IconSearch />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {path === "comissoes/lista" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COMISSOES.map((c) => (
              <TableRow key={c.empresa}>
                <TableCell>{c.empresa}</TableCell>
                <TableCell className="text-muted-foreground">
                  {c.periodo}
                </TableCell>
                <TableCell>
                  <Badge variant={c.tone} className="normal-case">
                    {c.situacao}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {money(c.valor)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {path === "comissoes/configuracoes" && (
        <Card size="sm">
          <CardContent className="flex flex-col">
            {CONFIGS.map((c) => (
              <Label
                key={c.t}
                className="flex cursor-pointer items-center justify-between gap-4 py-3 not-last:border-b not-last:border-border/50"
              >
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{c.t}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {c.d}
                  </span>
                </span>
                <Switch defaultChecked={c.on} />
              </Label>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}

const FUNIS = [
  {
    title: "MRV",
    dot: "bg-neutral-400",
    items: ["Sensia Horizon", "Château de Vermont", "Residencial Cortese"],
  },
  { title: "Hercasa", dot: "bg-blue-500", items: ["Residencial Roma"] },
  {
    title: "Valor Real",
    dot: "bg-orange-500",
    items: [
      "Residencial Santa Clara",
      "Residencial New South",
      "Duna House",
      "Luna House",
    ],
  },
  { title: "Make IT", dot: "bg-violet-500", items: ["Now", "Horizon"] },
  {
    title: "Blue",
    dot: "bg-sky-500",
    items: ["Civitas", "Cena Passeio", "Aya Emiliano Perneta"],
  },
  { title: "Tenda", dot: "bg-emerald-500", items: [] as string[] },
];

function Funis({ section }: { section?: Section }) {
  const [mode, setMode] = useState<Mode>("quadro");
  return (
    <>
      <Title
        section={section}
        title="Funis"
        sub="Acompanhe os processos de cada funil, coluna por coluna."
        actions={
          <>
            <span className="text-sm text-muted-foreground tabular-nums">
              13 processos ativos
            </span>
            <Button onClick={() => toast("Novo processo: tela de exemplo")}>
              <IconPlus />
              Novo processo
            </Button>
            <ViewToggle value={mode} onValueChange={setMode} options={MODES} />
          </>
        }
      />
      <KanbanBoard>
        {FUNIS.map((c, ci) => (
          <KanbanColumn
            key={c.title}
            title={c.title}
            count={c.items.length}
            dotClassName={c.dot}
            className={mode === "compacto" ? "w-60" : undefined}
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
                    {ci < 3 ? "Adriana Fontes" : "André Gouveia"}
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

function ToggleDemo() {
  const [v, setV] = useState<Mode>("quadro");
  return <ViewToggle value={v} onValueChange={setV} options={MODES} />;
}

function Componentes({ section }: { section?: Section }) {
  return (
    <>
      <Title
        section={section}
        title="Componentes"
        sub="As peças do lume-custom que o CRM usa, num lugar só."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Botões</CardTitle>
            <CardDescription>
              Pílula; a variant muda o peso da ação.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button>Principal</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="outline">Contorno</Button>
            <Button variant="ghost">Fantasma</Button>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Situações</CardTitle>
            <CardDescription>
              Badge com sombra na cor do status.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {LEAD_STAGES.map((s) => (
              <Badge key={s.key} variant={s.tone} className="normal-case">
                {s.label}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Campos</CardTitle>
            <CardDescription>Rótulo e campo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            <Label>Nome do cliente</Label>
            <Input placeholder="Nome completo" />
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Alternador de visualização</CardTitle>
            <CardDescription>view-toggle do lume-custom.</CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleDemo />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Graficos({ section }: { section?: Section }) {
  return (
    <>
      <Title
        section={section}
        title="Gráficos"
        sub="Três estilos lado a lado: do dia a dia, avançados e os nossos feitos à mão."
      />
      <SectionTitle
        title="Do dia a dia"
        sub="lyx-recharts: estilo shadcn/ui Charts com as cores de seção."
      />
      <DiaADia />
      <SectionTitle
        title="Avançados"
        sub="lyx-echarts: Apache ECharts com o tema LYX, para funil, mapa de calor, sankey e séries longas."
      />
      <Avancados />
      <SectionTitle
        title="Nossos"
        sub="lyx-charts: barras em degradê e medidores feitos à mão."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <LeadsPorDia />
        <OrigemCard />
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- rotas */

const LEAD_COLS: Col[] = [
  { key: "score", label: "Score" },
  { key: "origem", label: "Origem" },
  { key: "empreendimento", label: "Empreendimento" },
  { key: "responsavel", label: "Responsável" },
];
const PRE_COLS: Col[] = [
  { key: "empreendimento", label: "Empreendimento" },
  { key: "valor", label: "Valor", align: "right" },
  { key: "imobiliaria", label: "Responsável" },
];
const RES_COLS: Col[] = [
  { key: "unidade", label: "Unidade" },
  { key: "valor", label: "Valor", align: "right" },
  { key: "responsavel", label: "Responsável" },
  { key: "area", label: "Área" },
];

/** Conteúdo de cada tela de exemplo (a casca fica no layout de /crm). */
export function CrmPage({ path }: { path: string }) {
  const pathname = path ? `${CRM_BASE}/${path}` : CRM_BASE;
  const section = SECTIONS_CRM.find(
    (s) =>
      s.items.some(
        (it) => pathname === it.href || pathname.startsWith(`${it.href}/`),
      ) &&
      (s.id !== "inicio" || pathname === CRM_BASE),
  );

  const pages: Record<string, () => React.ReactNode> = {
    "": () => <Inicio section={section} />,
    "inicio-2": () => <Inicio2 section={section} />,
    leads: () => (
      <ListPage
        section={section}
        title="Leads"
        sub="Acompanhe cada contato, do primeiro atendimento à venda."
        newLabel="Novo lead"
        stages={LEAD_STAGES}
        rows={LEADS}
        first="Contato"
        cols={LEAD_COLS}
      />
    ),
    "leads/andamento": () => (
      <BoardPage
        section={section}
        title="Andamento dos leads"
        sub="Em que etapa está cada lead."
        stages={LEAD_STAGES}
        rows={LEADS}
        extra={
          <Card size="sm">
            <CardHeader>
              <CardTitle>Funil de conversão</CardTitle>
              <CardDescription>
                Do lead recebido à venda, no período.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <FunilChart height={240} />
            </CardContent>
          </Card>
        }
      />
    ),
    "leads/distribuicao": () => (
      <DistPage
        section={section}
        title="Distribuição dos leads"
        sub="Quantos leads ativos cada corretor tem."
        noun="Leads"
        extra={
          <Card size="sm">
            <CardHeader>
              <CardTitle>Horários de atendimento</CardTitle>
              <CardDescription>
                Quando a equipe mais atende: bom para escalar plantões.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-2">
              <CalorChart height={260} />
            </CardContent>
          </Card>
        }
      />
    ),
    "pre-cadastros": () => (
      <ListPage
        section={section}
        title="Pré-cadastros"
        sub="Acompanhe a análise de crédito de cada cliente, da avaliação à aprovação."
        newLabel="Novo pré-cadastro"
        stages={PRE_STAGES}
        rows={PRE_CADASTROS}
        first="Cliente"
        cols={PRE_COLS}
      />
    ),
    "pre-cadastros/andamento": () => (
      <BoardPage
        section={section}
        title="Andamento dos pré-cadastros"
        sub="Em que etapa da análise está cada cliente."
        stages={PRE_STAGES}
        rows={PRE_CADASTROS}
      />
    ),
    "pre-cadastros/distribuicao": () => (
      <DistPage
        section={section}
        title="Distribuição dos pré-cadastros"
        sub="Quantos pré-cadastros cada corretor acompanha."
        noun="Pré-cadastros"
      />
    ),
    disponibilidade: () => <Disponibilidade section={section} />,
    reservas: () => (
      <ListPage
        section={section}
        title="Reservas"
        sub="Acompanhe cada reserva, do pedido à assinatura do contrato."
        newLabel="Nova reserva"
        stages={RES_STAGES}
        rows={RESERVAS}
        first="Cliente"
        cols={RES_COLS}
      />
    ),
    "reservas/andamento": () => (
      <BoardPage
        section={section}
        title="Andamento das reservas"
        sub="Em que etapa está cada reserva."
        stages={RES_STAGES}
        rows={RESERVAS}
      />
    ),
    "reservas/distribuicao": () => (
      <DistPage
        section={section}
        title="Distribuição das reservas"
        sub="Quantas reservas ativas cada corretor tem."
        noun="Reservas"
      />
    ),
    funis: () => <Funis section={section} />,
    comissoes: () => <Comissoes section={section} path={path} />,
    "comissoes/lista": () => <Comissoes section={section} path={path} />,
    "comissoes/configuracoes": () => (
      <Comissoes section={section} path={path} />
    ),
    componentes: () => <Componentes section={section} />,
    graficos: () => <Graficos section={section} />,
  };

  return (
    <>
      {(pages[path] ?? pages[""])()}
      <p className="pt-4 text-xs text-muted-foreground">
        Dados de exemplo: nomes, telefones e valores são fictícios.
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
