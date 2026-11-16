"use client";

import { useState } from "react";
import Estrelas from "./Estrelas";
import type { AvaliacaoProduto } from "@/data/produtoDetalhes";

const VISIVEIS = 3;

// Lista de avaliações com "É útil" (contagem só nesta tela) e "Ver mais".
export default function ProdutoAvaliacoes({
  avaliacoes,
}: {
  avaliacoes: AvaliacaoProduto[];
}) {
  const [verTodas, setVerTodas] = useState(false);
  const [uteis, setUteis] = useState<Record<number, boolean>>({});
  const lista = verTodas ? avaliacoes : avaliacoes.slice(0, VISIVEIS);

  return (
    <>
      <ul className="mt-9 space-y-9">
        {lista.map((a, i) => {
          const marcado = Boolean(uteis[i]);
          return (
            <li key={`${a.nome}-${i}`}>
              <p className="flex flex-wrap items-center gap-2 text-lg font-semibold text-dark lg:text-[19px]">
                {a.nome}
                <Estrelas nota={a.nota} tamanho={17} />
              </p>
              <p className="mt-2 text-[15px] leading-6 text-dark lg:pr-4">{a.texto}</p>
              <button
                type="button"
                aria-pressed={marcado}
                onClick={() => setUteis((u) => ({ ...u, [i]: !u[i] }))}
                className={`mt-3 inline-flex h-8.5 cursor-pointer items-center gap-2 rounded-lg border px-5 text-sm transition-colors ${
                  marcado ? "border-brand text-brand" : "border-gray-300 text-dark hover:border-brand"
                }`}
              >
                É útil
                <svg width="17" height="16" viewBox="0 0 24 22" fill={marcado ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 10v11H2V10zM7 10l4.5-8.5c1.5 0 2.5 1.2 2.2 2.8L13 9h6.5a2.2 2.2 0 0 1 2.1 2.7l-1.8 7.6A2.2 2.2 0 0 1 17.7 21H7" />
                </svg>
                ({a.util + (marcado ? 1 : 0)})
              </button>
            </li>
          );
        })}
      </ul>

      {avaliacoes.length > VISIVEIS && (
        <button
          type="button"
          onClick={() => setVerTodas((v) => !v)}
          className="mt-8 cursor-pointer text-sm font-medium text-brand hover:underline"
        >
          {verTodas ? "Ver menos" : "Ver mais"}
        </button>
      )}
    </>
  );
}
