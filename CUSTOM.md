# lume-custom: o layout LYX por cima do lume

<!-- Adição do lume-custom. Leia depois do FRONTEND.md. -->

Este repositório é o lume (cópia fiel do Foglamp, ver `README.md`) com o layout do CRM Comercial LYX por cima. Tudo do `FRONTEND.md` continua valendo, **exceto** os pontos abaixo, que foram decididos pelo time e vencem a regra original. Fora desta lista, siga o `FRONTEND.md`; se surgir um conflito novo, levante antes de contornar e, se o time aprovar, acrescente aqui.

Referência visual exata: [docs/referencia/crm-prototipo.html](docs/referencia/crm-prototipo.html) (abra no navegador). Copie medidas e comportamento, não o código: o protótipo é HTML e JS soltos, só um mock.

## Como usar

```bash
npx shadcn@latest init RodrigoSilva1854/lume-custom/base#v0.1.0 -y
npx shadcn@latest add RodrigoSilva1854/lume-custom/lyx-shell#v0.1.1 RodrigoSilva1854/lume-custom/view-toggle#v0.1.1 RodrigoSilva1854/lume-custom/kanban-column#v0.1.1
```

```tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { LyxShell } from "@/components/lyx-shell/lyx-shell";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <LyxShell
      pathname={pathname}
      brandMark={<Logo />}
      brandName="CRM Comercial"
      user={{ name: "Rafael Souza", email: "rafael@lyx.com.br" }}
      navigate={(href) => router.push(href)}
      onAccountSelect={(id) => console.log(id)}
    >
      {children}
    </LyxShell>
  );
}
```

As seções e rotas vêm de `lib/sections.ts`; edite ali para mudar o menu. A demo completa roda em `/crm` no site deste repositório (`bun run dev`).

| Item | O que traz |
|---|---|
| `lyx-shell` | trilho, menu expandido, submenu flutuante, botão Layout, menu horizontal, modo foco, chip do usuário, migalha, busca de telas, gaveta no celular, subida ao topo |
| `sections` | as seções do CRM (rótulo, ícones, cor, rotas) |
| `view-toggle` | alternador Lista, Quadro, Compacto |
| `kanban-column` | KanbanBoard, KanbanColumn, KanbanCard, KanbanEmpty |

## Tokens novos

Todos em `registry/base-vega/styles/globals.css`, com versão dark e utilitário Tailwind (`bg-app-canvas`, `text-nav-leads`, `bg-nav-leads/12`...):

| Token | Uso |
|---|---|
| `--app-canvas` | fundo atrás do cartão da aplicação |
| `--rail-item`, `--rail-item-hover` | círculo dos itens do trilho |
| `--nav-active` | pílula do item ativo no menu expandido |
| `--kanban-col` | fundo das colunas do kanban |
| `--nav-<seção>` | cor de cada seção (dado, por isso cromática) |
| `--avatar-from`, `--avatar-to`, `--presence` | avatar do usuário e bolinha de online |
| `--stat-grad-1..3` | degradê dos números grandes no dark (no light é a cor do texto) |

As seções (rótulo, ícones outline e filled, cor, rotas, submenu) ficam só em `registry/base-vega/lib/sections.ts` (item `sections`). Menu, gaveta do mobile e PageHeader leem dali; nenhuma tela escolhe a própria cor.

| Seção | Token | Cor |
|---|---|---|
| Início | `--nav-inicio` | azul céu |
| Início 2 | `--nav-inicio-2` | índigo |
| Leads | `--nav-leads` | azul |
| Pré-cadastros | `--nav-pre-cadastros` | violeta |
| Disponibilidade | `--nav-disponibilidade` | âmbar |
| Reservas | `--nav-reservas` | laranja |
| Funis | `--nav-funis` | fúcsia |
| Comissões | `--nav-comissoes` | esmeralda |
| Componentes | `--nav-componentes` | rosa |
| Gráficos | `--nav-graficos` | amarelo |

## Exceções intencionais

Cada item cita a regra do `FRONTEND.md` que ele substitui.

### Shell e menu

