// Tela Gráficos da demo /crm: os três estilos lado a lado. Dia a dia
// (lyx-recharts, estilo shadcn), avançados (lyx-echarts) e os nossos feitos à
// mão (lyx-charts). Também exporta o funil e o mapa de calor usados em Leads.
// Dados fictícios. Arquivo do site, não entra na registry.
"use client";

import type { EChartsCoreOption } from "echarts/core";
import type * as React from "react";
import { useCallback } from "react";

import {
  LyxEChart,
  lyxToken,
} from "@/registry/base-vega/components/lyx-echarts";
import {
  LyxAreaChart,
  LyxBarChart,
  LyxDonutChart,
  LyxLineChart,
} from "@/registry/base-vega/components/lyx-recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/base-vega/ui/card";

import { LEADS_POR_DIA, ORIGEM, VENDAS_POR_MES } from "./mock";

function ChartCard({
  title,
  sub,
  children,
  className,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card size="sm" className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{sub}</CardDescription>
      </CardHeader>
      <CardContent className="mt-2">{children}</CardContent>
    </Card>
  );
}

export function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col gap-0.5 pt-4">
      <h2 className="text-sm font-medium tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground text-pretty">{sub}</p>
    </div>
  );
}

/* --------------------------------------------- dia a dia (estilo shadcn) */

const CONVERSAO = ["Mai", "Jun", "Jul", "Ago", "Set", "Out"].map((mes, i) => ({
  mes,
  poa: [1.2, 1.4, 1.3, 1.6, 1.7, 1.8][i],
  cwb: [0.9, 1.1, 1.2, 1.1, 1.3, 1.5][i],
  sul: [0.7, 0.8, 1.0, 1.2, 1.1, 1.4][i],
}));

const ORIGEM_CORES = [
  "var(--nav-pre-cadastros)",
  "var(--nav-componentes)",
  "var(--nav-inicio)",
  "var(--nav-comissoes)",
  "var(--nav-disponibilidade)",
  "var(--muted-foreground)",
];

export function DiaADia() {
  const total = ORIGEM.reduce((a, o) => a + o.qtd, 0);
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard
        title="Leads e visitas"
        sub="Área com degradê, últimos 30 dias"
      >
        <LyxAreaChart
          data={LEADS_POR_DIA}
          xKey="dia"
          series={[
            { key: "leads", label: "Leads", color: "var(--nav-leads)" },
            {
              key: "visitas",
              label: "Visitas",
              color: "var(--nav-pre-cadastros)",
            },
          ]}
        />
      </ChartCard>
      <ChartCard
        title="Reservas e vendas"
        sub="Barras empilhadas, últimos 6 meses"
      >
        <LyxBarChart
          data={VENDAS_POR_MES}
          xKey="mes"
          stacked
          series={[
            {
              key: "reservas",
              label: "Reservas",
              color: "var(--nav-reservas)",
            },
            { key: "vendas", label: "Vendas", color: "var(--nav-comissoes)" },
          ]}
        />
      </ChartCard>
      <ChartCard
        title="Conversão por regional"
        sub="Linhas, % de leads que viraram venda"
      >
        <LyxLineChart
          data={CONVERSAO}
          xKey="mes"
          series={[
            { key: "poa", label: "Porto Alegre", color: "var(--nav-leads)" },
            { key: "cwb", label: "Curitiba", color: "var(--nav-funis)" },
            { key: "sul", label: "Litoral", color: "var(--nav-comissoes)" },
          ]}
        />
      </ChartCard>
      <ChartCard title="Leads por origem" sub="Rosca com o total no meio">
        <LyxDonutChart
          total={total.toLocaleString("pt-BR")}
          totalLabel="leads"
          data={ORIGEM.map((o, i) => ({
            key: o.nome.toLowerCase(),
            label: o.nome,
            value: o.qtd,
            color: ORIGEM_CORES[i] ?? "var(--muted-foreground)",
          }))}
        />
      </ChartCard>
    </div>
  );
}

/* ------------------------------------------------- avançados (ECharts) */

