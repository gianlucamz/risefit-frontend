"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  // true = menu do celular aberto, false = fechado
  const [menuAberto, setMenuAberto] = useState(false);

  // Destaca em roxo o link da página de Profissionais quando ela está aberta
  const naPaginaProfissionais = usePathname() === "/profissionais";
  const classeProfissionais = naPaginaProfissionais ? "text-brand" : "";

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-dark text-white">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:h-[100px] lg:px-14">
        {/* Logo: ícone + texto */}
        <Link href="/" className="flex items-center gap-2" onClick={fecharMenu}>
          <Image
            src="/logo.png"
            alt="Ícone RiseFit"
            width={52}
            height={36}
            className="h-auto w-10 lg:w-[52px]"
          />
          <span className="text-2xl font-extrabold italic lg:text-[34px]">
            Rise<span className="text-brand">Fit</span>
          </span>
        </Link>

        {/* Menu de navegação (só aparece no desktop) */}
        <nav className="hidden gap-10 text-lg lg:flex">
          <Link href="/">Home</Link>
          <Link href="/#planos">Planos</Link>
          <Link href="/profissionais" className={classeProfissionais}>
            Profissionais
          </Link>
          <Link href="/loja">Loja</Link>
          <Link href="/sobre-nos">Sobre nós</Link>
        </nav>

        {/* Lado direito (só aparece no desktop) */}
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
          <Link
            href="/cadastro"
            className="rounded-lg bg-[#7c3aed] px-5 py-2 text-white"
          >
            Inscreva-se
          </Link>
        </div>

        {/* Botão do menu (só aparece no celular) */}
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

      {/* Menu do celular (aparece quando menuAberto é true) */}
      {menuAberto && (
        <nav className="flex flex-col gap-5 border-t border-white/10 px-6 py-6 text-lg lg:hidden">
          <Link href="/" onClick={fecharMenu}>
            Home
          </Link>
          <Link href="/#planos" onClick={fecharMenu}>
            Planos
          </Link>
          <Link
            href="/profissionais"
            onClick={fecharMenu}
            className={classeProfissionais}
          >
            Profissionais
          </Link>
          <Link href="/loja" onClick={fecharMenu}>
            Loja
          </Link>
          <Link href="/sobre-nos" onClick={fecharMenu}>
            Sobre nós
          </Link>
          <Link href="/area-do-aluno">Área do Aluno</Link>
          <Link
            href="/#planos"
            onClick={fecharMenu}
            className="rounded-xl bg-brand px-6 py-3 text-center font-semibold"
          >
            Inscreva-se
          </Link>
        </nav>
      )}
    </header>
  );
}
