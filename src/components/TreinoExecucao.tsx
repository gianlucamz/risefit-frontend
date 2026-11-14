"use client";

import { useState } from "react";
import type { Treino } from "@/data/aluno";
import { Botao, BotaoLink, Cartao, IconeCheck } from "./PainelUI";

// Tela do treino em andamento: exercício atual, como executar e registro das séries.
// Estado só visual (nada é salvo) até existir a API de treinos.
export default function TreinoExecucao({
  treino,
  indiceInicial = 0,
}: {
  treino: Treino;
  indiceInicial?: number;
}) {
  const total = treino.exercicios.length;
  const [atual, setAtual] = useState(indiceInicial);
  // series[exercicio][serie] = concluída?
  const [series, setSeries] = useState<boolean[][]>(() =>
    treino.exercicios.map((e) =>
      Array.from({ length: e.series }, () => treino.status === "concluido"),
    ),
  );
  const [treinoConcluido, setTreinoConcluido] = useState(
    treino.status === "concluido",
  );

  const exercicio = treino.exercicios[atual];
  const seriesAtuais = series[atual];
  const exercicioCompleto = seriesAtuais.every(Boolean);
  const exerciciosCompletos = series.filter((s) => s.every(Boolean)).length;

  function alternarSerie(indice: number) {
    setSeries((anterior) =>
      anterior.map((lista, i) =>
        i === atual ? lista.map((v, j) => (j === indice ? !v : v)) : lista,
      ),
    );
  }

  function concluirExercicio() {
    setSeries((anterior) =>
      anterior.map((lista, i) => (i === atual ? lista.map(() => true) : lista)),
    );
    if (atual < total - 1) setAtual(atual + 1);
  }

  if (treinoConcluido && treino.status !== "concluido") {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <span className="inline-flex text-brand">
          <IconeCheck />
        </span>
        <p className="mt-4 text-2xl font-semibold text-dark">Treino concluído!</p>
        <p className="mt-3 text-sm text-gray-500">
          Você registrou {exerciciosCompletos} de {total} exercícios neste exemplo.
          Nenhum dado foi salvo.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <BotaoLink href="/area-aluno/historico">Ver histórico</BotaoLink>
          <BotaoLink href="/area-aluno/treinos" variante="secundario">
            Voltar aos treinos
          </BotaoLink>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[1.75fr_1fr]">
        <Cartao titulo={exercicio.nome}>
          <p className="text-sm text-gray-500">
            Exercício {atual + 1} de {total}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-6 border-b border-gray-200 pb-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Séries</dt>
              <dd className="font-semibold text-dark">{exercicio.series}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Repetições</dt>
              <dd className="font-semibold text-dark">{exercicio.repeticoes}</dd>
            </div>
          </dl>

          <h3 className="mt-6 text-xl font-semibold text-dark">Como executar</h3>
          <p className="mt-4 text-dark">{exercicio.comoExecutar}</p>
          <p className="mt-4 border-b border-gray-200 pb-4 text-xs text-gray-500 lg:text-sm">
            Respeite a orientação do seu profissional para apoio, carga e
            intervalo. Se sentir desconforto, interrompa o exercício e peça
            orientação.
          </p>

          <h3 className="mt-6 text-xl font-semibold text-dark">Registrar séries</h3>
          <ul className="mt-4 space-y-2">
            {seriesAtuais.map((feita, i) => {
              const id = `serie-${atual}-${i}`;
              return (
                <li key={id} className="flex items-center justify-between gap-4 text-sm">
                  <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-gray-500">
                    <input
                      id={id}
                      type="checkbox"
                      checked={feita}
                      onChange={() => alternarSerie(i)}
                      className="h-4 w-4 cursor-pointer accent-brand"
                    />
                    <span className={feita ? "text-dark line-through decoration-brand/60" : ""}>
                      {i + 1}ª série • {exercicio.repeticoes} repetições
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alternarSerie(i)}
                    className="cursor-pointer font-medium text-brand hover:underline"
                  >
                    {feita ? "Desmarcar" : "Marcar concluída"}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-5">
            <Botao larguraTotal onClick={concluirExercicio} disabled={exercicioCompleto && atual === total - 1}>
              {exercicioCompleto ? "Exercício concluído" : "Marcar exercício como concluído"}
            </Botao>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Estado visual de registro; nenhum dado será salvo.
          </p>
        </Cartao>

        <Cartao titulo="Exercícios do treino">
          <ol className="divide-y divide-gray-200 border-b border-gray-200">
            {treino.exercicios.map((e, i) => {
              const ativo = i === atual;
              const completo = series[i].every(Boolean);
              return (
                <li key={e.nome}>
                  <button
                    type="button"
                    onClick={() => setAtual(i)}
                    aria-current={ativo ? "step" : undefined}
                    className="w-full cursor-pointer py-3 text-left"
                  >
                    <span
                      className={`flex items-center gap-2 font-semibold ${
                        ativo ? "text-brand" : "text-dark hover:text-brand"
                      }`}
                    >
                      {i + 1}. {e.nome}
                      {completo && (
                        <IconeCheck className="h-4 w-4 text-brand" />
                      )}
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      {e.series} séries • {e.repeticoes} repetições
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </Cartao>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <BotaoLink href="/area-aluno/treinos" variante="secundario">
          Voltar aos treinos
        </BotaoLink>
        {treino.status !== "concluido" && (
          <Botao onClick={() => setTreinoConcluido(true)}>Concluir treino</Botao>
        )}
      </div>
    </>
  );
}
