"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Barra de navegação fixa no rodapé do celular (layout mobile: 41px, fundo #0a0c11).
// No desktop ela some e o Footer aparece no lugar.
const itens = [
  { href: "/", rotulo: "Página Inicial", icone: <IconeInicio /> },
  { href: "/area-aluno/treinos", rotulo: "Meus treinos", icone: <IconeHalter /> },
  { href: "/area-aluno/historico", rotulo: "Progresso", icone: <IconeGrafico /> },
  { href: "/minha-conta", rotulo: "Minha conta", icone: <IconeConta /> },
];

function itemAtivo(pathname: string) {
  if (pathname.startsWith("/minha-conta") || pathname.startsWith("/assinatura")) return "/minha-conta";
  if (pathname.startsWith("/area-aluno/historico")) return "/area-aluno/historico";
  if (pathname.startsWith("/area-aluno")) return "/area-aluno/treinos";
  return "/";
}

export default function BarraInferior() {
  const ativo = itemAtivo(usePathname());

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-50 bg-[#0a0c11] pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid h-10.25 grid-cols-4 px-4">
        {itens.map((item) => {
          const atual = item.href === ativo;
          return (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                aria-label={item.rotulo}
                aria-current={atual ? "page" : undefined}
                className={`flex flex-1 items-center justify-center transition-colors ${
                  atual ? "text-brand" : "text-white hover:text-brand"
                }`}
              >
                {item.icone}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function IconeInicio() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="currentColor" aria-hidden="true">
      <path d="M9 0 0 7.5h2.5V16h4.5v-5h4v5h4.5V7.5H18L9 0z" />
    </svg>
  );
}

function IconeHalter() {
  return (
    <svg width="20" height="15" viewBox="0 0 20 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <rect x="3.5" y="1" width="3" height="13" rx="1" />
      <rect x="13.5" y="1" width="3" height="13" rx="1" />
      <path d="M1 4.5v6M19 4.5v6M6.5 7.5h7" />
    </svg>
  );
}

function IconeGrafico() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="1" y="9" width="2.6" height="4.2" rx=".5" />
      <rect x="5.7" y="5.5" width="2.6" height="7.7" rx=".5" />
      <rect x="10.4" y="1" width="2.6" height="12.2" rx=".5" />
    </svg>
  );
}

function IconeConta() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="6" cy="3.5" r="2.7" />
      <path d="M1 11.3c.4-2.3 2.6-3.8 5-3.8s4.6 1.5 5 3.8" />
    </svg>
  );
}
