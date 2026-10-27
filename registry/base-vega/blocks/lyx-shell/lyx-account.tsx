// lume-custom: avatar do usuário (degradê + bolinha de online) e o menu da
// conta, o mesmo no rodapé do menu lateral e no cabeçalho (CUSTOM.md, item 12).
"use client";

import {
  type Icon,
  IconBell,
  IconLogout,
  IconSettings,
  IconSignature,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

import { cn } from "@/registry/base-vega/lib/utils";
import { Badge } from "@/registry/base-vega/ui/badge";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/registry/base-vega/ui/dropdown-menu";

export type LyxUser = {
  name: string;
  email?: string;
  /** Mostra a bolinha verde de online. */
  online?: boolean;
};

export type LyxAccountItem = {
  id: string;
  label: string;
  icon: Icon;
  /** Etiqueta à direita, como "Sem assinatura". */
  tag?: string;
  destructive?: boolean;
};

/** Itens padrão do menu da conta do CRM LYX. */
export const LYX_ACCOUNT_ITEMS: LyxAccountItem[] = [
  { id: "conta", label: "Minha conta", icon: IconUser },
  {
    id: "assinatura",
    label: "Assinatura",
    icon: IconSignature,
    tag: "Sem assinatura",
  },
  { id: "equipe", label: "Equipe e permissões", icon: IconUsers },
  { id: "notificacoes", label: "Notificações", icon: IconBell },
  { id: "configuracoes", label: "Configurações", icon: IconSettings },
  { id: "sair", label: "Sair", icon: IconLogout, destructive: true },
];

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** Avatar redondo em degradê com as iniciais e a bolinha de presença. */
export function LyxAvatar({
  user,
  className,
}: {
  user: LyxUser;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-8 shrink-0 place-items-center rounded-full bg-linear-135 from-avatar-from to-avatar-to text-xs font-medium tracking-wide text-white shadow-[inset_0_0_0_1px] shadow-white/20",
        className,
      )}
    >
      {initials(user.name)}
      {user.online !== false && (
        <span className="absolute -right-px -bottom-px size-2.5 rounded-full bg-presence ring-2 ring-background" />
      )}
    </span>
  );
}

/** Conteúdo do menu da conta: cabeçalho com avatar, itens e Sair. */
export function LyxAccountMenuItems({
  user,
  items = LYX_ACCOUNT_ITEMS,
  onSelect,
}: {
  user: LyxUser;
  items?: LyxAccountItem[];
  onSelect?: (id: string) => void;
}) {
  const main = items.filter((i) => !i.destructive);
  const danger = items.filter((i) => i.destructive);
  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <LyxAvatar user={{ ...user, online: false }} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{user.name}</span>
          {user.email && (
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          )}
        </div>
      </div>
      <DropdownMenuSeparator />
      {main.map((item) => (
        <DropdownMenuItem key={item.id} onClick={() => onSelect?.(item.id)}>
          <item.icon className="text-muted-foreground" />
          <span className="flex-1">{item.label}</span>
          {item.tag && (
            <Badge variant="outline" className="font-normal">
              {item.tag}
            </Badge>
          )}
        </DropdownMenuItem>
      ))}
      {danger.length > 0 && <DropdownMenuSeparator />}
      {danger.map((item) => (
        <DropdownMenuItem
          key={item.id}
          variant="destructive"
          onClick={() => onSelect?.(item.id)}
        >
          <item.icon />
          {item.label}
        </DropdownMenuItem>
      ))}
    </>
  );
}
