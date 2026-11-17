"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "./PainelUI";
import { sair } from "@/lib/sessao";

export default function EncerrarAcessosBotao() {
  const router = useRouter();
  const [encerrado, setEncerrado] = useState(false);

  function handleEncerrarOutros() {
    setEncerrado(true);
  }

  function handleSairConta() {
    sair();
    router.push("/");
  }

  return (
    <>
      <div className="mt-4 flex flex-col gap-2.5">
        <Botao
          variante="secundario"
          larguraTotal
          onClick={handleEncerrarOutros}
        >
          Encerrar outros acessos
        </Botao>
        <button
          type="button"
          onClick={handleSairConta}
          className="cursor-pointer text-xs font-semibold text-red-500 hover:text-red-700 transition-colors py-1 text-center"
        >
          Encerrar sessão neste dispositivo
        </button>
      </div>
      {encerrado && (
        <p className="mt-3 text-xs text-green-700 font-medium" role="status">
          ✓ Todos os outros acessos foram encerrados com sucesso. Sua sessão atual permanece protegida.
        </p>
      )}
    </>
  );
}
