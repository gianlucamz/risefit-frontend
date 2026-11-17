"use client";

import { useEffect, useState } from "react";
import {
  BotaoLink,
  Cartao,
  IconeCheck,
  LinhaInfo,
  LinkSeta,
  PaginaInterna,
} from "@/components/PainelUI";
import { useUsuarioLogado } from "@/lib/sessao";
import { obterUsuarioAPI, type UsuarioDetalhes } from "@/services/api";

export default function CancelamentoConfirmadoPage() {
  const usuarioSessao = useUsuarioLogado();
  const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);

  useEffect(() => {
    const id =
      usuarioSessao?.id ||
      (typeof window !== "undefined"
        ? JSON.parse(
            localStorage.getItem("usuario") ||
              sessionStorage.getItem("usuario") ||
              "{}",
          )?.id
        : null);

    if (!id) return;

    obterUsuarioAPI(id)
      .then((dados) => setUsuario(dados))
      .catch((e) => console.error("Erro ao carregar dados do usuário:", e));
  }, [usuarioSessao]);

  const planoNome = usuario?.assinaturas?.[0]?.plano?.nome || "Plano RiseFit";

  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Solicitação de cancelamento registrada"
      subtitulo="Sua solicitação foi processada no sistema com sucesso."
      largura="estreita"
      centralizado
      icone={<IconeCheck />}
    >
      <Cartao titulo="Resumo da solicitação">
        <dl>
          <LinhaInfo rotulo="Plano" valor={planoNome} />
          <LinhaInfo rotulo="Situação" valor="Cancelamento solicitado" />
          <LinhaInfo rotulo="Acesso restante" valor="Até o término do período faturado" />
        </dl>
        <p className="mt-3 text-sm text-gray-500">
          Você ainda pode utilizar a plataforma e seus treinos até a data final do ciclo atual.
        </p>
      </Cartao>

      <div className="mt-6">
        <BotaoLink href="/minha-conta" larguraTotal>
          Voltar para minha conta
        </BotaoLink>
      </div>
      <div className="mt-6">
        <LinkSeta href="/contato#contato">Falar com a equipe de atendimento</LinkSeta>
      </div>
    </PaginaInterna>
  );
}
