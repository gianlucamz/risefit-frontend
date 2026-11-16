"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Botao, BotaoLink } from "./PainelUI";

// Confirmação do pedido de cancelamento. Só navega para a tela de confirmação.
export default function CancelamentoForm() {
  const router = useRouter();
  const [ciente, setCiente] = useState(false);

  return (
    <div className="mt-6">
      <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-500">
        <input
          type="checkbox"
          checked={ciente}
          onChange={(e) => setCiente(e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-brand"
        />
        Entendo que estou solicitando a análise do cancelamento, não o
        encerramento imediato.
      </label>
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-3">
        <BotaoLink href="/minha-conta">Manter meu plano</BotaoLink>
        <Botao
          variante="secundario"
          disabled={!ciente}
          onClick={() => router.push("/minha-conta/cancelamento/confirmado")}
        >
          Confirmar solicitação
        </Botao>
      </div>
    </div>
  );
}
