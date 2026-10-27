// Telas de exemplo do /crm; a casca (lyx-shell) mora em app/crm/layout.tsx. Cada rota das seções é estática (generateStaticParams);
// a leitura de params fica dentro do Suspense, como o Cache Components pede.
import type { Metadata } from "next";
import { Suspense } from "react";

import { CrmPage as CrmContent } from "@/components/crm/crm-demo";
import { SECTIONS } from "@/registry/base-vega/lib/sections";

type Params = { slug?: string[] };

export const metadata: Metadata = {
  title: "CRM LYX",
  description:
    "A casca do CRM Comercial LYX montada com o bloco lyx-shell do lume-custom.",
};

export function generateStaticParams(): Params[] {
  const paths = new Set<string>();
  for (const s of SECTIONS) for (const it of s.items) paths.add(it.href);
  return [...paths].map((href) => ({
    slug: href === "/" ? [] : href.slice(1).split("/"),
  }));
}

async function Crm({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return <CrmContent path={(slug ?? []).join("/")} />;
}

export default function CrmPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <Crm params={params} />
    </Suspense>
  );
}
