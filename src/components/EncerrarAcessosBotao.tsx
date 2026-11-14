"use client";

import { useState } from "react";
import { Botao } from "./PainelUI";

export default function EncerrarAcessosBotao() {
  const [clicado, setClicado] = useState(false);

  return (
    <>
      <div className="mt-4">
        <Botao variante="secundario" larguraTotal onClick={() => setClicado(true)}>
          Encerrar outros acessos
        </Botao>
      </div>
      <p className="mt-4 text-xs text-gray-500" role="status">
        {clicado
          ? "Não há outros acessos ativos. Nenhuma sessão foi encerrada nesta demonstração."
          : "Nenhuma sessão será encerrada nesta demonstração."}
      </p>
    </>
  );
}
