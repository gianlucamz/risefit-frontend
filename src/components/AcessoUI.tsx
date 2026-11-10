"use client";

import Link from "next/link";
import { useState } from "react";

export function AcessoLayout({
  children,
  alinhamento = "esquerda",
}: {
  children: React.ReactNode;
  alinhamento?: "esquerda" | "centro";
}) {
  return (
    <main className="bg-[#f8f9fa] px-6 py-10 lg:py-14">
      <div className="mx-auto max-w-[900px]">
        <Link
          href="/"
          className="text-xs font-medium text-brand hover:underline"
        >
          ← Voltar para home
        </Link>

        <div
          className={`mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-10 ${
            alinhamento === "centro" ? "text-center" : ""
          }`}
        >
          {children}
        </div>
      </div>
    </main>
  );
}

export function CampoSenha({
  id,
  rotulo,
  valor,
  placeholder,
  aoMudar,
  erro,
  dica,
  autoComplete = "current-password",
}: {
  id: string;
  rotulo: string;
  valor: string;
  placeholder: string;
  aoMudar: (novoValor: string) => void;
  erro?: string;
  dica?: string;
  autoComplete?: string;
}) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="w-full text-left">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-gray-900"
      >
        {rotulo}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visivel ? "text" : "password"}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(erro)}
          aria-describedby={
            erro ? `${id}-erro` : dica ? `${id}-dica` : undefined
          }
          className={`h-12 w-full rounded-md border bg-white pl-4 pr-24 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand/20 sm:text-base ${
            erro
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-brand"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visivel}
          className="absolute inset-y-0 right-4 cursor-pointer text-xs font-medium text-brand hover:underline"
        >
          {visivel ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {erro ? (
        <p id={`${id}-erro`} className="mt-1.5 text-xs font-medium text-red-600">
          {erro}
        </p>
      ) : (
        dica && (
          <p id={`${id}-dica`} className="mt-1.5 text-xs text-gray-500">
            {dica}
          </p>
        )
      )}
    </div>
  );
}

export function BotaoAcesso({
  carregando,
  textoCarregando = "Aguarde...",
  children,
}: {
  carregando: boolean;
  textoCarregando?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={carregando}
      className="w-full cursor-pointer rounded-lg bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#6d28d9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {carregando ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 animate-spin text-white"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          {textoCarregando}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function AlertaErro({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700"
    >
      {children}
    </p>
  );
}

export function AlertaSucesso({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-left text-sm text-green-800"
    >
      {children}
    </p>
  );
}
