"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import AdminProfissionais from "@/components/AdminProfissionais";
import { formatarMoeda } from "@/data/aluno";
import { useUsuarioLogado } from "@/lib/sessao";
import { obterProfissionaisAPI } from "@/services/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const PIN_ADMIN = "RiseFit@2026";
const STORAGE_ADMIN_KEY = "risefit_admin_autorizado";
const subscribeVazio = () => () => {};

interface AssinaturaAdmin {
  id: number;
  usuarioId: number;
  planoId: number;
  dataInicio: string;
  dataFim: string | null;
  status: "PENDENTE" | "ATIVA" | "CANCELADA" | "EXPIRADA";
  usuario?: {
    id: number;
    nome: string;
    email: string;
    cpf?: string | null;
    telefone?: string | null;
  };
  plano?: {
    id: number;
    nome: string;
    preco: string | number;
    duracaoMeses?: number;
  };
}

export default function AdminSolicitacoesPage() {
  const usuarioSessao = useUsuarioLogado();

  const [pinDigitado, setPinDigitado] = useState("");
  const [erroPin, setErroPin] = useState("");
  const [autorizadoManual, setAutorizadoManual] = useState(false);

  const [assinaturas, setAssinaturas] = useState<AssinaturaAdmin[]>([]);
  const [totalProfissionais, setTotalProfissionais] = useState(0);
  const [secaoAtiva, setSecaoAtiva] = useState<"assinaturas" | "profissionais">(
    "assinaturas",
  );
  const [filtroStatus, setFiltroStatus] = useState("TODAS");
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  const montado = useSyncExternalStore(
    subscribeVazio,
    () => true,
    () => false,
  );

  const autorizadoStorage =
    montado && sessionStorage.getItem(STORAGE_ADMIN_KEY) === "true";

  const ehAdminCargo = usuarioSessao?.cargo === "ADMIN";
  const temAcesso = autorizadoManual || autorizadoStorage || ehAdminCargo;

  const buscarAssinaturas = useCallback(async () => {
    const res = await fetch(`${API_URL}/subscriptions?status=TODAS`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Falha ao buscar assinaturas.");

    const dados = await res.json();
    return Array.isArray(dados) ? (dados as AssinaturaAdmin[]) : [];
  }, []);

  useEffect(() => {
    if (!montado || !temAcesso) return;

    let ativo = true;

    Promise.all([
      buscarAssinaturas(),
      obterProfissionaisAPI(true).catch(() => []),
    ])
      .then(([dadosAssinaturas, dadosProfissionais]) => {
        if (!ativo) return;
        setAssinaturas(dadosAssinaturas);
        setTotalProfissionais(dadosProfissionais.length);
      })
      .catch((e) => {
        if (ativo) {
          setMensagem({
            tipo: "erro",
            texto:
              e instanceof Error ? e.message : "Erro ao carregar solicitações.",
          });
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [montado, temAcesso, buscarAssinaturas]);

  async function handleAtualizarLista() {
    setAtualizando(true);

    try {
      const dados = await buscarAssinaturas();
      setAssinaturas(dados);
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto:
          e instanceof Error ? e.message : "Erro ao atualizar solicitações.",
      });
    } finally {
      setAtualizando(false);
    }
  }

  function handleDesbloquear(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (pinDigitado.trim() === PIN_ADMIN) {
      sessionStorage.setItem(STORAGE_ADMIN_KEY, "true");
      setAutorizadoManual(true);
      setErroPin("");
    } else {
      setErroPin("Chave de acesso inválida.");
    }
  }

  async function handleAprovar(id: number) {
    setProcessandoId(id);
    setMensagem(null);

    try {
      const res = await fetch(`${API_URL}/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ATIVA" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.message || "Não foi possível aprovar a solicitação.",
        );
      }

      setMensagem({
        tipo: "sucesso",
        texto: `Assinatura #${id} aprovada e ativada com sucesso!`,
      });

      const dados = await buscarAssinaturas();
      setAssinaturas(dados);
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto: e instanceof Error ? e.message : "Erro ao aprovar assinatura.",
      });
    } finally {
      setProcessandoId(null);
    }
  }

  async function handleRecusar(id: number) {
    setProcessandoId(id);
    setMensagem(null);

    try {
      const res = await fetch(`${API_URL}/subscriptions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.message || "Não foi possível recusar a solicitação.",
        );
      }

      setMensagem({
        tipo: "sucesso",
        texto: `Assinatura #${id} recusada/cancelada.`,
      });

      const dados = await buscarAssinaturas();
      setAssinaturas(dados);
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto: e instanceof Error ? e.message : "Erro ao recusar assinatura.",
      });
    } finally {
      setProcessandoId(null);
    }
  }

  if (!montado) return null;

  if (!temAcesso) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-lg">
          <Link
            href="/"
            className="mb-6 inline-block text-sm text-gray-600 hover:text-dark"
          >
            ← Voltar ao início
          </Link>

          <header className="mb-8">
            <h1 className="text-2xl font-bold text-dark sm:text-3xl">
              Área Administrativa
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Informe a chave de acesso para gerenciar as solicitações de
              planos.
            </p>
          </header>

          <section className="border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-dark">Acesso restrito</h2>

            <form onSubmit={handleDesbloquear} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="pin-admin"
                  className="block text-sm font-medium text-dark"
                >
                  Chave de administrador
                </label>

                <input
                  id="pin-admin"
                  type="password"
                  value={pinDigitado}
                  onChange={(e) => setPinDigitado(e.target.value)}
                  placeholder="Digite a chave de acesso"
                  className="mt-1.5 w-full border border-gray-300 bg-white px-4 py-3 text-sm text-dark focus:border-brand focus:outline-none"
                />

                <p className="mt-1.5 text-xs text-gray-500">
                  Chave padrão de ambiente local: <code>RiseFit@2026</code>
                </p>
              </div>

              {erroPin && (
                <p className="text-sm font-medium text-red-600">{erroPin}</p>
              )}

              <button
                type="submit"
                className="w-full bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
              >
                Entrar no painel
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  const pendentes = assinaturas.filter((a) => a.status === "PENDENTE");
  const ativas = assinaturas.filter((a) => a.status === "ATIVA");

  const canceladas = assinaturas.filter(
    (a) => a.status === "CANCELADA" || a.status === "EXPIRADA",
  );

  const receitaMensal = ativas.reduce(
    (acc, a) => acc + Number(a.plano?.preco || 0),
    0,
  );

  const listaFiltrada = assinaturas.filter((item) => {
    const bateStatus = filtroStatus === "TODAS" || item.status === filtroStatus;
    const termo = busca.trim().toLowerCase();

    const bateBusca =
      !termo ||
      item.usuario?.nome?.toLowerCase().includes(termo) ||
      item.usuario?.email?.toLowerCase().includes(termo) ||
      item.plano?.nome?.toLowerCase().includes(termo);

    return bateStatus && bateBusca;
  });

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold text-dark sm:text-3xl">
            {secaoAtiva === "assinaturas"
              ? "Painel de Solicitações"
              : "Gestão de Profissionais"}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            {secaoAtiva === "assinaturas"
              ? "Aprove ou recuse novas solicitações de planos e acompanhe o status das assinaturas."
              : "Cadastre, filtre, edite e gerencie os profissionais exibidos no catálogo da RiseFit."}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
          <aside className="border border-gray-200 bg-white lg:sticky lg:top-24">
            <div className="border-b border-gray-200 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Administração
              </p>
            </div>
            <nav
              aria-label="Navegação administrativa"
              className="grid grid-cols-2 divide-x divide-gray-200 lg:grid-cols-1 lg:divide-x-0 lg:divide-y"
            >
              <button
                type="button"
                onClick={() => setSecaoAtiva("assinaturas")}
                className={`flex cursor-pointer items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  secaoAtiva === "assinaturas"
                    ? "bg-brand text-white"
                    : "bg-white text-dark hover:bg-gray-50"
                }`}
              >
                <span>Assinaturas</span>
                <span
                  className={`px-2 py-0.5 text-xs ${
                    secaoAtiva === "assinaturas"
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {pendentes.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSecaoAtiva("profissionais")}
                className={`flex cursor-pointer items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors ${
                  secaoAtiva === "profissionais"
                    ? "bg-brand text-white"
                    : "bg-white text-dark hover:bg-gray-50"
                }`}
              >
                <span>Profissionais</span>
                <span
                  className={`px-2 py-0.5 text-xs ${
                    secaoAtiva === "profissionais"
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {totalProfissionais}
                </span>
              </button>
            </nav>
          </aside>

          <div className="flex min-w-0 flex-col gap-6">
            {secaoAtiva === "profissionais" ? (
              <AdminProfissionais onTotalChange={setTotalProfissionais} />
            ) : (
              <>
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="border border-gray-200 p-4 sm:p-5">
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="mt-2 text-3xl font-bold text-dark">
              {pendentes.length}
            </p>
          </div>

          <div className="border border-gray-200 p-4 sm:p-5">
            <p className="text-sm text-gray-500">Assinaturas ativas</p>
            <p className="mt-2 text-3xl font-bold text-dark">{ativas.length}</p>
          </div>

          <div className="border border-gray-200 p-4 sm:p-5">
            <p className="text-sm text-gray-500">Receita mensal</p>
            <p className="mt-2 text-3xl font-bold text-dark">
              {formatarMoeda(receitaMensal)}
            </p>
          </div>

          <div className="border border-gray-200 p-4 sm:p-5">
            <p className="text-sm text-gray-500">Canceladas / Expiradas</p>
            <p className="mt-2 text-3xl font-bold text-dark">
              {canceladas.length}
            </p>
          </div>
        </section>

        {mensagem && (
          <div
            role="status"
            className={`border-l-4 p-4 text-sm font-medium ${
              mensagem.tipo === "sucesso"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-red-600 bg-red-50 text-red-700"
            }`}
          >
            {mensagem.texto}
          </div>
        )}

        <section className="border border-gray-200 bg-white">
          <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:px-5">
            <h2 className="text-base font-semibold text-dark">
              Solicitações aguardando aprovação
            </h2>

            <span
              className={`text-sm font-medium ${
                pendentes.length > 0 ? "text-amber-700" : "text-gray-500"
              }`}
            >
              {pendentes.length} pendente(s)
            </span>
          </div>

          <div className="p-4 sm:p-5">
            {carregando ? (
              <p className="py-4 text-sm text-gray-500">
                Carregando solicitações...
              </p>
            ) : pendentes.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm font-semibold text-dark">
                  Nenhuma solicitação pendente no momento
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Novos cadastros com solicitação de plano aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendentes.map((item) => {
                  const assinaturaAtivaDoUsuario = assinaturas.find(
                    (a) =>
                      a.usuarioId === item.usuarioId && a.status === "ATIVA",
                  );

                  const ehCancelamento = Boolean(
                    assinaturaAtivaDoUsuario &&
                    assinaturaAtivaDoUsuario.planoId === item.planoId,
                  );

                  const ehTroca = Boolean(
                    assinaturaAtivaDoUsuario &&
                    assinaturaAtivaDoUsuario.planoId !== item.planoId,
                  );

                  return (
                    <article
                      key={item.id}
                      className="py-5 first:pt-0 last:pb-0"
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                          <h3 className="text-base font-semibold text-dark">
                            {item.usuario?.nome || `Usuário #${item.usuarioId}`}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            {item.usuario?.email || "Sem e-mail"} • Inscrição #
                            {item.id}
                          </p>
                        </div>

                        <span className="text-sm font-medium text-amber-700">
                          {ehCancelamento
                            ? "Cancelamento • Pendente"
                            : ehTroca
                              ? "Troca de plano • Pendente"
                              : "Novo plano • Pendente"}
                        </span>
                      </div>

                      <div className="my-4 border-t border-gray-200" />

                      <dl className="space-y-3">
                        {ehTroca && assinaturaAtivaDoUsuario && (
                          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                            <dt className="text-sm text-gray-500">
                              Plano atual
                            </dt>
                            <dd className="text-sm font-medium text-dark sm:text-right">
                              {assinaturaAtivaDoUsuario.plano?.nome ||
                                `Plano #${assinaturaAtivaDoUsuario.planoId}`}
                            </dd>
                          </div>
                        )}

                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                          <dt className="text-sm text-gray-500">
                            {ehCancelamento
                              ? "Plano a cancelar"
                              : "Plano solicitado"}
                          </dt>
                          <dd className="text-sm font-medium text-dark sm:text-right">
                            {item.plano?.nome || `Plano #${item.planoId}`}
                          </dd>
                        </div>

                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                          <dt className="text-sm text-gray-500">
                            Valor mensal
                          </dt>
                          <dd className="text-sm font-semibold text-dark sm:text-right">
                            {item.plano?.preco
                              ? `${formatarMoeda(Number(item.plano.preco))}/mês`
                              : "—"}
                          </dd>
                        </div>

                        <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                          <dt className="text-sm text-gray-500">
                            Data da solicitação
                          </dt>
                          <dd className="text-sm text-dark sm:text-right">
                            {new Date(item.dataInicio).toLocaleDateString(
                              "pt-BR",
                            )}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          disabled={processandoId === item.id}
                          onClick={() => handleAprovar(item.id)}
                          className="bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processandoId === item.id
                            ? "Processando..."
                            : ehCancelamento
                              ? "Aprovar cancelamento"
                              : "Aprovar plano"}
                        </button>

                        <button
                          type="button"
                          disabled={processandoId === item.id}
                          onClick={() => handleRecusar(item.id)}
                          className="border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {ehCancelamento
                            ? "Recusar cancelamento"
                            : "Recusar solicitação"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="border border-gray-200 bg-white">
          <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:px-5">
            <h2 className="text-base font-semibold text-dark">
              Todas as assinaturas
            </h2>

            <button
              type="button"
              disabled={atualizando}
              onClick={handleAtualizarLista}
              className="border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {atualizando ? "Atualizando..." : "Atualizar lista"}
            </button>
          </div>

          <div className="p-4 sm:p-5">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {["TODAS", "PENDENTE", "ATIVA", "CANCELADA"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFiltroStatus(st)}
                    aria-pressed={filtroStatus === st}
                    className={`border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      filtroStatus === st
                        ? "border-gray-800 bg-gray-800 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {st === "TODAS"
                      ? "Todas"
                      : st.charAt(0) + st.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por aluno, e-mail ou plano..."
                aria-label="Buscar assinaturas"
                className="w-full border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-dark placeholder:text-gray-400 focus:border-brand focus:outline-none lg:max-w-80"
              />
            </div>

            {listaFiltrada.length === 0 ? (
              <p className="py-6 text-sm text-gray-500">
                Nenhuma assinatura encontrada para esse filtro.
              </p>
            ) : (
              <div className="divide-y divide-gray-200">
                {listaFiltrada.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-dark">
                        {item.usuario?.nome || `Usuário #${item.usuarioId}`}{" "}
                        <span className="font-normal text-gray-500">
                          ({item.usuario?.email || "—"})
                        </span>
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Plano: {item.plano?.nome || "—"} •{" "}
                        {item.plano?.preco
                          ? `${formatarMoeda(Number(item.plano.preco))}/mês`
                          : "—"}{" "}
                        • Início:{" "}
                        {new Date(item.dataInicio).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`text-xs font-semibold ${
                          item.status === "PENDENTE"
                            ? "text-amber-700"
                            : item.status === "CANCELADA" ||
                                item.status === "EXPIRADA"
                              ? "text-gray-500"
                              : "text-emerald-700"
                        }`}
                      >
                        {item.status}
                      </span>

                      {item.status === "PENDENTE" && (
                        <button
                          type="button"
                          disabled={processandoId === item.id}
                          onClick={() => handleAprovar(item.id)}
                          className="bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Aprovar
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
