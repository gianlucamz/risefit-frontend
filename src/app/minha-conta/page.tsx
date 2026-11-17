"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
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
} from "@/lib/sessao";
import { obterUsuarioAPI, type UsuarioDetalhes } from "@/services/api";

export default function MinhaContaPage() {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();
  const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Verifica se há sessão
    const sessaoStorage =
      typeof window !== "undefined"
        ? localStorage.getItem("usuario") || sessionStorage.getItem("usuario")
        : null;

    if (!sessaoStorage && !usuarioSessao) {
      router.push("/login");
      return;
    }

    const usuarioId =
      usuarioSessao?.id ||
      (sessaoStorage ? JSON.parse(sessaoStorage).id : null);

    if (!usuarioId) {
      setCarregando(false);
      return;
    }

    let ativo = true;

    async function carregarDados() {
      try {
        const dados = await obterUsuarioAPI(usuarioId);
        if (ativo) {
          setUsuario(dados);
        }
      } catch (erro) {
        console.error("Erro ao carregar dados do usuário:", erro);
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [usuarioSessao, router]);

  const nomeExibicao =
    usuario?.nome ||
    usuarioSessao?.nome ||
    (usuarioSessao?.nomeCompleto as string) ||
    "Aluno RiseFit";
  const emailExibicao = usuario?.email || usuarioSessao?.email || "—";
  const cpfExibicao = mascararCPF(
    usuario?.cpf || (usuarioSessao?.cpf as string),
  );
  const telefoneExibicao = mascararTelefone(
    usuario?.telefone || (usuarioSessao?.telefone as string),
  );

  const assinaturaAtiva = usuario?.assinaturas?.[0];
  const plano = assinaturaAtiva?.plano;

  const situacaoPlano =
    assinaturaAtiva?.status === "ATIVA"
      ? "Ativo"
      : assinaturaAtiva?.status || "Sem plano";

  const dataFimFormatada = assinaturaAtiva?.dataFim
    ? new Date(assinaturaAtiva.dataFim).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Renovação mensal contínua";

  return (
    <main className="bg-[#f8f8f8] px-6 py-10 lg:py-14">
      <div className="mx-auto max-w-300">
        <p className="text-sm font-medium text-brand">Minha conta</p>
        <h1 className="mt-3 text-[28px] leading-[35px] font-bold tracking-tight text-dark lg:text-[44px] lg:leading-normal">
          Gerencie sua assinatura e informações
        </h1>
        <p className="mt-3 text-[15px] leading-[23px] text-gray-500 lg:text-base lg:leading-normal">
          Acompanhe seu plano, dados pessoais e opções de suporte em um só lugar.
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
            <Cartao titulo="Conta logada" className="shadow-sm">
              <dl>
                <LinhaInfo rotulo="Nome completo" valor={nomeExibicao} />
                <LinhaInfo rotulo="CPF" valor={cpfExibicao} />
                <LinhaInfo rotulo="E-mail" valor={emailExibicao} />
                <LinhaInfo rotulo="Telefone" valor={telefoneExibicao} />
              </dl>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <BotaoLink href="/minha-conta/editar" variante="secundario">
                  Editar dados
                </BotaoLink>
                <BotaoLink
                  href="/minha-conta/editar#contato"
                  variante="secundario"
                >
                  Atualizar contato
                </BotaoLink>
              </div>
            </Cartao>

            <Cartao
              titulo="Plano atual"
              acao={<Selo>{situacaoPlano}</Selo>}
              className="shadow-sm"
            >
              <p className="text-2xl font-semibold text-dark lg:text-3xl">
                {plano?.nome || "Sem plano ativo"}
              </p>
              <p className="mt-1 mb-3 text-sm text-gray-500">
                {plano?.descricao ||
                  "Assine um dos nossos planos para ter acesso aos treinos personalizados."}
              </p>
              <dl>
                <LinhaInfo
                  rotulo="Valor mensal"
                  valor={
                    plano?.preco
                      ? formatarMoeda(Number(plano.preco))
                      : "—"
                  }
                  destaque
                />
                <LinhaInfo
                  rotulo="Próxima cobrança"
                  valor={dataFimFormatada}
                />
                <LinhaInfo
                  rotulo="Método"
                  valor={plano ? "Cartão de crédito / débito" : "Nenhum"}
                />
              </dl>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                  valor={`ID #${usuario?.id || usuarioSessao?.id || "—"}`}
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

        {/* Cancelar plano */}
        {assinaturaAtiva && (
          <section className="mt-6 grid gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_240px] lg:p-7">
            <div>
              <Selo tom="alerta">
                <IconeAlerta className="h-4 w-4" />
                Ação de atenção
              </Selo>
              <h2 className="mt-4 text-2xl font-semibold text-dark">
                Cancelar plano
              </h2>
              <p className="mt-2 max-w-xl text-sm text-gray-500">
                Você pode consultar as condições antes de confirmar a alteração. O
                cancelamento não é executado automaticamente nesta página.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-dark">
                {[
                  "Verifique as condições antes de confirmar.",
                  "Consulte a data de encerramento nas condições do plano.",
                  "Contate o suporte para orientações adicionais.",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0 text-brand"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <path d="m8 12 3 3 5-6" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-gray-100 p-4">
              <h3 className="font-semibold text-dark">Próximos passos</h3>
              <div className="mt-3 flex flex-col gap-3">
                <BotaoLink href="/politicas/termos-de-uso" variante="secundario">
                  Ver condições
                </BotaoLink>
                <BotaoLink href="/minha-conta/cancelamento" variante="perigo">
                  Solicitar cancelamento
                </BotaoLink>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Revise as condições antes de confirmar sua solicitação.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
