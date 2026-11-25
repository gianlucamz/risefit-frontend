"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Botao, BotaoLink } from "./PainelUI";
import { criarAssinaturaAPI, obterUsuarioAPI } from "@/services/api";
import { salvarSessao, useUsuarioLogado } from "@/lib/sessao";

interface CancelamentoFormProps {
  assinaturaId?: number;
  planoId?: number;
  usuarioId?: number | string;
  cancelamentoJaPendente?: boolean;
}

export default function CancelamentoForm({
  assinaturaId,
  planoId,
  usuarioId,
  cancelamentoJaPendente = false,
}: CancelamentoFormProps) {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();
  const [ciente, setCiente] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleConfirmar() {
    if (cancelando || cancelamentoJaPendente) return;
    setCancelando(true);
    setErro(null);

    try {
      const idUsuarioFinal = Number(usuarioId ?? usuarioSessao?.id);
      if (!idUsuarioFinal) {
        throw new Error("Usuário não identificado. Faça login novamente.");
      }

      let planoIdFinal = planoId;
      if (!planoIdFinal) {
        const dadosUsuario = await obterUsuarioAPI(idUsuarioFinal);
        const ativa = dadosUsuario.assinaturas?.find(
          (a) => a.status === "ATIVA",
        );
        planoIdFinal = ativa?.planoId;
      }

      if (!planoIdFinal) {
        throw new Error("Nenhuma assinatura ativa encontrada para cancelar.");
      }

      await criarAssinaturaAPI({
        usuarioId: idUsuarioFinal,
        planoId: planoIdFinal,
        status: "PENDENTE",
      });

      const dadosAtualizados = await obterUsuarioAPI(idUsuarioFinal);
      const persistir = Boolean(localStorage.getItem("usuario"));

      salvarSessao(
        {
          ...(usuarioSessao || {}),
          ...dadosAtualizados,
          cpf: dadosAtualizados.cpf ?? undefined,
          sexo: dadosAtualizados.sexo ?? undefined,
          plano: undefined,
          planoId: undefined,
        },
        undefined,
        persistir,
      );

      router.push("/minha-conta/cancelamento/confirmado");
    } catch (e: unknown) {
      const mensagem =
        e instanceof Error
          ? e.message
          : "Não foi possível enviar a solicitação de cancelamento. Tente novamente.";
      setErro(mensagem);
    } finally {
      setCancelando(false);
    }
  }

  return (
    <div className="mt-6">
      <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-500">
        <input
          type="checkbox"
          checked={ciente}
          disabled={cancelamentoJaPendente}
          onChange={(e) => setCiente(e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        Entendo que estou solicitando o cancelamento do meu plano ativo na
        RiseFit e que a solicitação passará por aprovação administrativa.
      </label>

      {erro && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          {erro}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-3">
        <BotaoLink href="/minha-conta">Manter meu plano</BotaoLink>
        <Botao
          variante="secundario"
          disabled={!ciente || cancelando || !assinaturaId || cancelamentoJaPendente}
          onClick={handleConfirmar}
        >
          {cancelamentoJaPendente
            ? "Solicitação já enviada"
            : cancelando
              ? "Enviando solicitação..."
              : "Solicitar cancelamento"}
        </Botao>
      </div>
    </div>
  );
}
