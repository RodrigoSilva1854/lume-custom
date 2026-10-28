# lume-custom

O design system do CRM Comercial LYX. É o [lume](https://github.com/joaodadas/lume)
(que copia o [Foglamp](https://github.com/foglamp-labs/foglamp)) com o nosso layout
por cima: tokens, primitivos sobre Base UI, blocos, gráficos, guia em pt-BR e uma
skill de agente, distribuídos como registry do shadcn.

- Regras gerais: [FRONTEND.md](FRONTEND.md) (as do lume, intactas).
- O que muda no layout LYX: [CUSTOM.md](CUSTOM.md). Onde os dois divergem, vale o CUSTOM.md.
- Demo ao vivo do layout: rota `/crm` do site (`bun run dev` e abra http://localhost:3000/crm).
- Protótipo de referência: [docs/referencia/crm-prototipo.html](docs/referencia/crm-prototipo.html) (abra no navegador).

Repositório público: os comandos `npx shadcn` abaixo funcionam sem token.

Site do lume original, para consultar os componentes: https://lume-ashmont.vercel.app

## Instalação em três comandos

```bash
# 1. base: components.json (style base-vega, ícones tabler), globals.css com os tokens, lib/utils.ts
npx shadcn@latest init RodrigoSilva1854/lume-custom/base#v0.1.3 -y

# 2. um kit (ou qualquer item): primitivos em components/ui, blocos em components, lib e hooks
npx shadcn@latest add RodrigoSilva1854/lume-custom/kit-shell#v0.1.3

# 3. a skill para Claude Code e Codex
npx skills add RodrigoSilva1854/lume-custom --skill lume-design-engineering
```

Nunca use `init -d`: o `-d` ignora o `base` e instala o style padrão por cima.
Em projeto Next, instale também `link-next` depois dos blocos
(`npx shadcn@latest add RodrigoSilva1854/lume-custom/link-next#v0.1.3`), que troca o `Link`
da indireção por `next/link`. Em Vite, o `Link` padrão (um `<a>`) já serve.

### Alias `@lume`

Com o alias em `components.json` o comando fica mais curto e aponta para o JSON
buildado que o site serve:

```json
{
  "registries": {
    "@lume": "https://lume-ashmont.vercel.app/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @lume/button @lume/stat-card
```

Para fixar a versão sem depender do site, aponte para a tag no GitHub:
`"@lume": "https://raw.githubusercontent.com/RodrigoSilva1854/lume-custom/v0.1.3/public/r/{name}.json"`.

## O que vem em cada kit

| Kit | Itens |
|---|---|
| `kit-shell` | sidebar, app-shell, nav, page-header, stat-card, stat-grid, empty-state, theme-provider, theme-switcher, link |
| `kit-tabela` | table, data-table, table-skeletons, scroll-fade, format, hooks |
| `kit-formulario` | input, input-group, field, label, select, native-select, checkbox, switch, radio-group, textarea, kbd, calendar |
| `kit-feedback` | skeleton, empty, spinner, loader, sonner, alert, notice, dialog, alert-dialog, tooltip, popover, dropdown-menu |
| `kit-dados` | badge, context-chip, span-type, card-sparkline, pill-meter, number-ticker, copy-button, code-block |
| `kit-graficos` | evilcharts, area-chart, bar-chart, line-chart, donut-chart, trend-charts, range-picker |

Qualquer item também instala sozinho: `npx shadcn@latest add RodrigoSilva1854/lume-custom/<item>#v0.1.3`.
A lista completa está em `registry.json` ou em `npx shadcn@latest list RodrigoSilva1854/lume-custom#v0.1.3`.
O item `guia` instala o guia inteiro em `docs/lume/` do seu projeto.

## Guia

- [FRONTEND.md](FRONTEND.md): as regras curtas (Always e Never), fonte da skill.
- [docs/guia](docs/guia): o guia longo, com os valores exatos, as strings de classe e os porquês.
- [docs/conceitos](docs/conceitos): os conceitos do craft, reescritos em pt-BR.
- [docs/referencias.md](docs/referencias.md): curadoria de referências com os critérios declarados.
- [docs/adocao](docs/adocao): Next novo, Vite, migração de um front com Radix e Lucide, camada de marca por cima da base.
- [CONTRIBUTING.md](CONTRIBUTING.md): como rodar, adicionar item, sincronizar com o Foglamp e lançar.
- [CHANGELOG.md](CHANGELOG.md): o que mudou em cada versão e como migrar.

## Créditos

- [Foglamp](https://github.com/foglamp-labs/foglamp), de Gustavo Fior (foglamp-labs), Apache-2.0: os tokens, os primitivos, os blocos e as regras. O lume é uma cópia do HEAD `2bc3bb5` com imports reescritos, correções registradas no `CHANGELOG.md` e cabeçalho de atribuição em cada arquivo.
- [craft](https://github.com/gustavofior/craft), do mesmo autor, MIT: os conceitos de `docs/conceitos`.
- [Evil Charts](https://evilcharts.com), de Gurbinder, MIT: os gráficos em `components/evilcharts`.
- shadcn/ui, Base UI, Tabler Icons, Inter, Geist Mono, Host Grotesk e as demais dependências estão em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Licença

Apache-2.0. Veja [LICENSE](LICENSE) e [NOTICE](NOTICE).
