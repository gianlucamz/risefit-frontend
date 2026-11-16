"use client";

import { useState } from "react";
import type { PerfilProfissional } from "@/data/profissionais";

type Depoimento = PerfilProfissional["depoimentos"][number];

// Bloco "Avaliações" do perfil. O comentário fica só nesta tela (nada é enviado ao servidor).
export default function AvaliacoesProfissional({
  depoimentos,
}: {
  depoimentos: Depoimento[];
}) {
  const [lista, setLista] = useState(depoimentos);
  const [comentario, setComentario] = useState("");

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const texto = comentario.trim();
    if (!texto) return;
    setLista((atual) => [...atual, { nome: "Você", nota: 5, texto }]);
    setComentario("");
  }

  return (
    <section className="flex flex-col border-b border-[#e3e7ec] p-5 lg:border-r lg:border-b-0 lg:pt-9 lg:pr-5 lg:pb-9 lg:pl-5">
      <h2 className="text-[17px] font-bold text-dark">Avaliações</h2>

      <ul className="mt-5 space-y-5">
        {lista.map((d, i) => (
          <li key={`${d.nome}-${i}`}>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#efe9fe] text-xs font-bold text-brand"
              >
                {d.nome
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div>
                <p className="text-[12.5px] font-semibold text-dark">{d.nome}</p>
                <p className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span className="text-[13px] leading-none tracking-[1px] text-brand" aria-hidden="true">
                    {"★".repeat(d.nota)}
                  </span>
                  <span className="sr-only">Nota </span>
                  {d.nota.toFixed(1).replace(".", ",")}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-[18px] text-gray-700">{d.texto}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={enviar} className="mt-8 flex items-center gap-2 lg:mt-auto lg:pt-8">
        <span
          aria-hidden="true"
          className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-[#26283c] text-[10px] font-bold text-white"
        >
          Eu
        </span>
        <label htmlFor="comentario-profissional" className="sr-only">
          Deixe seu comentário
        </label>
        <input
          id="comentario-profissional"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Deixe seu comentário..."
          className="h-7.5 min-w-0 flex-1 rounded-full bg-[#eef0f3] px-3 text-[11px] text-dark placeholder:text-gray-400 focus:ring-2 focus:ring-brand/30 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Enviar comentário"
          className="flex h-6.5 w-6.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#a78bfa] text-white transition-colors hover:bg-brand"
        >
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 11V1M1 5l4-4 4 4" />
          </svg>
        </button>
      </form>
    </section>
  );
}
