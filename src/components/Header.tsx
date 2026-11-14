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
        const usuarioSalvo =
          localStorage.getItem("usuario") ?? sessionStorage.getItem("usuario");
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
    <header className="sticky top-0 z-50 bg-[#0b0c12] text-white">
      <div className="relative mx-auto flex h-18 max-w-360 items-center justify-between px-4 lg:h-25.5 lg:pr-12.25 lg:pl-11.25">
        <Link href="/" className="shrink-0" onClick={fecharMenu} aria-label="RiseFit - página inicial">
          <Image
            src="/design/logo-risefit.png"
            alt="RiseFit"
            width={229}
            height={76}
            priority
            className="h-auto w-37 lg:w-57.25"
          />
        </Link>

        <nav className="hidden gap-6 text-base lg:flex xl:absolute xl:left-[calc(50%-265px)] xl:gap-10.25 xl:text-lg">
          <Link href="/" className="hover:text-brand">Home</Link>
          <Link href="/#planos" className="hover:text-brand">Planos</Link>
          <Link href="/profissionais" className="hover:text-brand">Profissionais</Link>
          <Link href="/loja" className="hover:text-brand">Loja</Link>
          <Link href="/#sobre-nos" className="hover:text-brand">Sobre nós</Link>
        </nav>

        <div className="hidden items-center gap-8 text-base lg:flex xl:text-lg">
          <Link
            href={primeiroNome ? "/area-aluno" : "/login"}
            className="flex items-center gap-2 hover:text-brand"
          >
            Área do Aluno
            <IconeAluno />
          </Link>

          {primeiroNome ? (
            <Link
              href="/area-aluno"
              className="font-medium text-white transition-colors hover:text-brand"
            >
              Olá, {primeiroNome}
            </Link>
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
          className="cursor-pointer lg:hidden"
          aria-label="Abrir ou fechar o menu"
          aria-expanded={menuAberto}
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
          <Link
            href={primeiroNome ? "/area-aluno" : "/login"}
            onClick={fecharMenu}
            className="flex items-center gap-2"
          >
            Área do Aluno
            <IconeAluno />
          </Link>

          {primeiroNome ? (
            <Link
              href="/area-aluno"
              onClick={fecharMenu}
              className="py-2 text-center font-medium text-white transition-colors hover:text-brand"
            >
              Olá, {primeiroNome}
            </Link>
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
