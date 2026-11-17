"use client";

import { useEffect, useState } from "react";
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

export default function CancelamentoPage() {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();
  const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);
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

    async function carregar() {
      try {
        const dados = await obterUsuarioAPI(id);
        if (ativo) {
          setUsuario(dados);
        }
      } catch (e) {
        console.error("Erro ao carregar dados do usuário:", e);
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [usuarioSessao, router]);

  const assinatura = usuario?.assinaturas?.[0];
  const plano = assinatura?.plano;

  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Revisar solicitação de cancelamento"
      subtitulo="Antes de continuar, consulte as condições do seu plano."
      largura="estreita"
    >
      <Cartao titulo="Plano a ser revisado">
        {carregando ? (
          <p className="text-sm text-gray-500 py-4">Carregando informações do plano...</p>
        ) : (
          <>
            <dl>
              <LinhaInfo rotulo="Plano atual" valor={plano?.nome || "Sem plano ativo"} />
              <LinhaInfo
                rotulo="Mensalidade"
                valor={plano ? `${formatarMoeda(Number(plano.preco))}/mês` : "—"}
              />
              <LinhaInfo
                rotulo="Situação atual"
                valor={assinatura?.status || "Nenhuma assinatura ativa"}
              />
            </dl>
            <Divisor />
            <p className="text-gray-500 text-sm">
              Ao confirmar, seu plano será marcado para cancelamento ao fim do ciclo atual.
            </p>
            <dl className="mt-2">
              <LinhaInfo
                rotulo="Data de encerramento"
                valor={
                  assinatura?.dataFim
                    ? new Date(assinatura.dataFim).toLocaleDateString("pt-BR")
                    : "Fim do período vigente"
                }
              />
              <LinhaInfo rotulo="Condições aplicáveis" valor="Cancelamento sem multas" />
            </dl>
            <div className="mt-3">
              <LinkSeta href="/politicas/termos-de-uso">
                Consultar condições do plano
              </LinkSeta>
            </div>
          </>
        )}
      </Cartao>

      <CancelamentoForm assinaturaId={assinatura?.id} />
    </PaginaInterna>
  );
}