const FUNIL = [
  { name: "Leads recebidos", value: 1509 },
  { name: "Em atendimento", value: 1092 },
  { name: "1ª visita", value: 395 },
  { name: "Com reserva", value: 78 },
  { name: "Venda", value: 17 },
];

/** Funil de conversão desenhado como funil. */
export function FunilChart({ height = 300 }: { height?: number }) {
  const option = useCallback((): EChartsCoreOption => {
    const tons = [
      "--nav-leads",
      "--nav-disponibilidade",
      "--nav-inicio",
      "--nav-pre-cadastros",
      "--nav-comissoes",
    ];
    return {
      tooltip: {
        trigger: "item",
        formatter: (p: { name: string; value: number }) =>
          `${p.name}<br/><b>${p.value.toLocaleString("pt-BR")}</b> · ${((p.value / FUNIL[0].value) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% dos leads`,
      },
      series: [
        {
          type: "funnel",
          left: "8%",
          right: "8%",
          top: 8,
          bottom: 8,
          minSize: "30%",
          gap: 4,
          sort: "descending",
          label: {
            position: "inside",
            formatter: (p: { name: string; value: number }) =>
              `${p.name}  ${p.value.toLocaleString("pt-BR")}`,
            fontSize: 12,
            color: "white",
            textBorderWidth: 0,
          },
          data: FUNIL.map((f, i) => ({
            ...f,
            itemStyle: {
              color: lyxToken(tons[i] ?? "--nav-leads"),
              borderRadius: 6,
            },
          })),
        },
      ],
    };
  }, []);
  return (
    <LyxEChart
      label="Funil de conversão do período"
      option={option}
      height={height}
    />
  );
}

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const HORAS = Array.from({ length: 13 }, (_, i) => `${8 + i}h`);

/** Mapa de calor de atendimentos por dia da semana e hora. */
export function CalorChart({ height = 280 }: { height?: number }) {
  const option = useCallback((): EChartsCoreOption => {
    const data: [number, number, number][] = [];
    DIAS.forEach((_, d) => {
      HORAS.forEach((_, h) => {
        const pico =
          Math.exp(-((h - 3) ** 2) / 6) + Math.exp(-((h - 10) ** 2) / 5) * 0.9;
        const fds = d >= 5 ? 0.45 : 1;
        data.push([
          h,
          d,
          Math.round((4 + 26 * pico) * fds + ((d * 7 + h * 3) % 5)),
        ]);
      });
    });
    return {
      tooltip: {
        formatter: (p: { value: [number, number, number] }) =>
          `${DIAS[p.value[1]]}, ${HORAS[p.value[0]]}<br/><b>${p.value[2]}</b> atendimentos`,
      },
      grid: { left: 40, right: 8, top: 8, bottom: 56 },
      xAxis: { type: "category", data: HORAS, splitArea: { show: false } },
      yAxis: { type: "category", data: DIAS, splitArea: { show: false } },
      visualMap: {
        min: 0,
        max: 32,
        orient: "horizontal",
        left: "center",
        bottom: 0,
        itemWidth: 10,
        itemHeight: 140,
        calculable: false,
        text: ["mais", "menos"],
        textStyle: { fontSize: 11 },
        inRange: {
          color: [
            lyxToken("--muted"),
            lyxToken("--nav-pre-cadastros", 0.55),
            lyxToken("--nav-pre-cadastros"),
          ],
        },
      },
      series: [
        {
          type: "heatmap",
          data,
          itemStyle: {
            borderRadius: 4,
            borderColor: lyxToken("--card"),
            borderWidth: 2,
          },
          emphasis: { itemStyle: { shadowBlur: 0 } },
        },
      ],
    };
  }, []);
  return (
    <LyxEChart
      label="Atendimentos por dia da semana e hora"
      option={option}
      height={height}
    />
  );
}

