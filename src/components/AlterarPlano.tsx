"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertaErro, AlertaSucesso } from "./AcessoUI";
import { Botao, BotaoLink, Cartao, Divisor, LinhaInfo } from "./PainelUI";
import { formatarMoeda, planosConta } from "@/data/aluno";
import {
  obterUsuarioAPI,
  obterPlanosAPI,
  atualizarAssinaturaAPI,
  criarAssinaturaAPI,
  atualizarUsuarioAPI,
  type PlanoDetalhes,
  type UsuarioDetalhes,
} from "@/services/api";
import { salvarSessao, useUsuarioLogado } from "@/lib/sessao";

export default function AlterarPlano() {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();

  const [planos, setPlanos] = useState<
    { id: number | string; nome: string; preco: number; descricao: string }[]
  >([]);
  const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);
  const [planoAtualId, setPlanoAtualId] = useState<number | string | null>(null);
  const [selecionado, setSelecionado] = useState<number | string | null>(null);

  const [ciente, setCiente] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const sessaoStorage =
      typeof window !== "undefined"
        ? localStorage.getItem("usuario") || sessionStorage.getItem("usuario")
        : null;

    if (!sessaoStorage && !usuarioSessao) {
      router.push("/login");
      return;
    }

    const id =
      usuarioSessao?.id ||
      (sessaoStorage ? JSON.parse(sessaoStorage).id : null);

    if (!id) {
      setCarregando(false);
      return;
    }

    let ativo = true;

    async function inicializar() {
      try {
        const [dadosUsuario, dadosPlanos] = await Promise.allSettled([
          obterUsuarioAPI(id),
          obterPlanosAPI(),
        ]);

        if (!ativo) return;

        let listaPlanos: {
          id: number | string;
          nome: string;
          preco: number;
          descricao: string;
        }[] = [];

        if (
          dadosPlanos.status === "fulfilled" &&
          Array.isArray(dadosPlanos.value) &&
          dadosPlanos.value.length > 0
        ) {
          listaPlanos = dadosPlanos.value.map((p: PlanoDetalhes) => ({
            id: p.id,
            nome: p.nome,
            preco: Number(p.preco),
            descricao:
              p.descricao ||
              "Acesso completo aos treinos e acompanhamento da plataforma.",
          }));
        } else {
          listaPlanos = planosConta;
        }

        setPlanos(listaPlanos);

        if (dadosUsuario.status === "fulfilled") {
          setUsuario(dadosUsuario.value);
          const assinatura = dadosUsuario.value.assinaturas?.[0];
          const idAtual = assinatura?.planoId ?? listaPlanos[0]?.id;
          setPlanoAtualId(idAtual);
          const proximo =
            listaPlanos.find((p) => p.id !== idAtual)?.id ?? idAtual;
          setSelecionado(proximo);
        } else {
          setPlanoAtualId(listaPlanos[0]?.id ?? null);
          setSelecionado(listaPlanos[1]?.id ?? listaPlanos[0]?.id ?? null);
        }
      } catch (err) {
        console.error("Erro ao carregar planos:", err);
        setPlanos(planosConta);
        setPlanoAtualId(planosConta[0].id);
        setSelecionado(planosConta[1].id);
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    inicializar();

    return () => {
      ativo = false;
    };
  }, [usuarioSessao, router]);

  const planoAtual =
    planos.find((p) => String(p.id) === String(planoAtualId)) || planos[0];
  const novoPlano =
    planos.find((p) => String(p.id) === String(selecionado)) || planoAtual;
  const mudou =
    novoPlano && planoAtual && String(novoPlano.id) !== String(planoAtual.id);

  function escolher(id: number | string) {
    setSelecionado(id);
    setSucesso(false);
    setErro("");
  }

  async function handleConfirmarMudanca() {
    if (!novoPlano || !mudou) return;

    setSalvando(true);
    setSucesso(false);
    setErro("");

    try {
      const assinatura = usuario?.assinaturas?.[0];

      if (assinatura && typeof novoPlano.id === "number") {
        await atualizarAssinaturaAPI(assinatura.id, {
          planoId: novoPlano.id,
        });
      }

      setPlanoAtualId(novoPlano.id);
      setSucesso(true);
    } catch (e) {
      setErro(
        e instanceof Error
          ? e.message
          : "Não foi possível alterar o plano. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex items-center gap-3 text-brand">
          <svg
            className="h-6 w-6 animate-spin text-brand"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-sm font-semibold text-gray-600">
            Carregando planos disponíveis...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid items-start gap-6 md:grid-cols-3">
        {planos.map((plano) => {
          const ehAtual = String(plano.id) === String(planoAtualId);
          const ehSelecionado =
            String(plano.id) === String(selecionado) && !ehAtual;

          return (
            <Cartao
              key={plano.id}
              titulo={plano.nome}
              destaque={ehSelecionado}
            >
              <p className="text-[26px] font-semibold text-brand sm:text-2xl">
                {formatarMoeda(plano.preco)}/mês
              </p>
              <p className="mt-4 min-h-12 border-b border-gray-200 pb-4 text-[15px] text-gray-500 sm:text-sm">
                {plano.descricao}
              </p>
              <p className="mt-4 text-xs text-gray-500">
                Acesso aos treinos e acompanhamento contínuo.
              </p>
              <div className="mt-4">
                {ehAtual ? (
                  <Botao
                    variante="secundario"
                    larguraTotal
                    disabled
                    className="disabled:opacity-100"
                  >
                    Plano atual
                  </Botao>
                ) : (
                  <Botao
                    variante={ehSelecionado ? "primario" : "secundario"}
                    larguraTotal
                    aria-pressed={ehSelecionado}
                    onClick={() => escolher(plano.id)}
                  >
                    {ehSelecionado
                      ? `${plano.nome} selecionado`
                      : `Selecionar ${plano.nome}`}
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
              <LinhaInfo
                rotulo={planoAtual ? planoAtual.nome : "Nenhum"}
                valor={
                  planoAtual ? `${formatarMoeda(planoAtual.preco)}/mês` : "—"
                }
              />
            </dl>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500">Novo plano selecionado</p>
            <dl>
              <LinhaInfo
                rotulo={mudou && novoPlano ? novoPlano.nome : "Nenhum"}
                valor={
                  mudou && novoPlano
                    ? `${formatarMoeda(novoPlano.preco)}/mês`
                    : "—"
                }
              />
            </dl>
          </div>
        </div>
        <Divisor />
        <dl>
          <LinhaInfo rotulo="Início da mudança" valor="Imediato" />
          <LinhaInfo
            rotulo="Ajustes na cobrança"
            valor="Atualizado na próxima fatura"
          />
        </dl>
        <p className="mt-3 text-sm text-gray-500">
          A alteração do plano entrará em vigor imediatamente para o seu usuário.
        </p>
        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={ciente}
            onChange={(e) => setCiente(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-brand"
          />
          Estou ciente da mudança para o plano selecionado.
        </label>

        {erro && (
          <div className="mt-4">
            <AlertaErro>{erro}</AlertaErro>
          </div>
        )}

        {sucesso && (
          <div className="mt-4">
            <AlertaSucesso>
              Seu plano foi alterado para {novoPlano?.nome} com sucesso!
            </AlertaSucesso>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-3">
          <Botao
            disabled={!ciente || !mudou || salvando}
            onClick={handleConfirmarMudanca}
          >
            {salvando ? "Alterando plano..." : "Confirmar alteração de plano"}
          </Botao>
          <BotaoLink href="/minha-conta" variante="secundario">
            Manter plano atual
          </BotaoLink>
        </div>
      </Cartao>
    </>
  );
}
