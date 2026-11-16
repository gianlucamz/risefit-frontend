"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Profissional } from "@/data/profissionais";

export default function ProfissionalCard({ profissional }: { profissional: Profissional }) {
  // Se a foto não carregar, mostra um fundo escuro com as iniciais
  const [fotoFalhou, setFotoFalhou] = useState(false);

  const nota = profissional.avaliacao.toFixed(1).replace(".", ",");
  const iniciais = profissional.nome
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("");

  return (
    <article className="flex flex-col bg-white pb-[10px] lg:h-[462px]">
      {/* Foto */}
      <div className="relative h-[180px] shrink-0 bg-dark sm:h-[200px] lg:h-[180px]">
        {fotoFalhou ? (
          <div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-brand">
            {iniciais}
          </div>
        ) : (
          <Image
            src={profissional.foto}
            alt={`Foto de ${profissional.nome}`}
            fill
            sizes="(min-width: 1024px) 376px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: profissional.fotoPosicao ?? "50% 50%" }}
            onError={() => setFotoFalhou(true)}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 lg:px-0">
        <h3 className="mt-6 text-[26px] font-semibold leading-none text-black lg:ml-[21px] lg:mt-[24px] lg:text-[30px]">
          {profissional.nome}
        </h3>

        {/* Avaliação */}
        <p className="mt-[17px] flex items-center text-sm font-bold leading-none text-black lg:ml-[22px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-brand" aria-hidden="true">
            <path d="M12 1.8l3.1 6.9 7.4.8-5.6 5 1.6 7.4L12 18.1l-6.5 3.8 1.6-7.4-5.6-5 7.4-.8z" />
          </svg>
          <span className="ml-[9px]">
            {nota}({profissional.avaliacoes} avaliações)
          </span>
        </p>

        <p className="mt-[22px] text-sm leading-[19px] text-black lg:ml-[25px] lg:mr-[14px]">
          {profissional.descricao}
        </p>

        {/* Etiquetas */}
        <ul className="mt-6 flex flex-wrap justify-center gap-x-[12px] gap-y-2 lg:mt-auto lg:flex-nowrap lg:pb-[14px]">
          {profissional.especialidades.map((especialidade) => (
            <li
              key={especialidade}
              className="flex h-[22px] min-w-[76px] items-center justify-center whitespace-nowrap rounded-full border border-black px-[10px] text-xs text-black"
            >
              {especialidade}
            </li>
          ))}
        </ul>

        <Link
          href={`/profissionais/${profissional.id}`}
          className="relative mx-auto mt-4 flex h-[51px] w-full max-w-[300px] items-center justify-center rounded-[21px] border border-brand bg-white text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white lg:mt-0"
        >
          <span className="-ml-[17px]">Ver perfil</span>
          <svg
            className="absolute right-[15px]"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 9h16M11 2l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
