"use client";

import { useSyncExternalStore } from "react";

// Carrinho da Loja guardado só no navegador (localStorage).
// Quando a API de pedidos existir, troque estas funções pelas chamadas reais.

export type ItemCarrinho = { id: number; quantidade: number };

const CHAVE = "risefit_carrinho";
const EVENTO = "risefit_carrinho_mudou";
const VAZIO: ItemCarrinho[] = [];

let cacheTexto: string | null = null;
let cacheItens: ItemCarrinho[] = VAZIO;

function ler(): ItemCarrinho[] {
  let texto: string | null = null;
  try {
    texto = localStorage.getItem(CHAVE);
  } catch {
    return VAZIO;
  }
  if (texto === cacheTexto) return cacheItens;
  cacheTexto = texto;
  try {
    const dados: unknown = texto ? JSON.parse(texto) : [];
    cacheItens = Array.isArray(dados)
      ? dados.filter(
          (i): i is ItemCarrinho =>
            typeof i?.id === "number" &&
            typeof i?.quantidade === "number" &&
            i.quantidade > 0,
        )
      : VAZIO;
  } catch {
    cacheItens = VAZIO;
  }
  return cacheItens;
}

function salvar(itens: ItemCarrinho[]) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(itens));
  } catch {
    // Sem acesso ao armazenamento: o carrinho só não persiste
  }
  window.dispatchEvent(new Event(EVENTO));
}

function assinar(aoMudar: () => void) {
  window.addEventListener(EVENTO, aoMudar);
  window.addEventListener("storage", aoMudar);
  return () => {
    window.removeEventListener(EVENTO, aoMudar);
    window.removeEventListener("storage", aoMudar);
  };
}

export function useCarrinho() {
  const itens = useSyncExternalStore(assinar, ler, () => VAZIO);

  return {
    itens,
    totalItens: itens.reduce((s, i) => s + i.quantidade, 0),
    adicionar(id: number) {
      const atual = ler();
      const existe = atual.find((i) => i.id === id);
      salvar(
        existe
          ? atual.map((i) => (i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i))
          : [...atual, { id, quantidade: 1 }],
      );
    },
    alterarQuantidade(id: number, quantidade: number) {
      salvar(
        ler()
          .map((i) => (i.id === id ? { ...i, quantidade } : i))
          .filter((i) => i.quantidade > 0),
      );
    },
    remover(id: number) {
      salvar(ler().filter((i) => i.id !== id));
    },
  };
}
