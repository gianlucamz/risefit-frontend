"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProdutoCard from "./ProdutoCard";
import {
  categorias,
  maisVendidosIds,
  novidadesIds,
  produtos,
  type CategoriaId,
  type Produto,
} from "@/data/produtos";

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function porIds(ids: number[]): Produto[] {
  return ids
    .map((id) => produtos.find((p) => p.id === id))
    .filter((p): p is Produto => Boolean(p));
}

const linkSidebar =
  "block text-left text-xs text-gray-700 transition-colors hover:text-brand";

export default function LojaCatalogo() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<CategoriaId | null>(null);

  const filtrando = busca.trim() !== "" || categoria !== null;

  const resultados = useMemo(() => {
    const termo = normalizar(busca.trim());
    return produtos.filter(
      (p) =>
        (!categoria || p.categoria === categoria) &&
        (!termo || normalizar(p.nome).includes(termo)),
    );
  }, [busca, categoria]);

  function limparFiltros() {
    setBusca("");
    setCategoria(null);
  }

  return (
    <div className="lg:grid lg:grid-cols-[256px_1fr]">
      {/* ============ SIDEBAR (desktop) ============ */}
      <aside className="hidden border-r border-gray-200 bg-white lg:block">
        <nav
          aria-label="Navegação da loja"
          className="sticky top-25 px-10 py-8 text-dark"
        >
          <h2 className="text-sm font-bold">Explorar</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <a href="#mais-vendidos" className={linkSidebar}>
                Mais Vendidos
              </a>
            </li>
            <li>
              <a href="#novidades" className={linkSidebar}>
                Novidades na RiseFit
              </a>
            </li>
            <li>
              {/* Ainda não existe a seção "em alta": por enquanto leva aos mais vendidos */}
              <a href="#mais-vendidos" className={linkSidebar}>
                Produtos em Alta
              </a>
            </li>
          </ul>

          <hr className="my-6 border-gray-200" />

          <h2 className="text-sm font-bold">Categorias</h2>
          <ul className="mt-3 space-y-2">
            {categorias.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setCategoria(categoria === c.id ? null : c.id)}
                  aria-pressed={categoria === c.id}
                  className={`${linkSidebar} ${
                    categoria === c.id ? "font-bold text-brand" : ""
                  }`}
                >
                  {c.rotulo}
                </button>
              </li>
            ))}
          </ul>

          <hr className="my-6 border-gray-200" />

          <h2 className="text-sm font-bold">Configurações</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/area-aluno" className={linkSidebar}>
                Faça seu login
              </Link>
            </li>
            <li>
              <Link href="/contato" className={linkSidebar}>
                Contato
              </Link>
            </li>
            <li>
              <Link href="/area-aluno" className={linkSidebar}>
                Minha Conta
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ============ CONTEÚDO ============ */}
      <div className="min-w-0 px-6 py-10 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-center text-3xl font-extrabold uppercase tracking-tight text-dark sm:text-4xl lg:text-5xl">
            Equipamentos e suplementos
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-dark lg:text-base">
            Tudo o que você precisa para potencializar seus treinos e alcançar
            seus objetivos com qualidade e confiança
          </p>

          {/* Busca */}
          <div className="mx-auto mt-12 flex max-w-[640px] items-center gap-3 rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm focus-within:border-brand">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-dark"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Busque na RiseFit..."
              aria-label="Buscar produtos"
              className="w-full bg-transparent text-sm text-dark outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Categorias no celular (a sidebar só aparece no desktop) */}
          <div
            className="-mx-6 mt-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:hidden"
            role="group"
            aria-label="Categorias"
          >
            {categorias.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoria(categoria === c.id ? null : c.id)}
                aria-pressed={categoria === c.id}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  categoria === c.id
                    ? "border-brand bg-brand text-white"
                    : "border-gray-300 bg-white text-dark"
                }`}
              >
                {c.rotulo}
              </button>
            ))}
          </div>

          {filtrando ? (
            <Secao titulo="Resultados" id="resultados">
              {resultados.length > 0 ? (
                <Grade lista={resultados} />
              ) : (
                <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-600 shadow-sm">
                  Nenhum produto encontrado.{" "}
                  <button
                    type="button"
                    onClick={limparFiltros}
                    className="font-semibold text-brand hover:underline"
                  >
                    Limpar filtros
                  </button>
                </p>
              )}
            </Secao>
          ) : (
            <>
              <Secao titulo="Mais Vendidos" id="mais-vendidos">
                <Grade lista={porIds(maisVendidosIds)} />
              </Secao>
              <Secao titulo="Novidades na RiseFit" id="novidades">
                <Grade lista={porIds(novidadesIds)} />
              </Secao>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Secao({
  titulo,
  id,
  children,
}: {
  titulo: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-28">
      <h2 className="text-lg font-extrabold text-dark lg:text-xl">{titulo}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Grade({ lista }: { lista: Produto[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 pb-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {lista.map((produto) => (
        <ProdutoCard key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
