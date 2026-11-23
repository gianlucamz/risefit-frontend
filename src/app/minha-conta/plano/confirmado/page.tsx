"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BotaoLink,
  Cartao,
  Divisor,
  IconeCheck,
  LinhaInfo,
  PaginaInterna,
} from "@/components/PainelUI";
import { formatarMoeda } from "@/data/aluno";
import { useUsuarioLogado } from "@/lib/sessao";
import { obterUsuarioAPI, type UsuarioDetalhes } from "@/services/api";

const subscribeVazio = () => () => {};

export default function PlanoConfirmadoPage() {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();
  const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);
  const [idCarregado, setIdCarregado] = useState<string | number | null>(null);

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

    async function carregar() {
      try {
        const dados = await obterUsuarioAPI(usuarioId!);
        if (ativo) {
          setUsuario(dados);
        }
      } catch (e) {
        console.error("Erro ao carregar plano atualizado:", e);
      } finally {
        if (ativo) {
          setIdCarregado(usuarioId!);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [montado, usuarioId, router]);

  const assinaturas = usuario
    ? usuario.assinaturas || []
    : (usuarioSessao?.assinaturas as UsuarioDetalhes["assinaturas"]) ||
      (sessaoObj?.assinaturas as UsuarioDetalhes["assinaturas"]) ||
      [];

  const assinaturaAtiva = assinaturas.find((a) => a.status === "ATIVA") || null;
  const plano = assinaturaAtiva?.plano || null;

  const proximaCobranca = assinaturaAtiva?.dataFim
    ? new Date(assinaturaAtiva.dataFim).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "A confirmar";

  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      largura="estreita"
      centralizado
      icone={<IconeCheck className="h-10 w-10" />}
      titulo="Plano alterado com sucesso!"
      subtitulo="Sua assinatura já foi atualizada e os novos benefícios estão ativos na sua conta."
    >
      <Cartao titulo="Resumo do plano" className="text-left shadow-sm">
        {carregando ? (
          <p className="py-4 text-sm text-gray-500">
            Carregando detalhes do novo plano...
          </p>
        ) : (
          <>
            <dl>
              <LinhaInfo
                rotulo="Plano"
                valor={plano?.nome || "Plano atualizado"}
              />
              <LinhaInfo
                rotulo="Mensalidade"
                valor={
                  plano?.preco
                    ? `${formatarMoeda(Number(plano.preco))}/mês`
                    : "—"
                }
              />
              <LinhaInfo
                rotulo="Situação"
                valor={assinaturaAtiva ? "Ativo" : "Em processamento"}
              />
            </dl>
            <Divisor />
            <p className="text-sm text-gray-500">
              {plano?.descricao ||
                "Acompanhamento mensal com suporte completo para seu treino."}
            </p>
            <dl className="mt-2">
              <LinhaInfo rotulo="Próxima cobrança" valor={proximaCobranca} />
            </dl>
          </>
        )}
      </Cartao>

      <div className="mt-6 flex flex-col items-start gap-4">
        <BotaoLink href="/minha-conta" larguraTotal grande>
          Voltar para Minha conta
        </BotaoLink>
        <Link
          href="/area-do-aluno"
          className="text-sm font-medium text-brand hover:underline"
        >
          Acessar Área do Aluno
        </Link>
      </div>
    </PaginaInterna>
  );
}
