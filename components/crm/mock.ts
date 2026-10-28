// Dados fictícios da demo /crm (nomes, telefones, valores e empreendimentos
// inventados). Arquivo do site, não entra na registry.

import type {
  Floor,
  UnitStatus,
} from "@/registry/base-vega/components/unit-map";

export type Tone =
  | "secondary"
  | "amber"
  | "blue"
  | "violet"
  | "emerald"
  | "red"
  | "orange"
  | "sky";

/** Classe da bolinha de cada tom (a mesma família de cor do Badge). */
export const DOT: Record<Tone, string> = {
  secondary: "bg-neutral-400",
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  sky: "bg-sky-500",
};

export type Stage = { key: string; label: string; tone: Tone };

export type Row = {
  code: number;
  name: string;
  phone: string;
  stage: string;
  cols: Record<string, string>;
  /** Próximo passo ou tempo, no rodapé do cartão do kanban. */
  foot: string;
  score?: number;
};

const NOMES = [
  "Marina Albuquerque",
  "Otávio Brandão",
  "Helena Vasques",
  "Caio Figueiredo",
  "Lívia Monteiro",
  "Rafael Antunes",
  "Júlia Nogueira",
  "Vicente Amaral",
  "Bianca Teles",
  "Gustavo Peixoto",
  "Isadora Rangel",
  "Leonardo Farias",
  "Priscila Antunes",
  "Thiago Lacerda",
  "Camila Bittencourt",
  "Fábio Queiroz",
];

const CORRETORES = [
  "Dercy Ramos",
  "Nicolas Prado",
  "Samara Leite",
  "Anna Rezende",
  "Jhon Ferraz",
  "Neres Machado",
];

const EMPREENDIMENTOS = [
  "Atlanta Condomínio Clube",
  "Madison II Condomínio Clube",
  "Blue Lake Fase II",
  "Kentucky Fase III",
  "Jersey City Fase II",
  "High Point Residencial",
];

const ORIGENS = [
  "Google",
  "Instagram",
  "Facebook",
  "Indicação",
  "Site",
  "Feirão",
];

const pick = <T>(list: readonly T[], i: number) => list[i % list.length] as T;
const phone = (i: number) =>
  `(${i % 3 === 0 ? 41 : 51}) 9${String(9000 + i * 37).padStart(4, "0")}-${String(1000 + i * 113).slice(-4)}`;
export const money = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

/* ------------------------------------------------------------------ leads */

export const LEAD_STAGES: Stage[] = [
  { key: "aguardando", label: "Aguardando atendimento", tone: "secondary" },
  { key: "atendimento", label: "Em atendimento", tone: "amber" },
  { key: "visita", label: "1ª visita", tone: "blue" },
  { key: "reserva", label: "Com reserva", tone: "violet" },
  { key: "venda", label: "Venda realizada", tone: "emerald" },
  { key: "descartado", label: "Descartado", tone: "red" },
];

const PROXIMOS = [
  "Ligar em 3 dias",
  "Sem tarefa",
  "Visita em 4 horas",
  "Enviar proposta",
  "Enviar contrato amanhã",
  "Retornar WhatsApp",
];

export const LEADS: Row[] = NOMES.slice(0, 14).map((name, i) => {
  const stage = pick(
    [
      "atendimento",
      "atendimento",
      "visita",
      "aguardando",
      "reserva",
      "aguardando",
      "atendimento",
      "visita",
      "venda",
      "descartado",
      "atendimento",
      "visita",
      "aguardando",
      "reserva",
    ],
    i,
  );
  return {
    code: 774301 + i * 37,
    name,
    phone: phone(i),
    stage,
    score: [92, 78, 64, 41, 88, 55, 71, 83, 96, 22, 67, 74, 38, 90][i],
    foot: stage === "aguardando" ? `Há ${i + 1} horas` : pick(PROXIMOS, i),
    cols: {
      origem: pick(ORIGENS, i),
      empreendimento:
        stage === "aguardando" && i % 2
          ? "Sem empreendimento"
          : pick(EMPREENDIMENTOS, i),
      responsavel:
        stage === "aguardando" ? "Sem corretor" : pick(CORRETORES, i),
    },
  };
});

/* ---------------------------------------------------------- pré-cadastros */

export const PRE_STAGES: Stage[] = [
  { key: "nova", label: "Nova avaliação", tone: "blue" },
  { key: "correspondente", label: "Análise do correspondente", tone: "amber" },
  { key: "ajustes", label: "Ajustes", tone: "violet" },
  { key: "agencia", label: "Análise da agência", tone: "secondary" },
  { key: "aprovado", label: "Aprovado", tone: "emerald" },
  { key: "reprovado", label: "Reprovado", tone: "red" },
];

const IMOBILIARIAS = [
  "Varesqui",
  "Priorize",
  "Casa Nova",
  "Persi",
  "Lar Ideal",
];

export const PRE_CADASTROS: Row[] = NOMES.slice(2, 14).map((name, i) => {
  const stage = pick(
    [
      "nova",
      "nova",
      "correspondente",
      "correspondente",
      "ajustes",
      "agencia",
      "aprovado",
      "nova",
      "correspondente",
      "ajustes",
      "aprovado",
      "reprovado",
    ],
    i,
  );
  const valor = 210000 + ((i * 7919) % 50) * 1000;
  return {
    code: 127580 - i * 3,
    name,
    phone: phone(i + 20),
    stage,
    foot: `Há ${(i % 5) + 1} dias`,
    cols: {
      empreendimento: pick(EMPREENDIMENTOS, i + 2),
      valor: money(valor),
      imobiliaria: pick(IMOBILIARIAS, i),
    },
  };
});