/** Sankey: de onde vêm os leads e onde terminam. */
export function SankeyChart({ height = 320 }: { height?: number }) {
  const option = useCallback((): EChartsCoreOption => {
    const nodes = [
      { name: "Google", c: "--nav-leads" },
      { name: "Instagram", c: "--nav-componentes" },
      { name: "Indicação", c: "--nav-comissoes" },
      { name: "Site", c: "--nav-inicio" },
      { name: "Atendidos", c: "--nav-disponibilidade" },
      { name: "Descartados", c: "--muted-foreground" },
      { name: "Visitaram", c: "--nav-pre-cadastros" },
      { name: "Reservaram", c: "--nav-reservas" },
      { name: "Compraram", c: "--nav-comissoes" },
    ];
    const links = [
      ["Google", "Atendidos", 380],
      ["Google", "Descartados", 88],
      ["Instagram", "Atendidos", 300],
      ["Instagram", "Descartados", 91],
      ["Indicação", "Atendidos", 170],
      ["Indicação", "Descartados", 19],
      ["Site", "Atendidos", 104],
      ["Site", "Descartados", 28],
      ["Atendidos", "Visitaram", 395],
      ["Atendidos", "Descartados", 559],
      ["Visitaram", "Reservaram", 78],
      ["Reservaram", "Compraram", 17],
    ] as const;
    return {
      tooltip: { trigger: "item" },
      series: [
        {
          type: "sankey",
          left: 8,
          right: 90,
          top: 8,
          bottom: 8,
          nodeWidth: 10,
          nodeGap: 12,
          emphasis: { focus: "adjacency" },
          data: nodes.map((n) => ({
            name: n.name,
            itemStyle: { color: lyxToken(n.c), borderRadius: 3 },
          })),
          links: links.map(([source, target, value]) => ({
            source,
            target,
            value,
          })),
        },
      ],
    };
  }, []);
  return (
    <LyxEChart
      label="Caminho dos leads: origem, atendimento e resultado"
      option={option}
      height={height}
    />
  );
}

/** Um ano de leads por dia, com zoom e arraste. */
export function AnoChart({ height = 280 }: { height?: number }) {
  const option = useCallback((): EChartsCoreOption => {
    const start = new Date(2025, 10, 1).getTime();
    const data = Array.from({ length: 365 }, (_, i) => {
      const v =
        42 +
        14 * Math.sin(i / 18) +
        9 * Math.sin(i / 5) +
        i * 0.04 +
        ((i * 37) % 11);
      return [start + i * 86400000, Math.round(v)];
    });
    return {
      tooltip: { trigger: "axis" },
      grid: { left: 36, right: 12, top: 12, bottom: 64 },
      xAxis: { type: "time" },
      yAxis: { type: "value" },
      dataZoom: [
        { type: "inside", start: 70, end: 100 },
        {
          type: "slider",
          start: 70,
          end: 100,
          height: 22,
          bottom: 8,
          borderColor: "transparent",
          backgroundColor: lyxToken("--muted"),
          fillerColor: lyxToken("--nav-leads", 0.15),
          dataBackground: {
            lineStyle: { color: lyxToken("--nav-leads", 0.5) },
            areaStyle: { color: lyxToken("--nav-leads", 0.12) },
          },
          handleStyle: {
            color: lyxToken("--card"),
            borderColor: lyxToken("--nav-leads"),
          },
          textStyle: { fontSize: 11 },
        },
      ],
      series: [
        {
          type: "line",
          name: "Leads",
          data,
          areaStyle: { color: lyxToken("--nav-leads", 0.12) },
        },
      ],
    };
  }, []);
  return (
    <LyxEChart
      label="Leads por dia no último ano, com zoom"
      option={option}
      height={height}
    />
  );
}

export function Avancados() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard title="Funil de conversão" sub="Do lead recebido à venda">
        <FunilChart />
      </ChartCard>
      <ChartCard
        title="Horários de atendimento"
        sub="Mapa de calor por dia e hora"
      >
        <CalorChart height={300} />
      </ChartCard>
      <ChartCard
        title="Caminho dos leads"
        sub="Sankey: origem, atendimento e resultado"
      >
        <SankeyChart />
      </ChartCard>
      <ChartCard
        title="Leads no último ano"
        sub="Arraste ou role para dar zoom"
      >
        <AnoChart height={320} />
      </ChartCard>
    </div>
  );
}
