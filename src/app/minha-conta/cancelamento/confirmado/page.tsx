"use client";

import { useEffect, useState } from "react";
import {
  BotaoLink,
  Cartao,
  IconeRelogio,
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

  const assinaturaPendente =
    usuario?.assinaturas?.find((a) => a.status === "PENDENTE") || null;
  const assinaturaAtiva =
    usuario?.assinaturas?.find((a) => a.status === "ATIVA") || null;
  const planoNome =
    assinaturaPendente?.plano?.nome ||
    assinaturaAtiva?.plano?.nome ||
    usuario?.assinaturas?.[0]?.plano?.nome ||
    "Plano RiseFit";

  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Solicitação de cancelamento enviada!"
      subtitulo="Sua solicitação foi registrada e está aguardando aprovação do administrador. Enquanto isso, seu plano atual continua ativo normalmente."
      largura="estreita"
      centralizado
      icone={<IconeRelogio className="h-10 w-10" />}
    >
      <Cartao titulo="Resumo da solicitação">
        <dl>
          <LinhaInfo rotulo="Plano" valor={planoNome} />
          <LinhaInfo rotulo="Situação" valor="Pendente de aprovação" />
          <LinhaInfo
            rotulo="Acesso restante"
            valor="Plano ativo até aprovação do administrador"
          />
        </dl>
        <p className="mt-3 text-sm text-gray-500">
          Você continuará com acesso normal à plataforma e aos seus treinos até
          que a solicitação seja aprovada pelo administrador.
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
