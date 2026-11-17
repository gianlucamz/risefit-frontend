"use client";

import { useSyncExternalStore } from "react";

// Sessão do aluno no navegador. O login (LoginForm) grava "usuario" e "token" no
// localStorage (lembrar acesso) ou no sessionStorage e dispara o evento "usuario_logado".

export type UsuarioSessao = {
  id?: number | string;
  nome?: string;
  nomeCompleto?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  [campo: string]: unknown;
};

const EVENTO = "usuario_logado";

function lerTexto(): string | null {
  try {
    return localStorage.getItem("usuario") ?? sessionStorage.getItem("usuario");
  } catch {
    return null;
  }
}

function assinar(aoMudar: () => void) {
  window.addEventListener(EVENTO, aoMudar);
  window.addEventListener("storage", aoMudar);
  return () => {
    window.removeEventListener(EVENTO, aoMudar);
    window.removeEventListener("storage", aoMudar);
  };
}

let cacheTexto: string | null = null;
let cacheUsuario: UsuarioSessao | null = null;

function interpretar(texto: string | null): UsuarioSessao | null {
  if (texto === cacheTexto) return cacheUsuario;
  cacheTexto = texto;
  try {
    const dados: unknown = texto ? JSON.parse(texto) : null;
    cacheUsuario =
      dados && typeof dados === "object" && !Array.isArray(dados)
        ? (dados as UsuarioSessao)
        : null;
  } catch {
    cacheUsuario = null;
  }
  return cacheUsuario;
}

// Usuário logado (ou null). No servidor e na 1ª renderização é sempre null.
export function useUsuarioLogado(): UsuarioSessao | null {
  const texto = useSyncExternalStore(assinar, lerTexto, () => null);
  return interpretar(texto);
}

export function primeiroNome(usuario: UsuarioSessao | null): string | null {
  const nome = usuario?.nome || usuario?.nomeCompleto;
  return typeof nome === "string" && nome.trim() ? nome.trim().split(/\s+/)[0] : null;
}

// Grava a sessão (mesmo formato do login real) e avisa a interface.
export function salvarSessao(usuario: UsuarioSessao, token: string | undefined, lembrar: boolean) {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
  sessionStorage.removeItem("usuario");
  sessionStorage.removeItem("token");
  const armazenamento = lembrar ? localStorage : sessionStorage;
  armazenamento.setItem("usuario", JSON.stringify(usuario));
  if (token) armazenamento.setItem("token", token);
  window.dispatchEvent(new Event(EVENTO));
}

// Sai da conta: apaga a sessão dos dois armazenamentos e avisa a interface.
export function sair() {
  try {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("token");
  } catch {
    // sem acesso ao armazenamento: nada para apagar
  }
  window.dispatchEvent(new Event(EVENTO));
}

export function mascararCPF(cpf?: string | null): string {
  if (!cpf) return "Não informado";
  const d = cpf.replace(/\D/g, "");
  if (d.length < 11) return cpf;
  return `***.***.${d.slice(6, 9)}-**`;
}

export function formatarTelefoneExibicao(telefone?: string | null): string {
  if (!telefone) return "";
  const d = telefone.replace(/\D/g, "");
  if (d.length === 11) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  if (d.length === 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return telefone;
}

export function mascararTelefone(telefone?: string | null): string {
  if (!telefone) return "Não informado";
  const d = telefone.replace(/\D/g, "");
  if (d.length >= 10) {
    return `(${d.slice(0, 2)}) 9****-**${d.slice(-2)}`;
  }
  return telefone;
}
