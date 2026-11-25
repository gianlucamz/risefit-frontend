"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import CancelamentoForm from "@/components/CancelamentoForm";
import {
  Cartao,
  Divisor,
  LinhaInfo,
  LinkSeta,
  PaginaInterna,
} from "@/components/PainelUI";
import { formatarMoeda } from "@/data/aluno";
import { useUsuarioLogado } from "@/lib/sessao";
import { obterUsuarioAPI, type UsuarioDetalhes } from "@/services/api";

const subscribeVazio = () => () => {};

export default function CancelamentoPage() {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();
  const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);
  const [idCarregado, setIdCarregado] = useState<string | number | null>(null);

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

    async function carregar() {
      try {
        const dados = await obterUsuarioAPI(usuarioId!);
        if (ativo) {
          setUsuario(dados);
        }
      } catch (e) {
        console.error("Erro ao carregar dados do usuário:", e);
      } finally {
        if (ativo) {
          setIdCarregado(usuarioId);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [montado, usuarioId, router]);

  const assinaturaAtiva =
    usuario?.assinaturas?.find((a) => a.status === "ATIVA") || null;
  const assinaturaPendente =
    usuario?.assinaturas?.find((a) => a.status === "PENDENTE") || null;
  const cancelamentoJaPendente = Boolean(
    assinaturaAtiva &&
      assinaturaPendente &&
      assinaturaAtiva.planoId === assinaturaPendente.planoId,
  );
  const plano = assinaturaAtiva?.plano || null;

  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Revisar solicitação de cancelamento"
      subtitulo="Antes de continuar, consulte as condições do seu plano."
      largura="estreita"
    >
      {cancelamentoJaPendente && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Você já possui uma solicitação de cancelamento aguardando aprovação do
          administrador.
        </div>
      )}

      <Cartao titulo="Plano a ser revisado">
        {carregando ? (
          <p className="py-4 text-sm text-gray-500">
            Carregando informações do plano...
          </p>
        ) : (
          <>
            <dl>
              <LinhaInfo
                rotulo="Plano atual"
                valor={plano?.nome || "Sem plano ativo"}
              />
              <LinhaInfo
                rotulo="Mensalidade"
                valor={
                  plano ? `${formatarMoeda(Number(plano.preco))}/mês` : "—"
                }
              />
              <LinhaInfo
                rotulo="Situação atual"
                valor={
                  cancelamentoJaPendente
                    ? "Ativo (cancelamento em análise)"
                    : assinaturaAtiva
                      ? "Ativo"
                      : "Nenhuma assinatura ativa"
                }
              />
            </dl>
            <Divisor />
            <p className="text-sm text-gray-500">
              Ao confirmar, sua solicitação de cancelamento será enviada para
              análise do administrador. Seu plano continuará ativo até a
              aprovação.
            </p>
            <dl className="mt-2">
              <LinhaInfo
                rotulo="Encerramento"
                valor="Após aprovação do administrador"
              />
              <LinhaInfo
                rotulo="Condições aplicáveis"
                valor="Cancelamento sem multas"
              />
            </dl>
            <div className="mt-3">
              <LinkSeta href="/politicas/termos-de-uso">
                Consultar condições do plano
              </LinkSeta>
            </div>
          </>
        )}
      </Cartao>

      <CancelamentoForm
        assinaturaId={assinaturaAtiva?.id}
        planoId={assinaturaAtiva?.planoId}
        usuarioId={usuarioId ?? undefined}
        cancelamentoJaPendente={cancelamentoJaPendente}
      />
    </PaginaInterna>
  );
}
