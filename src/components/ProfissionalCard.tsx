"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Profissional } from "@/services/api";

export default function ProfissionalCard({ profissional }: { profissional: Profissional }) {
  const [fotoFalhou, setFotoFalhou] = useState(false);

  const mostrarIniciais = fotoFalhou || !profissional.foto;
  const iniciais = profissional.nome
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("");

  return (
    <article className="flex flex-col bg-white pb-2.5 lg:h-115.5">
      <div className="relative h-45 shrink-0 bg-dark sm:h-50 lg:h-45">
        {mostrarIniciais ? (
          <div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-brand">
            {iniciais}
          </div>
        ) : (
          <Image
            src={profissional.foto}
            alt={`Foto de ${profissional.nome}`}
            fill
            unoptimized={profissional.foto.startsWith("data:")}
            sizes="(min-width: 1024px) 376px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: profissional.fotoPosicao ?? "50% 50%" }}
            onError={() => setFotoFalhou(true)}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 lg:px-0">
        <h3 className="mt-6 text-[26px] font-semibold leading-none text-black lg:ml-5.25 lg:mt-6 lg:text-[30px]">
          {profissional.nome}
        </h3>

        <p className="mt-4.25 text-xs font-semibold uppercase tracking-wide text-brand lg:ml-5.5">
          {profissional.perfil.cargo}
        </p>

        <p className="mt-4.5 text-sm leading-4.75 text-black lg:ml-6.25 lg:mr-3.5">
          {profissional.descricao}
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-2 lg:mt-auto lg:pb-3.5">
          {profissional.especialidades.map((especialidade) => (
            <li
              key={especialidade}
              className="flex h-5.5 min-w-19 items-center justify-center whitespace-nowrap rounded-full border border-black px-2.5 text-xs text-black"
            >
              {especialidade}
            </li>
          ))}
        </ul>

        <Link
          href={`/profissionais/${profissional.id}`}
          className="relative mx-auto mt-4 flex h-12.75 w-full max-w-75 items-center justify-center rounded-[21px] border border-brand bg-white text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white lg:mt-0"
        >
          <span className="-ml-4.25">Ver perfil</span>
          <svg
            className="absolute right-3.75"
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
