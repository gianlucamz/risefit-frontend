"use client";

import { useState } from "react";
import { AlertaSucesso } from "./AcessoUI";
import { Botao, BotaoLink, Cartao, Divisor, LinhaInfo } from "./PainelUI";
import {
  assinaturaDemo,
  formatarMoeda,
  planosConta,
  planoPorId,
  type PlanoId,
} from "@/data/aluno";

// Comparação de planos + revisão da mudança. Só visual: nada é enviado.
export default function AlterarPlano() {
  const atual = planoPorId(assinaturaDemo.planoId);
  const [selecionado, setSelecionado] = useState<PlanoId>(
    planosConta.find((p) => p.id !== atual.id && p.preco > atual.preco)?.id ??
      atual.id,
  );
  const [ciente, setCiente] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const novo = planoPorId(selecionado);
  const mudou = novo.id !== atual.id;

  function escolher(id: PlanoId) {
    setSelecionado(id);
    setEnviado(false);
  }

  return (
    <>
      <div className="grid items-start gap-6 md:grid-cols-3">
        {planosConta.map((plano) => {
          const ehAtual = plano.id === atual.id;
          const ehSelecionado = plano.id === selecionado && !ehAtual;
          return (
            <Cartao key={plano.id} titulo={plano.nome} destaque={ehSelecionado}>
              <p className="text-2xl font-semibold text-brand">
                {formatarMoeda(plano.preco)}/mês
              </p>
              <p className="mt-4 min-h-12 border-b border-gray-200 pb-4 text-sm text-gray-500">
                {plano.descricao}
              </p>
              <p className="mt-4 text-xs text-gray-500">
                Consulte os benefícios e as condições detalhadas do plano.
              </p>
              <div className="mt-4">
                {ehAtual ? (
                  <Botao variante="secundario" larguraTotal disabled className="disabled:opacity-100">
                    Plano atual
                  </Botao>
                ) : (
                  <Botao
                    variante={ehSelecionado ? "primario" : "secundario"}
                    larguraTotal
                    aria-pressed={ehSelecionado}
                    onClick={() => escolher(plano.id)}
                  >
                    {ehSelecionado ? `${plano.nome} selecionado` : `Selecionar ${plano.nome}`}
                  </Botao>
                )}
              </div>
            </Cartao>
          );
        })}
      </div>

      <Cartao titulo="Revisão da mudança" className="mt-6">
        <div className="grid gap-x-10 md:grid-cols-2">
          <div>
            <p className="text-gray-500">Seu plano atual</p>
            <dl>
              <LinhaInfo rotulo={atual.nome} valor={`${formatarMoeda(atual.preco)}/mês`} />
            </dl>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500">Novo plano selecionado</p>
            <dl>
              <LinhaInfo
                rotulo={mudou ? novo.nome : "Nenhum"}
                valor={mudou ? `${formatarMoeda(novo.preco)}/mês` : "—"}
              />
            </dl>
          </div>
        </div>
        <Divisor />
        <dl>
          <LinhaInfo rotulo="Início da mudança" valor="A confirmar" />
          <LinhaInfo rotulo="Ajustes na cobrança" valor="A confirmar" />
        </dl>
        <p className="mt-3 text-sm text-gray-500">
          Consulte as condições antes de solicitar. Esta página não presume
          multas, carência ou uma nova cobrança.
        </p>
        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={ciente}
            onChange={(e) => setCiente(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-brand"
          />
          Li a comparação e desejo revisar as condições com a equipe.
        </label>

        {enviado && (
          <div className="mt-4">
            <AlertaSucesso>
              Solicitação de mudança para o plano {novo.nome} apresentada neste
              exemplo. A equipe confirmará as condições.
            </AlertaSucesso>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Botao disabled={!ciente || !mudou} onClick={() => setEnviado(true)}>
            Solicitar alteração de plano
          </Botao>
          <BotaoLink href="/minha-conta" variante="secundario">
            Manter plano atual
          </BotaoLink>
        </div>
      </Cartao>
    </>
  );
}
