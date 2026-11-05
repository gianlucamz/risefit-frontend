"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [primeiroNome, setPrimeiroNome] = useState<string | null>(null);

  useEffect(() => {
    function carregarUsuario() {
      if (typeof window === "undefined") return;

      try {
        const usuarioSalvo = localStorage.getItem("usuario");
        if (usuarioSalvo) {
          const dados = JSON.parse(usuarioSalvo);
          const nomeCompleto = dados.nome || dados.nomeCompleto || "";
          if (nomeCompleto) {
            setPrimeiroNome(nomeCompleto.trim().split(" ")[0]);
            return;
          }
        }

        const step1Salvo = sessionStorage.getItem("risefit_cadastro_step1");
        if (step1Salvo) {
          const dadosStep1 = JSON.parse(step1Salvo);
          if (dadosStep1.nome) {
            setPrimeiroNome(dadosStep1.nome.trim().split(" ")[0]);
            return;
          }
        }
      } catch (e) {
        console.error("Erro ao ler dados de sessão no Header:", e);
      }

      setPrimeiroNome(null);
    }

    carregarUsuario();

    window.addEventListener("usuario_logado", carregarUsuario);
    window.addEventListener("storage", carregarUsuario);

    return () => {
      window.removeEventListener("usuario_logado", carregarUsuario);
      window.removeEventListener("storage", carregarUsuario);
    };
  }, []);

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-dark text-white">
      <div className="mx-auto flex h-20 max-w-360 items-center justify-between px-6 lg:h-25 lg:px-14">
        <Link href="/" className="flex items-center gap-2" onClick={fecharMenu}>
          <Image
            src="/logo.png"
            alt="Ícone RiseFit"
            width={52}
            height={36}
            className="h-auto w-10 lg:w-13"
          />
          <span className="text-2xl font-extrabold italic lg:text-[34px]">
            Rise<span className="text-brand">Fit</span>
          </span>
        </Link>

        <nav className="hidden gap-10 text-lg lg:flex">
          <Link href="/">Home</Link>
          <Link href="/#planos">Planos</Link>
          <Link href="/profissionais">Profissionais</Link>
          <Link href="/loja">Loja</Link>
          <Link href="/#sobre-nos">Sobre nós</Link>
        </nav>

        <div className="hidden items-center gap-8 text-lg lg:flex">
          <Link href="/area-aluno" className="flex items-center gap-2">
            Área do Aluno
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
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
            </svg>
          </Link>

          {primeiroNome ? (
            <Link
              href="/area-aluno"
              className="font-medium text-white hover:text-brand transition-colors"
            >
              Olá, {primeiroNome}
            </Link>
          ) : (
            <Link
              href="/cadastro"
              className="rounded-lg bg-brand px-5 py-2 text-white hover:bg-[#6d28d9] transition-colors"
            >
              Inscreva-se
            </Link>
          )}
        </div>

        <button
          type="button"
          className="lg:hidden"
          aria-label="Abrir ou fechar o menu"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
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
            Home
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
          <Link href="/area-aluno" onClick={fecharMenu}>
            Área do Aluno
          </Link>

          {primeiroNome ? (
            <Link
              href="/area-aluno"
              onClick={fecharMenu}
              className="font-medium text-white hover:text-brand transition-colors text-center py-2"
            >
              Olá, {primeiroNome}
            </Link>
          ) : (
            <Link
              href="/#planos"
              onClick={fecharMenu}
              className="rounded-xl bg-brand px-6 py-3 text-center font-semibold"
            >
              Inscreva-se
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
