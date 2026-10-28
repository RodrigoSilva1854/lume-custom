// lume-custom: Apache ECharts com o tema LYX, para os gráficos pesados do CRM
// (funil, mapa de calor, sankey, séries longas com zoom). O tema sai dos
// tokens de globals.css (texto, grade, popover, cores de seção) e é refeito
// quando o tema claro ou escuro muda (CUSTOM.md, item 23).
"use client";

import {
  BarChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  PieChart,
  SankeyChart,
} from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import type { EChartsCoreOption } from "echarts/core";
import * as echarts from "echarts/core";
// O ECharts publica as traduções sem tipos.
// @ts-expect-error módulo sem declaração de tipos
import langPTbr from "echarts/i18n/langPT-br-obj.js";
import { SVGRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";

import { cn } from "@/registry/base-vega/lib/utils";

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  FunnelChart,
  HeatmapChart,
  SankeyChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
  SVGRenderer,
]);
// Datas, zoom e "restaurar" em português.
echarts.registerLocale("PT-br", langPTbr);

/** Ordem das cores das séries: as cores de seção, nunca cíclicas. */
export const LYX_SERIES_TOKENS = [
  "--nav-leads",
  "--nav-pre-cadastros",
  "--nav-reservas",
  "--nav-comissoes",
  "--nav-funis",
  "--nav-disponibilidade",
  "--nav-inicio",
  "--nav-componentes",
] as const;

// O ECharts não entende oklch(); pinta o token num pixel e lê o RGB final.
function resolver() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);
  const read = (cssColor: string) => {
    probe.style.color = cssColor;
    const computed = getComputedStyle(probe).color;
    if (!ctx) return computed;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = computed;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
  };
  return {
    token: (name: string, alpha?: number) =>
      read(
        alpha === undefined
          ? `var(${name})`
          : `color-mix(in oklab, var(${name}) ${alpha * 100}%, transparent)`,
      ),
    done: () => probe.remove(),
  };
}

/** Monta o tema LYX lendo os tokens do tema ativo. */
export function lyxEchartsTheme() {
  const r = resolver();
  const fg = r.token("--foreground");
  const muted = r.token("--muted-foreground");
  const line = r.token("--border");
  const popover = r.token("--popover");
  const font =
    getComputedStyle(document.body).fontFamily ||
    "Inter Variable, ui-sans-serif, system-ui, sans-serif";
  const color = LYX_SERIES_TOKENS.map((t) => r.token(t));
  r.done();

  const axis = {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: muted, fontSize: 11 },
    splitLine: { lineStyle: { color: line, type: [4, 4] } },
  };

  return {
    color,
    backgroundColor: "transparent",
    textStyle: { fontFamily: font, color: fg },
    categoryAxis: { ...axis, splitLine: { show: false } },
    valueAxis: axis,
    legend: {
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: muted, fontSize: 12 },
    },
    tooltip: {
      backgroundColor: popover,
      borderWidth: 0,
      padding: [8, 12],
      textStyle: { color: fg, fontSize: 12 },
      extraCssText:
        "border-radius:12px;box-shadow:0 0 0 0.5px rgba(0,0,0,.08),0 4px 12px -2px rgba(0,0,0,.12);",
    },
    bar: { itemStyle: { borderRadius: [5, 5, 2, 2] } },
    line: { symbol: "none", smooth: true, lineStyle: { width: 2 } },
    funnel: {
      itemStyle: { borderWidth: 0 },
      label: { color: "white", textBorderWidth: 0 },
    },
    sankey: {
      lineStyle: { color: "gradient", opacity: 0.25 },
      label: { color: fg, fontSize: 12 },
      itemStyle: { borderWidth: 0 },
    },
  };
}

/** Lê um token já resolvido para RGB, para usar dentro de uma option. */
export function lyxToken(name: string, alpha?: number) {
  const r = resolver();
  const v = r.token(name, alpha);
  r.done();
  return v;
}

/**
 * Um gráfico ECharts com o tema LYX. `option` é a option comum do ECharts
 * (sem cores: o tema dá). Recria o tema quando a classe `dark` do html muda e
 * redimensiona com o cartão.
 */
export function LyxEChart({
  option,
  height = 280,
  label,
  className,
}: {
  /** Recebe uma função para montar a option depois do tema (cores resolvidas). */
  option: EChartsCoreOption | (() => EChartsCoreOption);
  height?: number;
  /** Resumo para leitor de tela. */
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const optionRef = useRef(option);
  optionRef.current = option;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let chart: echarts.ECharts | undefined;
    const mount = () => {
      chart?.dispose();
      const name = `lyx-${Math.random().toString(36).slice(2)}`;
      echarts.registerTheme(name, lyxEchartsTheme());
      chart = echarts.init(el, name, { renderer: "svg", locale: "PT-br" });
      const o = optionRef.current;
      chart.setOption(typeof o === "function" ? o() : o);
    };
    mount();
    const ro = new ResizeObserver(() => chart?.resize());
    ro.observe(el);
    const mo = new MutationObserver(mount);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      ro.disconnect();
      mo.disconnect();
      chart?.dispose();
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chart = echarts.getInstanceByDom(el);
    if (chart)
      chart.setOption(typeof option === "function" ? option() : option, true);
  }, [option]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={cn("w-full", className)}
      style={{ height }}
    />
  );
}
