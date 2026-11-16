"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { primeiroNome as obterPrimeiroNome, sair, useUsuarioLogado } from "@/lib/sessao";

export default function Header() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  // Logado = existe "usuario" salvo pelo login. Sem login, mostra "Inscreva-se".
  const usuario = useUsuarioLogado();
  const logado = Boolean(usuario);
  const primeiroNome = obterPrimeiroNome(usuario) ?? (logado ? "aluno" : null);

  function sairDaConta() {
    sair();
    setMenuAberto(false);
    router.push("/");
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0b0c12] text-white">
      <div className="relative mx-auto flex h-8.75 max-w-360 items-center justify-between pr-1 pl-2.5 lg:h-25.5 lg:pr-12.25 lg:pl-11.25">
        <Link href="/" className="shrink-0" onClick={fecharMenu} aria-label="RiseFit - página inicial">
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
          <Link href="/" className="hover:text-brand">Página Inicial</Link>
          <Link href="/#planos" className="hover:text-brand">Planos</Link>
          <Link href="/profissionais" className="hover:text-brand">Profissionais</Link>
          <Link href="/loja" className="hover:text-brand">Loja</Link>
          <Link href="/#sobre-nos" className="hover:text-brand">Sobre nós</Link>
        </nav>

        <div className="hidden items-center gap-8 text-base lg:flex xl:text-lg">
          <Link
            href={logado ? "/area-aluno" : "/login"}
            className="flex items-center gap-2 hover:text-brand"
          >
            Área do Aluno
            <IconeAluno />
          </Link>

          {logado ? (
            <div className="flex items-center gap-5">
              <Link
                href="/minha-conta"
                className="font-medium text-white transition-colors hover:text-brand"
              >
                Olá, {primeiroNome}
              </Link>
              <button
                type="button"
                onClick={sairDaConta}
                className="cursor-pointer rounded-lg border border-white/30 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:border-brand hover:text-brand"
              >
                Sair
              </button>
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
        <nav className="flex flex-col gap-5 border-t border-white/10 px-6 py-6 text-lg lg:hidden">
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
            <>
              <Link href="/minha-conta" onClick={fecharMenu}>
                Olá, {primeiroNome} · Minha conta
              </Link>
              <button
                type="button"
                onClick={sairDaConta}
                className="cursor-pointer rounded-lg border border-white/30 px-6 py-3 text-center font-semibold"
              >
                Sair
              </button>
            </>
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
