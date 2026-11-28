"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import ProfissionalCard from "./ProfissionalCard";
import { Botao, IconeAlerta, IconeBusca, PainelEstado } from "./PainelUI";
import {
  mapearProfissionalAPI,
  OBJETIVOS_PROFISSIONAIS,
  obterProfissionaisAPI,
  type ObjetivoId,
  type Profissional,
} from "@/services/api";

type Ordem = "relevancia" | "nome";

const stroke = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// Ícones dos objetivos
const icones: Record<ObjetivoId, ReactNode> = {
  musculo: (
    <svg {...stroke}>
      <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />
    </svg>
  ),
  emagrecer: (
    <svg {...stroke}>
      <path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" />
    </svg>
  ),
  condicionamento: (
    <svg {...stroke}>
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </svg>
  ),
  lesao: (
    <svg {...stroke}>
      <path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z" />
    </svg>
  ),
  alimentacao: (
    <svg {...stroke}>
      <path d="M12 7c-2-2-6-1-6 4 0 4 2 9 6 9s6-5 6-9c0-5-4-6-6-4zM12 7c0-2 1-3 3-4" />
    </svg>
  ),
};

export default function ProfissionaisExplorar({
  profissionaisIniciais = [],
  erroInicial = false,
}: {
  profissionaisIniciais?: Profissional[];
  erroInicial?: boolean;
}) {
  const [listaProfissionais, setListaProfissionais] = useState<Profissional[]>(
    profissionaisIniciais,
  );
  const [carregando, setCarregando] = useState(
    erroInicial && profissionaisIniciais.length === 0,
  );
  const [erro, setErro] = useState(false);

  const [objetivo, setObjetivo] = useState<ObjetivoId | null>(null);
  const [busca, setBusca] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [ordem, setOrdem] = useState<Ordem>("relevancia");

  const carregarProfissionais = useCallback(async () => {
    setCarregando(true);
    setErro(false);
    try {
      const dados = await obterProfissionaisAPI();
      setListaProfissionais(
        Array.isArray(dados) ? dados.map(mapearProfissionalAPI) : [],
      );
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (!erroInicial && profissionaisIniciais.length > 0) return;

    const timer = setTimeout(() => {
      void carregarProfissionais();
    }, 0);

    return () => clearTimeout(timer);
  }, [erroInicial, profissionaisIniciais.length, carregarProfissionais]);

  // Lista de especialidades vem dos próprios dados
  const especialidades = useMemo(
    () =>
      Array.from(
        new Set(listaProfissionais.flatMap((p) => p.especialidades)),
      ).sort(),
    [listaProfissionais],
  );

  const resultado = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const lista = listaProfissionais.filter(
      (p) =>
        (!termo || p.nome.toLowerCase().includes(termo)) &&
        (!especialidade || p.especialidades.includes(especialidade)) &&
        (!objetivo || p.objetivos.includes(objetivo)),
    );

    if (ordem === "nome") lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    return lista;
  }, [listaProfissionais, busca, especialidade, objetivo, ordem]);

  const campo =
    "h-11 bg-transparent px-3 text-sm text-dark outline-none";

  return (
    <>
      {/* ---------- SEU OBJETIVO ---------- */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14 lg:px-14 lg:py-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Seu objetivo</p>
            <h2 className="mt-2 text-3xl font-extrabold text-dark">Qual é o seu objetivo?</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600">
              Escolha qual é o principal objetivo para combinar com você e veja os
              profissionais indicados para você.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {OBJETIVOS_PROFISSIONAIS.map((item) => {
              const ativo = objetivo === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => setObjetivo(ativo ? null : item.id)}
                  className={`flex h-full min-h-[112px] flex-col items-center justify-center gap-3 rounded-xl border bg-white px-3 py-4 text-center text-xs font-semibold leading-snug ${
                    ativo ? "border-brand text-brand" : "border-gray-200 text-dark"
                  }`}
                >
                  <span className="text-brand">{icones[item.id]}</span>
                  {item.rotulo.join(" ")}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-14 lg:py-12">
        {/* ---------- BUSCA E FILTROS ---------- */}
        <div className="flex flex-col gap-1 rounded-2xl border border-gray-200 bg-white p-1.5 md:flex-row md:items-center">
          <label className="flex flex-1 items-center gap-2 px-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome..."
              aria-label="Buscar profissional por nome"
              className={`${campo} w-full px-0`}
            />
          </label>

          <select
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            aria-label="Filtrar por especialidade"
            className={`${campo} border-t border-gray-200 md:border-l md:border-t-0`}
          >
            <option value="">Todas as especialidades</option>
            {especialidades.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <select
            value={ordem}
            onChange={(e) => setOrdem(e.target.value as Ordem)}
            aria-label="Ordenar profissionais"
            className={`${campo} border-t border-gray-200 md:border-l md:border-t-0`}
          >
            <option value="relevancia">Ordenar: relevância</option>
            <option value="nome">Nome (A–Z)</option>
          </select>
        </div>

        {/* ---------- LISTAGEM ---------- */}
        <section id="profissionais" className="scroll-mt-28 pt-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">
            Profissionais disponíveis
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-dark">Conheça nossos profissionais</h2>

          {carregando ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[462px] animate-pulse rounded-xl border border-gray-200 bg-white"
                />
              ))}
            </div>
          ) : erro ? (
            <div className="mx-auto mt-8 max-w-xl">
              <PainelEstado
                icone={<IconeAlerta />}
                titulo="Não foi possível carregar os profissionais"
                descricao="Verifique sua conexão com o servidor e tente novamente."
              >
                <Botao
                  variante="secundario"
                  larguraTotal
                  onClick={() => void carregarProfissionais()}
                >
                  Tentar novamente
                </Botao>
              </PainelEstado>
            </div>
          ) : resultado.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resultado.map((p) => (
                <ProfissionalCard key={p.id} profissional={p} />
              ))}
            </div>
          ) : listaProfissionais.length === 0 ? (
            <div className="mx-auto mt-8 max-w-xl">
              <PainelEstado
                icone={<IconeBusca />}
                titulo="Nenhum profissional cadastrado"
                descricao="Ainda não há profissionais disponíveis no catálogo no momento."
              />
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-xl">
              <PainelEstado
                icone={<IconeBusca />}
                titulo="Nenhum resultado encontrado"
                descricao="Não encontramos profissionais para esta busca. Tente outro nome ou revise os filtros."
              >
                <Botao
                  variante="secundario"
                  larguraTotal
                  onClick={() => {
                    setBusca("");
                    setEspecialidade("");
                    setObjetivo(null);
                  }}
                >
                  Limpar busca e filtros
                </Botao>
              </PainelEstado>
            </div>
          )}
        </section>
      </div>
    </>
  );
}