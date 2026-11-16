"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Produto } from "@/data/produtos";
import { useCarrinho } from "@/lib/carrinho";

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function ProdutoCard({ produto }: { produto: Produto }) {
  // Sem imagem (ou se ela falhar), mostra um ícone no lugar
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const mostrarImagem = produto.imagem && !imagemFalhou;
  const { itens, adicionar } = useCarrinho();
  const noCarrinho = itens.find((i) => i.id === produto.id)?.quantidade ?? 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-md">
      <Link
        href={`/loja/${produto.id}`}
        aria-label={produto.nome}
        className="relative block aspect-square w-full overflow-hidden rounded-xl bg-gray-50 transition-opacity hover:opacity-90"
      >
        {mostrarImagem ? (
          <Image
            src={produto.imagem!}
            alt=""
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-3"
            onError={() => setImagemFalhou(true)}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-brand/40"
            aria-hidden="true"
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />
            </svg>
          </div>
        )}
      </Link>

      <h3 className="mt-4 line-clamp-3 min-h-[3.75em] text-xs font-bold leading-tight text-dark">
        <Link href={`/loja/${produto.id}`} className="hover:text-brand">
          {produto.nome}
        </Link>
      </h3>
      <p className="mt-3 text-sm font-extrabold text-dark">
        {moeda.format(produto.preco)}
      </p>
      <button
        type="button"
        onClick={() => adicionar(produto.id)}
        className="mt-3 cursor-pointer rounded-lg border border-brand px-3 py-2 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
      >
        Adicionar ao carrinho
      </button>
      {noCarrinho > 0 && (
        <Link
          href="/carrinho"
          className="mt-2 text-center text-xs font-medium text-brand hover:underline"
        >
          Ver carrinho ({noCarrinho})
        </Link>
      )}
    </article>
  );
}
