"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCarrinho } from "@/lib/carrinho";

function mascararCep(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

// Botões de compra + consulta de frete da página de produto.
// O carrinho fica no navegador; o frete ainda não tem cálculo real (sem backend).
export default function ProdutoCompra({
  produtoId,
  emEstoque,
}: {
  produtoId: number;
  emEstoque: boolean;
}) {
  const router = useRouter();
  const { itens, adicionar } = useCarrinho();
  const noCarrinho = itens.find((i) => i.id === produtoId)?.quantidade ?? 0;
  const [adicionado, setAdicionado] = useState(false);
  const [cep, setCep] = useState("");
  const [erroCep, setErroCep] = useState("");
  const [cepConsultado, setCepConsultado] = useState("");

  function comprarAgora() {
    if (noCarrinho === 0) adicionar(produtoId);
    router.push("/carrinho");
  }

  function adicionarAoCarrinho() {
    adicionar(produtoId);
    setAdicionado(true);
  }

  function consultarFrete(evento: React.FormEvent) {
    evento.preventDefault();
    if (cep.replace(/\D/g, "").length !== 8) {
      setErroCep("Informe um CEP com 8 números.");
      setCepConsultado("");
      return;
    }
    setErroCep("");
    setCepConsultado(cep);
  }

  return (
    <>
      <div className="mt-2.5 space-y-2.5">
        <button
          type="button"
          onClick={comprarAgora}
          disabled={!emEstoque}
          className="flex h-10.5 w-full cursor-pointer items-center justify-center rounded-md bg-brand text-lg font-semibold text-white transition-colors hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Comprar agora
        </button>
        <button
          type="button"
          onClick={adicionarAoCarrinho}
          disabled={!emEstoque}
          className="flex h-10.5 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#ececee] text-lg font-semibold text-brand transition-colors hover:bg-[#e2dcfb] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg width="21" height="20" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 1h3l2.6 12.5h12.2L22 5H5.5" />
            <circle cx="8.5" cy="19" r="1.5" />
            <circle cx="17" cy="19" r="1.5" />
            <path d="M14 6.5v5M11.5 9h5" />
          </svg>
          Adicionar ao carrinho
        </button>
        {(adicionado || noCarrinho > 0) && (
          <p role="status" className="text-center text-sm text-gray-600">
            {noCarrinho} {noCarrinho === 1 ? "unidade" : "unidades"} no carrinho ·{" "}
            <Link href="/carrinho" className="font-semibold text-brand hover:underline">
              Ver carrinho
            </Link>
          </p>
        )}
      </div>

      <form onSubmit={consultarFrete} noValidate className="mt-8">
        <label htmlFor="cep-produto" className="block text-sm font-bold text-dark uppercase">
          Consulte seu frete
        </label>
        <div className="mt-3 flex gap-2">
          <input
            id="cep-produto"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="Insira seu CEP*"
            value={cep}
            onChange={(e) => setCep(mascararCep(e.target.value))}
            aria-invalid={Boolean(erroCep)}
            aria-describedby="cep-produto-status"
            className={`h-12.75 min-w-0 flex-1 rounded-sm border bg-[#f7f7f8] px-4 text-sm text-dark placeholder:text-gray-500 focus:ring-2 focus:ring-brand/20 focus:outline-none ${
              erroCep ? "border-red-500" : "border-gray-300 focus:border-brand"
            }`}
          />
          <button
            type="submit"
            aria-label="Consultar frete"
            className="flex h-12.75 w-12.75 shrink-0 cursor-pointer items-center justify-center rounded-sm bg-brand text-white transition-colors hover:bg-[#6d28d9]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </div>
        <p id="cep-produto-status" role="status" className={`mt-2 text-xs ${erroCep ? "text-red-600" : "text-gray-600"}`}>
          {erroCep ||
            (cepConsultado
              ? `CEP ${cepConsultado}: frete e prazo serão confirmados pela equipe (cálculo indisponível nesta demonstração).`
              : null)}
        </p>
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-brand underline"
        >
          Não lembro meu CEP
        </a>
      </form>
    </>
  );
}
