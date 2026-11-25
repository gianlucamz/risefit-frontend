"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  Botao,
  Cartao,
  Divisor,
  IconeCheck,
  IconeRelogio,
  LinhaInfo,
  PaginaInterna,
  Selo,
} from "@/components/PainelUI";
import { formatarMoeda } from "@/data/aluno";
import { useUsuarioLogado } from "@/lib/sessao";

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
  const [filtroStatus, setFiltroStatus] = useState<string>("TODAS");
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

    buscarAssinaturas()
      .then((dados) => {
        if (ativo) setAssinaturas(dados);
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

  function handleDesbloquear(e: React.FormEvent) {
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
      <PaginaInterna
        voltar={{ href: "/", texto: "Voltar ao início" }}
        titulo="Área Administrativa"
        subtitulo="Informe a chave de acesso para gerenciar as solicitações de planos."
        largura="estreita"
      >
        <Cartao titulo="Acesso restrito" className="shadow-sm">
          <form onSubmit={handleDesbloquear} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark">
                Chave de administrador
              </label>
              <input
                type="password"
                value={pinDigitado}
                onChange={(e) => setPinDigitado(e.target.value)}
                placeholder="Digite a chave de acesso"
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-dark focus:border-brand focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Chave padrão de ambiente local: <code>RiseFit@2026</code>
              </p>
            </div>

            {erroPin && (
              <p className="text-sm font-medium text-red-600">{erroPin}</p>
            )}

            <Botao type="submit" larguraTotal>
              Entrar no painel
            </Botao>
          </form>
        </Cartao>
      </PaginaInterna>
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
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Painel de Solicitações"
      subtitulo="Aprove ou recuse novas solicitações de planos e acompanhe o status das assinaturas."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Cartao className="shadow-sm">
          <p className="text-xs font-medium text-gray-500">Pendentes</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {pendentes.length}
          </p>
        </Cartao>
        <Cartao className="shadow-sm">
          <p className="text-xs font-medium text-gray-500">
            Assinaturas ativas
          </p>
          <p className="mt-2 text-3xl font-bold text-brand">{ativas.length}</p>
        </Cartao>
        <Cartao className="shadow-sm">
          <p className="text-xs font-medium text-gray-500">Receita mensal</p>
          <p className="mt-2 text-3xl font-bold text-dark">
            {formatarMoeda(receitaMensal)}
          </p>
        </Cartao>
        <Cartao className="shadow-sm">
          <p className="text-xs font-medium text-gray-500">
            Canceladas / Expiradas
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-600">
            {canceladas.length}
          </p>
        </Cartao>
      </div>

      {mensagem && (
        <div
          className={`mt-6 rounded-xl border p-4 text-sm font-medium ${
            mensagem.tipo === "sucesso"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      <div className="mt-6">
        <Cartao
          titulo="Solicitações aguardando aprovação"
          acao={
            <Selo tom={pendentes.length > 0 ? "alerta" : "neutro"}>
              <IconeRelogio className="h-4 w-4" />
              {pendentes.length} pendente(s)
            </Selo>
          }
          className="shadow-sm"
        >
          {carregando ? (
            <p className="py-4 text-sm text-gray-500">
              Carregando solicitações...
            </p>
          ) : pendentes.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-center">
              <IconeCheck className="h-8 w-8 text-brand" />
              <p className="mt-2 text-sm font-semibold text-dark">
                Nenhuma solicitação pendente no momento
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Novos cadastros com solicitação de plano aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendentes.map((item) => {
                const assinaturaAtivaDoUsuario = assinaturas.find(
                  (a) =>
                    a.usuarioId === item.usuarioId && a.status === "ATIVA",
                );

                return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-[#f8f8f9] p-4 sm:p-5"
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-base font-bold text-dark">
                        {item.usuario?.nome || `Usuário #${item.usuarioId}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.usuario?.email || "Sem e-mail"} • Inscrição #
                        {item.id}
                      </p>
                    </div>
                    <Selo tom="alerta">
                      {assinaturaAtivaDoUsuario
                        ? "Troca de Plano • Pendente"
                        : "Novo Plano • Pendente"}
                    </Selo>
                  </div>

                  <Divisor className="my-3" />

                  <dl>
                    {assinaturaAtivaDoUsuario && (
                      <LinhaInfo
                        rotulo="Plano atual"
                        valor={
                          assinaturaAtivaDoUsuario.plano?.nome ||
                          `Plano #${assinaturaAtivaDoUsuario.planoId}`
                        }
                      />
                    )}
                    <LinhaInfo
                      rotulo="Plano solicitado"
                      valor={item.plano?.nome || `Plano #${item.planoId}`}
                    />
                    <LinhaInfo
                      rotulo="Valor mensal"
                      valor={
                        item.plano?.preco
                          ? `${formatarMoeda(Number(item.plano.preco))}/mês`
                          : "—"
                      }
                      destaque
                    />
                    <LinhaInfo
                      rotulo="Data da solicitação"
                      valor={new Date(item.dataInicio).toLocaleDateString(
                        "pt-BR",
                      )}
                    />
                  </dl>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Botao
                      disabled={processandoId === item.id}
                      onClick={() => handleAprovar(item.id)}
                    >
                      {processandoId === item.id
                        ? "Processando..."
                        : "Aprovar plano"}
                    </Botao>
                    <Botao
                      variante="perigo"
                      disabled={processandoId === item.id}
                      onClick={() => handleRecusar(item.id)}
                    >
                      Recusar solicitação
                    </Botao>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </Cartao>
      </div>

      <div className="mt-6">
        <Cartao
          titulo="Todas as assinaturas"
          acao={
            <Botao
              variante="secundario"
              disabled={atualizando}
              onClick={handleAtualizarLista}
            >
              {atualizando ? "Atualizando..." : "Atualizar lista"}
            </Botao>
          }
          className="shadow-sm"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {["TODAS", "PENDENTE", "ATIVA", "CANCELADA"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFiltroStatus(st)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    filtroStatus === st
                      ? "bg-brand text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              className="rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-dark focus:border-brand focus:outline-none sm:w-72"
            />
          </div>

          {listaFiltrada.length === 0 ? (
            <p className="py-4 text-sm text-gray-500">
              Nenhuma assinatura encontrada para esse filtro.
            </p>
          ) : (
            <div className="divide-y divide-gray-200">
              {listaFiltrada.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-bold text-dark">
                      {item.usuario?.nome || `Usuário #${item.usuarioId}`}{" "}
                      <span className="font-normal text-gray-500">
                        ({item.usuario?.email || "—"})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Plano: <strong>{item.plano?.nome || "—"}</strong> •{" "}
                      {item.plano?.preco
                        ? `${formatarMoeda(Number(item.plano.preco))}/mês`
                        : "—"}{" "}
                      • Início:{" "}
                      {new Date(item.dataInicio).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Selo
                      tom={
                        item.status === "PENDENTE" ||
                        item.status === "CANCELADA"
                          ? "alerta"
                          : "neutro"
                      }
                    >
                      {item.status}
                    </Selo>
                    {item.status === "PENDENTE" && (
                      <Botao
                        disabled={processandoId === item.id}
                        onClick={() => handleAprovar(item.id)}
                      >
                        Aprovar
                      </Botao>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Cartao>
      </div>
    </PaginaInterna>
  );
}