/* ---------------------------------------------------------------- reservas */

export const RES_STAGES: Stage[] = [
  { key: "nova", label: "Nova reserva", tone: "blue" },
  { key: "contrato", label: "Contrato gerado", tone: "secondary" },
  { key: "analise", label: "Análise do contrato", tone: "amber" },
  { key: "assinada", label: "Assinada", tone: "emerald" },
  { key: "cancelada", label: "Cancelada", tone: "red" },
];

export const RESERVAS: Row[] = NOMES.slice(4, 15).map((name, i) => {
  const stage = pick(
    [
      "nova",
      "contrato",
      "contrato",
      "analise",
      "analise",
      "assinada",
      "nova",
      "assinada",
      "analise",
      "cancelada",
      "contrato",
    ],
    i,
  );
  return {
    code: 24103 + i * 2,
    name,
    phone: phone(i + 40),
    stage,
    foot: `Bloco ${(i % 5) + 1} · Ap ${(i % 4) + 1}0${(i % 4) + 1}`,
    cols: {
      unidade: pick(EMPREENDIMENTOS, i + 4),
      valor: i === 0 ? "Sem valor" : money(228000 + i * 2315),
      responsavel: pick(CORRETORES, i + 3),
      area: i % 3 === 0 ? "CRI" : "COM",
    },
  };
});

/* ------------------------------------------------------------ distribuição */

export type Dist = {
  name: string;
  team: string;
  active: number;
  total: number;
};

export const DIST: Dist[] = [
  { name: "Dercy Ramos", team: "Equipe Reis", active: 18, total: 24 },
  { name: "Nicolas Prado", team: "Equipe Reis", active: 15, total: 24 },
  { name: "Samara Leite", team: "Equipe Sul", active: 12, total: 24 },
  { name: "Anna Rezende", team: "Equipe Sul", active: 9, total: 24 },
  { name: "Jhon Ferraz", team: "Imobiliária Varesqui", active: 7, total: 24 },
  { name: "Neres Machado", team: "Imobiliária Persi", active: 4, total: 24 },
];

/* --------------------------------------------------------- disponibilidade */

export const BLOCOS = ["Bloco 1", "Bloco 2", "Bloco 3", "Bloco 4"];

export const EMPREENDIMENTOS_DISP = [
  "Atlanta Condomínio Clube · Porto Alegre/RS",
  "Blue Lake Fase II · Porto Alegre/RS",
  "Hudson Condomínio Residencial · Curitiba/PR",
  "Kentucky Fase III · Curitiba/PR",
];

export const ULTIMOS_ACESSOS = [
  "Atlanta Condomínio Clube",
  "Blue Lake Fase II",
  "Hudson Condomínio Residencial",
];

/** Detalhe de exemplo de uma unidade (área, vagas e valor). */
export function unitInfo(numero: string) {
  const n = Number(numero);
  const area = 52 + (n % 7) * 3;
  return {
    area: `${area} m²`,
    dormitorios: area > 60 ? 3 : 2,
    vagas: area > 60 ? 2 : 1,
    valor: money(210000 + area * 2900),
  };
}

export function units(bloco: number): Floor[] {
  return [5, 4, 3, 2, 1].map((andar) => ({
    andar,
    units: [1, 2, 3, 4].map((n) => {
      const k = (bloco * 31 + andar * 7 + n * 13) % 10;
      const status: UnitStatus =
        k < 3
          ? "disponivel"
          : k < 5
            ? "reservada"
            : k < 9
              ? "vendida"
              : "bloqueada";
      return { numero: `${andar}0${n}`, status };
    }),
  }));
}

/* --------------------------------------------------------------- comissões */

export const COMISSOES = [
  {
    empresa: "Varesqui Imóveis",
    periodo: "Out/2026",
    situacao: "Paga",
    tone: "emerald" as Tone,
    valor: 48250,
  },
  {
    empresa: "Priorize Negócios",
    periodo: "Out/2026",
    situacao: "A pagar",
    tone: "amber" as Tone,
    valor: 31900,
  },
  {
    empresa: "Casa Nova",
    periodo: "Set/2026",
    situacao: "Paga",
    tone: "emerald" as Tone,
    valor: 27480,
  },
  {
    empresa: "Persi Imobiliária",
    periodo: "Set/2026",
    situacao: "Em análise",
    tone: "blue" as Tone,
    valor: 19760,
  },
  {
    empresa: "Lar Ideal",
    periodo: "Ago/2026",
    situacao: "Estornada",
    tone: "red" as Tone,
    valor: 8400,
  },
];

/* ---------------------------------------------------------------- gráficos */

export const LEADS_POR_DIA = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 8, 28 + i);
  return {
    dia: `${d.getDate()}/${d.getMonth() + 1}`,
    leads: Math.round(
      45 + 18 * Math.sin(i / 3) + (i % 7) * 2 + (i > 20 ? 8 : 0),
    ),
    visitas: Math.round(12 + 6 * Math.sin(i / 4 + 1) + (i % 5)),
  };
});

export const VENDAS_POR_MES = ["Mai", "Jun", "Jul", "Ago", "Set", "Out"].map(
  (mes, i) => ({
    mes,
    vendas: [9, 12, 11, 14, 13, 17][i],
    reservas: [41, 48, 52, 60, 66, 78][i],
  }),
);

export const ORIGEM = [
  { nome: "Google", qtd: 468 },
  { nome: "Instagram", qtd: 391 },
  { nome: "Facebook", qtd: 247 },
  { nome: "Indicação", qtd: 189 },
  { nome: "Site", qtd: 132 },
  { nome: "Feirão", qtd: 82 },
];
