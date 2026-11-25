"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  Botao,
  BotaoLink,
  Cartao,
  IconeAlerta,
  LinhaInfo,
  Selo,
} from "@/components/PainelUI";
import { formatarMoeda } from "@/data/aluno";
import {
  useUsuarioLogado,
  mascararCPF,
  mascararTelefone,
  salvarSessao,
} from "@/lib/sessao";
import {
  cancelarAssinaturaAPI,
  obterUsuarioAPI,
  type UsuarioDetalhes,
} from "@/services/api";

const subscribeVazio = () => () => {};

interface PlanoExibicao {
  id?: number;
  nome: string;
  descricao?: string | null;
  preco: string | number;
  duracaoMeses?: number;
}

export default function MinhaContaPage() {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();
  const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);
  const [idCarregado, setIdCarregado] = useState<string | number | null>(null);
  const [desistindoCancelamento, setDesistindoCancelamento] = useState(false);

  const montado = useSyncExternalStore(
    subscribeVazio,
    () => true,
    () => false,
  );

  let sessaoObj: Record<string, unknown> | null = null;
  if (montado) {
    const raw =
      localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    if (raw) {
      try {
        sessaoObj = JSON.parse(raw);
      } catch {
        sessaoObj = null;
      }
    }
  }

  const usuarioId = montado
    ? ((usuarioSessao?.id ?? sessaoObj?.id) as string | number | undefined)
    : undefined;

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

    async function carregarDados() {
      try {
        const dados = await obterUsuarioAPI(usuarioId!);
        if (!ativo) return;

        setUsuario(dados);

        const persistir = Boolean(localStorage.getItem("usuario"));
        salvarSessao(
          {
            ...(sessaoObj || {}),
            ...dados,
            cpf: dados.cpf ?? undefined,
            sexo: dados.sexo ?? undefined,
            plano: undefined,
            planoId: undefined,
          },
          undefined,
          persistir,
        );
      } catch (erro) {
        console.error("Erro ao carregar dados do usuário:", erro);
      } finally {
        if (ativo) {
          setIdCarregado(usuarioId!);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [montado, usuarioId, router]);

  const nomeExibicao =
    usuario?.nome ||
    (usuarioSessao?.nome as string) ||
    (sessaoObj?.nome as string) ||
    "Aluno RiseFit";
  const emailExibicao =
    usuario?.email ||
    (usuarioSessao?.email as string) ||
    (sessaoObj?.email as string) ||
    "—";
  const cpfExibicao = mascararCPF(
    usuario?.cpf ||
      (usuarioSessao?.cpf as string) ||
      (sessaoObj?.cpf as string),
  );
  const telefoneExibicao = mascararTelefone(
    usuario?.telefone ||
      (usuarioSessao?.telefone as string) ||
      (sessaoObj?.telefone as string),
  );

  const assinaturasDisponiveis = usuario
    ? usuario.assinaturas || []
    : (usuarioSessao?.assinaturas as UsuarioDetalhes["assinaturas"]) ||
      (sessaoObj?.assinaturas as UsuarioDetalhes["assinaturas"]) ||
      [];

  const assinaturaAtiva =
    assinaturasDisponiveis.find((a) => a.status === "ATIVA") || null;
  const assinaturaPendente =
    assinaturasDisponiveis.find((a) => a.status === "PENDENTE") || null;
  const assinaturaExibida = assinaturaAtiva || assinaturaPendente;
  const apenasPendente = !assinaturaAtiva && Boolean(assinaturaPendente);
  const cancelamentoPendente = Boolean(
    assinaturaAtiva &&
    assinaturaPendente &&
    assinaturaAtiva.planoId === assinaturaPendente.planoId,
  );
  const trocaPendente = Boolean(
    assinaturaAtiva &&
    assinaturaPendente &&
    assinaturaAtiva.planoId !== assinaturaPendente.planoId,
  );

  async function handleDesistirCancelamento() {
    if (!assinaturaPendente || !usuarioId || desistindoCancelamento) return;
    setDesistindoCancelamento(true);
    try {
      await cancelarAssinaturaAPI(assinaturaPendente.id);
      const dados = await obterUsuarioAPI(usuarioId);
      setUsuario(dados);
      const persistir = Boolean(localStorage.getItem("usuario"));
      salvarSessao(
        {
          ...(sessaoObj || {}),
          ...dados,
          cpf: dados.cpf ?? undefined,
          sexo: dados.sexo ?? undefined,
          plano: undefined,
          planoId: undefined,
        },
        undefined,
        persistir,
      );
    } catch (erro) {
      console.error("Erro ao cancelar solicitação pendente:", erro);
    } finally {
      setDesistindoCancelamento(false);
    }
  }

  const plano: PlanoExibicao | null = assinaturaExibida?.plano || null;

  const situacaoPlano = cancelamentoPendente
    ? "Cancelamento pendente"
    : assinaturaAtiva
      ? "Ativo"
      : assinaturaPendente
        ? "Pendente"
        : "Sem plano";

  const dataFimFormatada = apenasPendente
    ? "Aguardando aprovação"
    : assinaturaAtiva?.dataFim
      ? new Date(assinaturaAtiva.dataFim).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : plano
        ? "Renovação mensal contínua"
        : "—";

  return (
    <main className="bg-[#f8f8f8] px-6 py-10 lg:py-14">
      <div className="mx-auto max-w-300">
        <p className="text-sm font-medium text-brand">Minha conta</p>
        <h1 className="mt-3 text-[28px] leading-8.75 font-bold tracking-tight text-dark lg:text-[44px] lg:leading-normal">
          Gerencie sua assinatura e informações
        </h1>
        <p className="mt-3 text-[15px] leading-5.75 text-gray-500 lg:text-base lg:leading-normal">
          Acompanhe seu plano, dados pessoais e opções de suporte em um só
          lugar.
        </p>

        {carregando ? (
          <div className="mt-8 flex items-center justify-center p-12">
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
                Carregando informações da conta...
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
            <Cartao
              titulo="Conta logada"
              className="flex h-full flex-col shadow-sm"
            >
              <dl>
                <LinhaInfo rotulo="Nome completo" valor={nomeExibicao} />
                <LinhaInfo rotulo="CPF" valor={cpfExibicao} />
                <LinhaInfo rotulo="E-mail" valor={emailExibicao} />
                <LinhaInfo rotulo="Telefone" valor={telefoneExibicao} />
              </dl>
              <div className="mt-auto flex flex-col gap-3 pt-4">
                <BotaoLink
                  href="/minha-conta/editar"
                  variante="secundario"
                  className="w-full justify-center"
                >
                  Editar dados
                </BotaoLink>
              </div>
            </Cartao>

            <Cartao
              titulo="Plano atual"
              acao={
                <Selo
                  tom={
                    apenasPendente || cancelamentoPendente ? "alerta" : "neutro"
                  }
                >
                  {situacaoPlano}
                </Selo>
              }
              className="flex h-full flex-col shadow-sm"
            >
              <p className="text-2xl font-semibold text-dark lg:text-3xl">
                {plano?.nome || "Sem plano ativo"}
              </p>
              <p className="mt-1 mb-3 text-sm text-gray-500">
                {apenasPendente
                  ? "Sua solicitação de plano está em análise e será ativada após a aprovação do administrador."
                  : plano?.descricao ||
                    "Assine um dos nossos planos para ter acesso aos treinos personalizados."}
              </p>
              <dl>
                <LinhaInfo
                  rotulo="Valor mensal"
                  valor={
                    plano?.preco ? formatarMoeda(Number(plano.preco)) : "—"
                  }
                  destaque
                />
                <LinhaInfo rotulo="Próxima cobrança" valor={dataFimFormatada} />
                <LinhaInfo
                  rotulo="Método"
                  valor={plano ? "Cartão de crédito / débito" : "Nenhum"}
                />
              </dl>
              {trocaPendente && assinaturaPendente && (
                <div className="mt-4 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Solicitação de troca para o plano{" "}
                    <strong>
                      {assinaturaPendente.plano?.nome ||
                        `#${assinaturaPendente.planoId}`}
                    </strong>{" "}
                    aguardando aprovação do administrador.
                  </span>
                  <Selo tom="alerta">Troca pendente</Selo>
                </div>
              )}
              <div className="mt-auto grid gap-3 pt-4 sm:grid-cols-2">
                <BotaoLink href="/minha-conta/plano">
                  {plano ? "Alterar plano" : "Escolher plano"}
                </BotaoLink>
                <BotaoLink href="/#planos" variante="secundario">
                  Detalhes dos planos
                </BotaoLink>
              </div>
            </Cartao>

            <Cartao
              titulo="Segurança da conta"
              acao={<Selo>Ativa</Selo>}
              className="shadow-sm"
            >
              <dl>
                <LinhaInfo rotulo="Autenticação" valor="Ativa e protegida" />
                <LinhaInfo
                  rotulo="Identificador"
                  valor={`ID #${usuario?.id || usuarioId || "—"}`}
                />
                <LinhaInfo
                  rotulo="Membro desde"
                  valor={
                    usuario?.criadoEm
                      ? new Date(usuario.criadoEm).toLocaleDateString("pt-BR", {
                          month: "long",
                          year: "numeric",
                        })
                      : "2026"
                  }
                />
              </dl>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <BotaoLink href="/minha-conta/seguranca" variante="secundario">
                  Alterar senha
                </BotaoLink>
                <BotaoLink
                  href="/minha-conta/seguranca#historico"
                  variante="secundario"
                >
                  Segurança e acessos
                </BotaoLink>
              </div>
            </Cartao>

            <Cartao
              titulo="Suporte"
              acao={<Selo>Atendimento</Selo>}
              className="shadow-sm"
            >
              <dl>
                <LinhaInfo rotulo="Central de ajuda" valor="Disponível" />
                <LinhaInfo rotulo="Horário" valor="08:00 às 20:00" />
                <LinhaInfo rotulo="Canal" valor="Formulário de contato" />
              </dl>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <BotaoLink href="/contato#contato">Falar com suporte</BotaoLink>
                <BotaoLink href="/contato#faq" variante="secundario">
                  Perguntas frequentes
                </BotaoLink>
              </div>
            </Cartao>
          </div>
        )}

        {!carregando && assinaturaAtiva && (
          <div className="mt-6">
            <Cartao
              titulo="Cancelar plano"
              acao={
                <Selo tom="alerta">
                  <IconeAlerta className="h-4 w-4" />
                  Ação de atenção
                </Selo>
              }
              className="shadow-sm"
            >
              <p className="mb-3 text-sm text-gray-500">
                Você pode consultar as condições antes de confirmar a alteração.
                O cancelamento não é executado automaticamente nesta página.
              </p>
              <dl>
                <LinhaInfo
                  rotulo="Condições"
                  valor="Verifique as regras antes de confirmar"
                />
                <LinhaInfo
                  rotulo="Encerramento"
                  valor="Consulte a data nas condições do plano"
                />
                <LinhaInfo
                  rotulo="Atendimento"
                  valor="Suporte disponível para orientações"
                />
              </dl>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <BotaoLink
                  href="/politicas/termos-de-uso"
                  variante="secundario"
                >
                  Ver condições
                </BotaoLink>
                {cancelamentoPendente ? (
                  <Botao
                    variante="secundario"
                    disabled={desistindoCancelamento}
                    onClick={handleDesistirCancelamento}
                  >
                    {desistindoCancelamento
                      ? "Cancelando pedido..."
                      : "Desistir do cancelamento"}
                  </Botao>
                ) : (
                  <BotaoLink href="/minha-conta/cancelamento" variante="perigo">
                    Solicitar cancelamento
                  </BotaoLink>
                )}
              </div>
            </Cartao>
          </div>
        )}
      </div>
    </main>
  );
}
