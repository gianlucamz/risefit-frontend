"use client";

import Image from "next/image";
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
        <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* Foto (proporção igual em todos os cartões) */}
            <div className="relative aspect-[4/3] bg-dark">
                {fotoFalhou ? (
                    <div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-brand">
                        {iniciais}
                    </div>
                ) : (
                    <Image
                        src={profissional.foto}
                        alt={`Foto de ${profissional.nome}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        onError={() => setFotoFalhou(true)}
                    />
                )}
            </div>

            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-extrabold text-dark">{profissional.nome}</h3>

                {/* Avaliação */}
                <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-brand" aria-hidden="true">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="font-bold text-dark">{nota}</span>
                    <span className="text-gray-500">({profissional.avaliacoes} avaliações)</span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">{profissional.descricao}</p>

                {/* Etiquetas */}
                <ul className="mt-4 flex flex-wrap gap-2">
                    {profissional.especialidades.map((especialidade) => (
                        <li
                            key={especialidade}
                            className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand"
                        >
                            {especialidade}
                        </li>
                    ))}
                </ul>

                {/* Ainda não existe página de perfil: o botão fica pronto para receber a rota depois */}
                <button
                    type="button"
                    className="relative mt-6 flex w-full items-center justify-center rounded-xl border border-brand bg-white  px-5 py-3 font-semibold text-brand"
                >
                    Ver perfil
                    <svg
                        className="absolute right-5"
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </button>
            </div>
        </article>
    );
}