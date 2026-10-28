// lume-custom: os gráficos do dia a dia no estilo do shadcn/ui Charts (Recharts
// + ChartContainer do ui/chart), já com as cores de seção do CRM LYX: área com
// degradê, barras arredondadas, linhas suaves e rosca. Grade tracejada, sem
// linha de eixo, tooltip e legenda do ui/chart (CUSTOM.md, item 24).
"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/registry/base-vega/lib/utils";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/base-vega/ui/chart";

/** Uma série: chave no dado, rótulo e cor (um token, como "var(--nav-leads)"). */
export type LyxSeries = { key: string; label: string; color: string };

type CartesianProps = {
  data: Record<string, string | number>[];
  xKey: string;
  series: LyxSeries[];
  height?: number;
  /** Empilha as séries (área e barra). */
  stacked?: boolean;
  legend?: boolean;
  className?: string;
};

function toConfig(series: LyxSeries[]): ChartConfig {
  return Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );
}

const GRID = <CartesianGrid vertical={false} strokeDasharray="4 4" />;

function axes(xKey: string) {
  return (
    <>
      <XAxis
        dataKey={xKey}
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        minTickGap={24}
      />
      <YAxis tickLine={false} axisLine={false} tickMargin={4} width={40} />
    </>
  );
}

/** Área com degradê vertical da cor da série até transparente. */
export function LyxAreaChart({
  data,
  xKey,
  series,
  height = 240,
  stacked,
  legend = true,
  className,
}: CartesianProps) {
  const id = useId().replace(/:/g, "");
  return (
    <ChartContainer
      config={toConfig(series)}
      className={cn("aspect-auto w-full", className)}
      style={{ height }}
    >
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          {series.map((s) => (
            <linearGradient
              key={s.key}
              id={`${id}-${s.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={`var(--color-${s.key})`}
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${s.key})`}
                stopOpacity={0.02}
              />
            </linearGradient>
          ))}
        </defs>
        {GRID}
        {axes(xKey)}
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            type="natural"
            fill={`url(#${id}-${s.key})`}
            stroke={`var(--color-${s.key})`}
            strokeWidth={2}
            stackId={stacked ? "a" : undefined}
          />
        ))}
        {legend && <ChartLegend content={<ChartLegendContent />} />}
      </AreaChart>
    </ChartContainer>
  );
}

/** Barras arredondadas no topo, lado a lado ou empilhadas. */
export function LyxBarChart({
  data,
  xKey,
  series,
  height = 240,
  stacked,
  legend = true,
  className,
}: CartesianProps) {
  return (
    <ChartContainer
      config={toConfig(series)}
      className={cn("aspect-auto w-full", className)}
      style={{ height }}
    >
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }} barGap={4}>
        {GRID}
        {axes(xKey)}
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            fill={`var(--color-${s.key})`}
            stackId={stacked ? "a" : undefined}
            radius={
              stacked
                ? i === series.length - 1
                  ? [6, 6, 0, 0]
                  : [0, 0, 0, 0]
                : [6, 6, 2, 2]
            }
            maxBarSize={28}
          />
        ))}
        {legend && <ChartLegend content={<ChartLegendContent />} />}
      </BarChart>
    </ChartContainer>
  );
}

/** Linhas suaves, sem pontos (o ponto aparece no hover). */
export function LyxLineChart({
  data,
  xKey,
  series,
  height = 240,
  legend = true,
  className,
}: CartesianProps) {
  return (
    <ChartContainer
      config={toConfig(series)}
      className={cn("aspect-auto w-full", className)}
      style={{ height }}
    >
      <LineChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        {GRID}
        {axes(xKey)}
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Line
            key={s.key}
            dataKey={s.key}
            type="natural"
            stroke={`var(--color-${s.key})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
        {legend && <ChartLegend content={<ChartLegendContent />} />}
      </LineChart>
    </ChartContainer>
  );
}

/** Rosca com o total no meio. */
export function LyxDonutChart({
  data,
  total,
  totalLabel,
  height = 240,
  className,
}: {
  /** Uma fatia por item: chave, rótulo, valor e cor (token). */
  data: (LyxSeries & { value: number })[];
  total?: string;
  totalLabel?: string;
  height?: number;
  className?: string;
}) {
  const config = toConfig(data);
  return (
    <ChartContainer
      config={config}
      className={cn("aspect-auto w-full", className)}
      style={{ height }}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="key" />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="key"
          innerRadius="58%"
          outerRadius="85%"
          paddingAngle={2}
          cornerRadius={6}
          strokeWidth={0}
        >
          {data.map((d) => (
            <Cell key={d.key} fill={`var(--color-${d.key})`} />
          ))}
          {total && (
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                const { cx, cy } = viewBox as { cx: number; cy: number };
                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={cx}
                      y={cy - 6}
                      className="fill-foreground text-xl font-medium tabular-nums"
                    >
                      {total}
                    </tspan>
                    {totalLabel && (
                      <tspan
                        x={cx}
                        y={cy + 14}
                        className="fill-muted-foreground text-xs"
                      >
                        {totalLabel}
                      </tspan>
                    )}
                  </text>
                );
              }}
            />
          )}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="key" />} />
      </PieChart>
    </ChartContainer>
  );
}
