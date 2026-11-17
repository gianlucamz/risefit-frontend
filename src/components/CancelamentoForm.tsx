"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Botao, BotaoLink } from "./PainelUI";
import { cancelarAssinaturaAPI } from "@/services/api";

interface CancelamentoFormProps {
  assinaturaId?: number;
}

export default function CancelamentoForm({
  assinaturaId,
}: CancelamentoFormProps) {
  const router = useRouter();
  const [ciente, setCiente] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  async function handleConfirmar() {
    setCancelando(true);
    try {
      if (assinaturaId) {
        await cancelarAssinaturaAPI(assinaturaId);
      }
      router.push("/minha-conta/cancelamento/confirmado");
    } catch (e) {
      console.error("Erro ao cancelar assinatura:", e);
      // Navega mesmo assim para tela de confirmação/orientação
      router.push("/minha-conta/cancelamento/confirmado");
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
          onChange={(e) => setCiente(e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        Entendo que estou solicitando o cancelamento do meu plano ativo na RiseFit.
      </label>
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-3">
        <BotaoLink href="/minha-conta">Manter meu plano</BotaoLink>
        <Botao
          variante="secundario"
          disabled={!ciente || cancelando}
          onClick={handleConfirmar}
        >
          {cancelando ? "Processando solicitação..." : "Confirmar solicitação"}
        </Botao>
      </div>
    </div>
  );
}
