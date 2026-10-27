// Layout de /crm: a casca do CRM LYX fica aqui, fora das páginas, para o menu
// continuar montado enquanto as telas trocam.
import { Suspense } from "react";

import { CrmShell } from "@/components/crm/crm-demo";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-svh bg-app-canvas" />}>
      <CrmShell>{children}</CrmShell>
    </Suspense>
  );
}