1. **Trilho de ícones como padrão** (substitui "Sidebar variant inset, 14rem"). O menu nasce recolhido, com 88px: itens em círculo de 44px (`bg-rail-item`, hover `bg-rail-item-hover`), espaço de 12px. Os círculos encolhem com a altura da tela, até 28px, para o trilho nunca ter barra de rolagem.
2. **Item ativo no trilho com a cor da seção** (substitui "ativo só com fundo e ícone filled"). Anel de 1.5px na cor da seção, fundo da mesma cor a 12% e ícone filled colorido (`tone.ring`, `tone.soft`, `tone.text` de `sections.ts`). O indicador desliza entre os itens com o `EASE` de `lib/motion.ts`.
3. **Submenu flutuante no trilho.** Passar o mouse num grupo com submenu abre um painel `bg-popover` ao lado (raio 16, `shadow-(--custom-shadow)`), com o nome do grupo e os itens. Item sem submenu mostra só o Tooltip, com o mesmo raio do painel.
4. **Menu expandido de 248px** (substitui 14rem). Linhas em pílula de 40px; ativo com `bg-nav-active`, texto `text-foreground` e só o ícone na cor da seção.
5. **App dentro de um cartão** sobre `bg-app-canvas`: margem 12px e raio 28px (`rounded-[28px] corner-round`), o menu fica dentro do cartão. É o "inset" do Foglamp com o menu do lado de dentro.
6. **Rodapé do menu**: um único botão "Layout" que abre um DropdownMenu com Expandir ou Recolher menu, Menu na horizontal e Modo foco. Abaixo, o seletor Claro e Escuro e o chip do usuário.
7. **Menu horizontal opcional.** Mesmo conteúdo no cabeçalho, com submenus ao passar o mouse e a busca no cabeçalho. Quando os itens não cabem, a busca vira só a lupa (`Button size="icon-sm"`) e abre por cima ao clicar.
8. **Modo foco.** Esconde menus, migalha e busca; mostra uma pílula flutuante "Sair do modo foco" com `Kbd` Esc.
9. **Mobile em 860px** (substitui `md`, 768px). Abaixo disso, a gaveta (Sheet) tem o mesmo visual do menu expandido, e tocar num grupo abre os subitens em vez de navegar.

### Cabeçalho e navegação

10. **Migalha de pão com ícones** (substitui "nunca o primitivo Breadcrumb"). Acima do título, `text-xs text-muted-foreground/70`, com o ícone de cada nível. Na mesma linha, à direita, a busca de telas (`Command`, atalho Ctrl ou Cmd K), sem mostrar o atalho escrito.
11. **Ao trocar de página com a tela rolada**, sobe ao topo animado com `EASE` (rápido e depois suave), em 380 a 700ms conforme a distância. Rolagem do usuário cancela.

### Usuário

12. **Avatar em degradê** (`bg-linear-135 from-avatar-from to-avatar-to`, texto branco) com bolinha `bg-presence`. O menu da conta é o mesmo no rodapé e no cabeçalho: Minha conta, Assinatura (Badge "Sem assinatura"), Equipe e permissões, Notificações, Configurações e Sair (`variant="destructive"`).

### Dados

13. **Ids e códigos em Inter** (substitui "font-mono para ids"). `text-xs text-muted-foreground tabular-nums`, sem Geist Mono. Vale para código de lead, pré-cadastro e reserva, número de unidade e score.
14. **Nome do cliente na tabela em `font-normal`**, o mesmo peso dos valores.
15. **Kanban**: coluna `bg-kanban-col`, sem borda e sem sombra; cartões `bg-card shadow-(--custom-shadow)`; a cor fica só na bolinha da etapa.
16. **Alternador de visualização** (Lista, Quadro, Compacto): ativo com anel inset de 1.5px na cor do texto, ícone na cor do texto e fundo `bg-foreground/7`; cantos arredondados só nas pontas do grupo.
17. **Minigráficos no Início**: `card-sparkline` nos StatCard, desligados por padrão, com um Switch "Minigráficos" ao lado do subtítulo; a escolha fica salva por usuário.
18. **Números grandes no dark em degradê** (`--stat-grad-1` a `3`, `bg-clip-text`).

### Tema e superfícies

19. **Tema padrão claro** (substitui o padrão `dark`).
20. **Menus e tooltips flutuantes** podem usar sombra um pouco mais marcada que `--custom-shadow` para descolar do cartão branco. Dialog continua separado pelo backdrop, como no `FRONTEND.md`.

21. **Dark mais claro e azulado** (substitui o dark em cinza puro do Foglamp). No `.dark`, o lume-custom redefine `--background`, `--card`, `--popover`, `--muted`, `--accent`, `--foreground`, `--muted-foreground`, `--border` e `--sidebar` com chroma baixo no matiz 265: página `oklch(0.2)`, cartão `oklch(0.256)`, menu flutuante `oklch(0.288)`, canvas `oklch(0.155)`. É o dark do protótipo.

## Para agentes

Leia nesta ordem: `FRONTEND.md`, depois este arquivo. Quando os dois falarem do mesmo assunto, vale este. Use `sections.ts` para qualquer cor ou ícone de seção e os tokens acima para qualquer cor nova do layout; hex continua proibido fora de `globals.css`.
