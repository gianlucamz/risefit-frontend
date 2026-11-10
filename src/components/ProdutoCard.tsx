"use client";

import Image from "next/image";
import { useState } from "react";
import type { Produto } from "@/data/produtos";

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function ProdutoCard({ produto }: { produto: Produto }) {
  // Sem imagem (ou se ela falhar), mostra um ícone no lugar
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const mostrarImagem = produto.imagem && !imagemFalhou;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-md">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        {mostrarImagem ? (
          <Image
            src={produto.imagem!}
            alt={produto.nome}
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
      </div>

      <h3 className="mt-4 line-clamp-3 min-h-[3.75em] text-xs font-bold leading-tight text-dark">
        {produto.nome}
      </h3>
      <p className="mt-3 text-sm font-extrabold text-dark">
        {moeda.format(produto.preco)}
      </p>
    </article>
  );
}
