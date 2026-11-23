"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AlertaErro, AlertaSucesso } from "./AcessoUI";
import { Botao, BotaoLink, Cartao, Divisor, LinhaInfo } from "./PainelUI";
import { formatarMoeda, planosConta } from "@/data/aluno";
import {
  obterUsuarioAPI,
  obterPlanosAPI,
  atualizarAssinaturaAPI,
  criarAssinaturaAPI,
  type PlanoDetalhes,
  type UsuarioDetalhes,
} from "@/services/api";
import { salvarSessao, useUsuarioLogado } from "@/lib/sessao";

const subscribeVazio = () => () => {};

export default function AlterarPlano() {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();

  const [planos, setPlanos] = useState<
    { id: number | string; nome: string; preco: number; descricao: string }[]
  >([]);
  const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);
  const [planoAtualId, setPlanoAtualId] = useState<number | string | null>(
    null,
  );
  const [selecionado, setSelecionado] = useState<number | string | null>(null);
  const [idCarregado, setIdCarregado] = useState<string | number | null>(null);

  const [ciente, setCiente] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const montado = useSyncExternalStore(
    subscribeVazio,
    () => true,
    () => false,
  );

  let sessaoId: string | number | null = null;
  if (montado) {
    const raw =
      localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    if (raw) {
      try {
        sessaoId = JSON.parse(raw).id ?? null;
      } catch {
        sessaoId = null;
      }
    }
  }

  const usuarioId = montado ? (usuarioSessao?.id ?? sessaoId) : null;
  const carregando =
    !montado || Boolean(usuarioId && idCarregado !== usuarioId);

  useEffect(() => {
    if (!montado) return;

    const temSessao =
      Boolean(usuarioId) ||
      Boolean(localStorage.getItem("usuario")) ||
      Boolean(sessionStorage.getItem("usuario"));

    if (!temSessao) {
      router.push("/login");
      return;
    }

    if (!usuarioId) return;

    let ativo = true;

    async function inicializar() {
      try {
        const [dadosUsuario, dadosPlanos] = await Promise.allSettled([
          obterUsuarioAPI(usuarioId!),
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
        setSelecionado(null);

        if (dadosUsuario.status === "fulfilled") {
          setUsuario(dadosUsuario.value);
          const assinaturaAtiva = dadosUsuario.value.assinaturas?.find(
            (a) => a.status === "ATIVA",
          );
          setPlanoAtualId(assinaturaAtiva?.planoId ?? null);
        } else {
          setPlanoAtualId(null);
        }
      } catch (err) {
        console.error("Erro ao carregar planos:", err);
        if (!ativo) return;
        setPlanos(planosConta);
        setPlanoAtualId(null);
        setSelecionado(null);
      } finally {
        if (ativo) {
          setIdCarregado(usuarioId);
        }
      }
    }

    inicializar();

    return () => {
      ativo = false;
    };
  }, [montado, usuarioId, router]);

  const planoAtual =
    planoAtualId !== null
      ? planos.find((p) => String(p.id) === String(planoAtualId)) || null
      : null;
  const novoPlano =
    selecionado !== null
      ? planos.find((p) => String(p.id) === String(selecionado)) || null
      : null;
  const mudou =
    Boolean(novoPlano) &&
    (!planoAtual || String(novoPlano!.id) !== String(planoAtual.id));

  function escolher(id: number | string) {
    setSelecionado(id);
    setSucesso(false);
    setErro("");
  }

  async function handleConfirmarMudanca() {
    if (!novoPlano || !mudou || salvando) return;

    setSalvando(true);
    setSucesso(false);
    setErro("");

    try {
      const idFinal = Number(usuario?.id ?? usuarioId);

      if (!idFinal) {
        throw new Error("Usuário não identificado. Faça login novamente.");
      }

      const planoIdNumerico = Number(novoPlano.id);
      const assinaturaAtiva = usuario?.assinaturas?.find(
        (a) => a.status === "ATIVA",
      );

      if (assinaturaAtiva) {
        await atualizarAssinaturaAPI(assinaturaAtiva.id, {
          planoId: planoIdNumerico,
          status: "ATIVA",
        });
      } else {
        await criarAssinaturaAPI({
          usuarioId: idFinal,
          planoId: planoIdNumerico,
          status: "ATIVA",
        });
      }

      const dadosAtualizados = await obterUsuarioAPI(idFinal);
      setUsuario(dadosAtualizados);
      setPlanoAtualId(planoIdNumerico);
      setSelecionado(null);

      const persistir = Boolean(localStorage.getItem("usuario"));
      salvarSessao(
        {
          ...(usuarioSessao || {}),
          ...dadosAtualizados,
          cpf: dadosAtualizados.cpf ?? undefined,
          sexo: dadosAtualizados.sexo ?? undefined,
          plano: undefined,
          planoId: undefined,
        },
        undefined,
        persistir,
      );

      setSucesso(true);
      setCiente(false);
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
          const ehAtual =
            planoAtualId !== null && String(plano.id) === String(planoAtualId);
          const ehSelecionado =
            selecionado !== null &&
            String(plano.id) === String(selecionado) &&
            !ehAtual;

          return (
            <Cartao key={plano.id} titulo={plano.nome} destaque={ehSelecionado}>
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
                rotulo={planoAtual ? planoAtual.nome : "Sem plano ativo"}
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
          {planoAtual
            ? "A alteração do plano entrará em vigor imediatamente para o seu usuário."
            : "A contratação do plano entrará em vigor imediatamente para o seu usuário."}
        </p>
        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={ciente}
            onChange={(e) => setCiente(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-brand"
          />
          {planoAtual
            ? "Estou ciente da mudança para o plano selecionado."
            : "Estou ciente da contratação do plano selecionado."}
        </label>

        {erro && (
          <div className="mt-4">
            <AlertaErro>{erro}</AlertaErro>
          </div>
        )}

        {sucesso && (
          <div className="mt-4">
            <AlertaSucesso>
              {planoAtual
                ? `Seu plano foi atualizado para ${planoAtual.nome} com sucesso!`
                : "Plano contratado com sucesso!"}
            </AlertaSucesso>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-3">
          <Botao
            disabled={!ciente || !mudou || salvando}
            onClick={handleConfirmarMudanca}
          >
            {salvando
              ? "Processando..."
              : planoAtual
                ? "Confirmar alteração de plano"
                : "Confirmar contratação do plano"}
          </Botao>
          <BotaoLink href="/minha-conta" variante="secundario">
            Voltar para minha conta
          </BotaoLink>
        </div>
      </Cartao>
    </>
  );
}
