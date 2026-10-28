// lume-custom: estado do layout LYX (menu lateral ou horizontal, trilho
// recolhido ou expandido, modo foco), guardado no navegador por usuário.
"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

// No cliente lê antes da pintura (sem piscar o menu ao recarregar); no
// servidor useLayoutEffect avisa, então cai no useEffect.
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export type LyxNav = "side" | "top";

export type LyxLayout = {
  nav: LyxNav;
  /** Menu lateral recolhido em trilho de ícones (padrão). */
  rail: boolean;
  /** Modo foco: sem menus, migalha e busca. Não é salvo. */
  focus: boolean;
};

const KEY_NAV = "lyx-nav";
const KEY_RAIL = "lyx-rail";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Janela privada ou storage bloqueado: o layout só não fica salvo.
  }
}

/**
 * Nasce no padrão (menu na horizontal; se trocar para o lateral, ele vem
 * recolhido) para o HTML do servidor e o primeiro render do cliente
 * coincidirem; a escolha salva entra antes da primeira pintura, então o menu
 * não pisca.
 */
export function useLyxLayout(defaultNav: LyxNav = "top") {
  const [layout, setLayout] = useState<LyxLayout>({
    nav: defaultNav,
    rail: true,
    focus: false,
  });

  useIsoLayoutEffect(() => {
    const saved = read(KEY_NAV);
    const nav = saved === "top" || saved === "side" ? saved : defaultNav;
    const rail = read(KEY_RAIL) !== "0";
    setLayout((l) => ({ ...l, nav, rail }));
  }, [defaultNav]);

  const setNav = useCallback((nav: LyxNav) => {
    write(KEY_NAV, nav);
    setLayout((l) => ({ ...l, nav }));
  }, []);

  const toggleRail = useCallback(() => {
    setLayout((l) => {
      write(KEY_RAIL, l.rail ? "0" : "1");
      return { ...l, rail: !l.rail };
    });
  }, []);

  const setFocus = useCallback((focus: boolean) => {
    setLayout((l) => ({ ...l, focus }));
  }, []);

  return { ...layout, setNav, toggleRail, setFocus };
}
