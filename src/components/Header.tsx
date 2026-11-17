"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  primeiroNome as obterPrimeiroNome,
  sair,
  useUsuarioLogado,
} from "@/lib/sessao";

export default function Header() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Identificação reativa da sessão via useSyncExternalStore sem setStates síncronos
  const usuario = useUsuarioLogado();
  const logado = Boolean(usuario);
  const primeiroNome = obterPrimeiroNome(usuario) ?? (logado ? "aluno" : null);

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    function handleClickFora(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownAberto(false);
      }
    }

    if (dropdownAberto) {
      document.addEventListener("mousedown", handleClickFora);
      document.addEventListener("touchstart", handleClickFora);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickFora);
      document.removeEventListener("touchstart", handleClickFora);
    };
  }, [dropdownAberto]);

  function sairDaConta() {
    sair();
    setDropdownAberto(false);
    setMenuAberto(false);
    router.push("/");
  }

  function fecharMenu() {
    setMenuAberto(false);
    setDropdownAberto(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0b0c12] text-white">
      <div className="relative mx-auto flex h-8.75 max-w-360 items-center justify-between pr-1 pl-2.5 lg:h-25.5 lg:pr-12.25 lg:pl-11.25">
        <Link
          href="/"
          className="shrink-0"
          onClick={fecharMenu}
          aria-label="RiseFit - página inicial"
        >
          <Image
            src="/design/logo-risefit.png"
            alt="RiseFit"
            width={229}
            height={76}
            priority
            className="h-auto w-18.75 lg:w-57.25"
          />
        </Link>

        <nav className="hidden gap-6 text-base lg:flex xl:absolute xl:left-[calc(50%-300px)] xl:gap-10.25 xl:text-lg">
          <Link href="/" className="hover:text-brand transition-colors">
            Página Inicial
          </Link>
          <Link href="/#planos" className="hover:text-brand transition-colors">
            Planos
          </Link>
          <Link
            href="/profissionais"
            className="hover:text-brand transition-colors"
          >
            Profissionais
          </Link>
          <Link href="/loja" className="hover:text-brand transition-colors">
            Loja
          </Link>
          <Link
            href="/#sobre-nos"
            className="hover:text-brand transition-colors"
          >
            Sobre nós
          </Link>
        </nav>

        <div className="hidden items-center gap-8 text-base lg:flex xl:text-lg">
          <Link
            href={logado ? "/area-aluno" : "/login"}
            className="flex items-center gap-2 hover:text-brand transition-colors"
          >
            Área do Aluno
            <IconeAluno />
          </Link>

          {logado ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownAberto((prev) => !prev)}
                aria-expanded={dropdownAberto}
                aria-haspopup="true"
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-white/20 bg-white/5 py-1.5 px-3.5 text-base font-semibold text-white transition-all duration-200 hover:border-brand hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-sm">
                  {primeiroNome ? primeiroNome.charAt(0).toUpperCase() : "A"}
                </span>
                <span>Olá, {primeiroNome}</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    dropdownAberto ? "rotate-180 text-brand" : "text-gray-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Caixinha Popover / Dropdown flutuante */}
              {dropdownAberto && (
                <div className="absolute right-0 mt-2.5 w-60 rounded-xl border border-white/15 bg-[#12131b] p-1.5 text-sm text-gray-200 shadow-2xl backdrop-blur-md z-50">
                  <div className="px-3.5 py-2.5 border-b border-white/10 mb-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Conta RiseFit
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-white truncate">
                      {usuario?.nome || primeiroNome}
                    </p>
                    {usuario?.email && (
                      <p className="text-xs text-gray-400 truncate">
                        {String(usuario.email)}
                      </p>
                    )}
                  </div>

                  <Link
                    href="/minha-conta/editar"
                    onClick={() => setDropdownAberto(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-brand hover:text-white"
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Editar conta
                  </Link>

                  <Link
                    href="/minha-conta"
                    onClick={() => setDropdownAberto(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Minha conta
                  </Link>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    type="button"
                    onClick={sairDaConta}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/cadastro"
              className="flex h-10.75 w-36.5 items-center justify-center rounded-lg bg-brand font-semibold text-white transition-colors hover:bg-[#6d28d9]"
            >
              Inscreva-se
            </Link>
          )}
        </div>

        <button
          type="button"
          className="flex h-8.75 w-8.75 cursor-pointer items-center justify-center lg:hidden"
          aria-label="Abrir ou fechar o menu"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {menuAberto ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <nav className="flex flex-col gap-4 border-t border-white/10 px-6 py-6 text-lg lg:hidden bg-[#0b0c12]">
          <Link href="/" onClick={fecharMenu}>
            Página Inicial
          </Link>
          <Link href="/#planos" onClick={fecharMenu}>
            Planos
          </Link>
          <Link href="/profissionais" onClick={fecharMenu}>
            Profissionais
          </Link>
          <Link href="/loja" onClick={fecharMenu}>
            Loja
          </Link>
          <Link href="/#sobre-nos" onClick={fecharMenu}>
            Sobre nós
          </Link>
          <Link
            href={logado ? "/area-aluno" : "/login"}
            onClick={fecharMenu}
            className="flex items-center gap-2"
          >
            Área do Aluno
            <IconeAluno />
          </Link>

          {logado ? (
            <div className="mt-2 flex flex-col gap-3 rounded-xl border border-white/15 bg-white/5 p-4 text-base">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {primeiroNome ? primeiroNome.charAt(0).toUpperCase() : "A"}
                </span>
                <div>
                  <p className="font-semibold text-white">
                    Olá, {primeiroNome}
                  </p>
                  {usuario?.email && (
                    <p className="text-xs text-gray-400">
                      {String(usuario.email)}
                    </p>
                  )}
                </div>
              </div>

              <Link
                href="/minha-conta/editar"
                onClick={fecharMenu}
                className="flex items-center gap-2 py-1 text-gray-200 hover:text-brand"
              >
                Editar conta
              </Link>
              <Link
                href="/minha-conta"
                onClick={fecharMenu}
                className="flex items-center gap-2 py-1 text-gray-200 hover:text-brand"
              >
                Minha conta
              </Link>
              <button
                type="button"
                onClick={sairDaConta}
                className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-center font-semibold text-red-400 transition-colors hover:bg-red-500/20"
              >
                Sair da conta
              </button>
            </div>
          ) : (
            <Link
              href="/cadastro"
              onClick={fecharMenu}
              className="rounded-lg bg-brand px-6 py-3 text-center font-semibold"
            >
              Inscreva-se
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

function IconeAluno() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand"
      aria-hidden="true"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}
