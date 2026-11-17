"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlterarSenhaForm from "@/components/AlterarSenhaForm";
import {
  BotaoLink,
  Cartao,
  LinhaInfo,
  PaginaInterna,
} from "@/components/PainelUI";
import EncerrarAcessosBotao from "@/components/EncerrarAcessosBotao";
import { useUsuarioLogado } from "@/lib/sessao";

export default function SegurancaPage() {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();
  const [dataAcesso, setDataAcesso] = useState("");

  useEffect(() => {
    const sessaoStorage =
      typeof window !== "undefined"
        ? localStorage.getItem("usuario") || sessionStorage.getItem("usuario")
        : null;

    if (!sessaoStorage && !usuarioSessao) {
      router.push("/login");
      return;
    }

    const agora = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setDataAcesso(agora);
  }, [usuarioSessao, router]);

  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Segurança e acessos"
      subtitulo="Altere sua senha, confira seus dispositivos e consulte os acessos."
    >
      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Cartao titulo="Alterar senha">
          <AlterarSenhaForm />
        </Cartao>

        <div className="space-y-6">
          <Cartao titulo="Dispositivo conectado">
            <dl>
              <LinhaInfo
                rotulo="Este dispositivo"
                valor="Navegador Web • Conectado"
              />
              <LinhaInfo
                rotulo="Sessão ativa"
                valor={dataAcesso || "Conexão recente"}
              />
            </dl>
            <p className="mt-2 text-sm text-gray-500">
              Sessão autenticada e protegida para {usuarioSessao?.email || "sua conta"}.
            </p>
            <EncerrarAcessosBotao />
          </Cartao>

          <Cartao titulo="Não reconhece um acesso?">
            <p className="text-sm text-gray-500">
              Altere sua senha imediatamente e procure orientação da equipe pelo formulário de
              contato. Nunca compartilhe sua senha.
            </p>
            <div className="mt-4">
              <BotaoLink href="/contato#contato" variante="secundario" larguraTotal>
                Procurar atendimento
              </BotaoLink>
            </div>
          </Cartao>
        </div>
      </div>

      <div id="historico" className="mt-6 scroll-mt-28">
        <Cartao titulo="Histórico de acessos">
          <ul className="divide-y divide-gray-200 border-b border-gray-200">
            <li className="flex flex-col gap-1 py-3.5 text-sm sm:flex-row sm:justify-between">
              <span className="text-gray-500">{dataAcesso || "Hoje"}</span>
              <span className="font-semibold text-brand">
                Navegador Web • Sessão atual ativa
              </span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            Horários baseados no fuso de Brasília.
          </p>
        </Cartao>
      </div>
    </PaginaInterna>
  );
}
