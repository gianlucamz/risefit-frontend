"use client";

import Image from "next/image";
import { useState } from "react";
import { produtos, type Produto } from "@/data/produtos";
import { useCarrinho } from "@/lib/carrinho";
import { formatarMoeda } from "@/data/aluno";
import {
  Botao,
  BotaoLink,
  Cartao,
  Divisor,
  IconeCarrinho,
  LinhaInfo,
  LinkSeta,
  PainelEstado,
} from "./PainelUI";

function mascararCep(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export default function CarrinhoConteudo() {
  const { itens, alterarQuantidade, remover } = useCarrinho();
  const [cep, setCep] = useState("");
  const [erroCep, setErroCep] = useState("");
  const [cepConsultado, setCepConsultado] = useState("");
  const [aviso, setAviso] = useState(false);

  const linhas = itens
    .map((item) => ({
      ...item,
      produto: produtos.find((p) => p.id === item.id),
    }))
    .filter((l): l is typeof l & { produto: Produto } => Boolean(l.produto));

  const quantidadeTotal = linhas.reduce((s, l) => s + l.quantidade, 0);
  const subtotal = linhas.reduce((s, l) => s + l.quantidade * l.produto.preco, 0);

  if (linhas.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <PainelEstado
          icone={<IconeCarrinho />}
          titulo="Seu carrinho está vazio"
          descricao="Você ainda não adicionou produtos. Explore a loja para escolher o que procura."
        >
          <BotaoLink href="/loja" larguraTotal>
            Explorar Loja RiseFit
          </BotaoLink>
        </PainelEstado>
      </div>
    );
  }

  function calcularFrete(evento: React.FormEvent) {
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
    <div className="grid items-start gap-6 lg:grid-cols-[1.7fr_1fr]">
      <div className="space-y-6">
        <Cartao titulo="Produtos selecionados">
          <ul className="divide-y divide-gray-200 border-b border-gray-200">
            {linhas.map(({ produto, quantidade }) => (
              <li key={produto.id} className="flex gap-5 py-4 first:pt-0">
                <div className="relative flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 text-brand/40">
                  {produto.imagem ? (
                    <Image src={produto.imagem} alt="" fill sizes="80px" className="object-contain p-1" />
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-dark">{produto.nome}</p>
                  {produto.detalhe && (
                    <p className="mt-1 text-sm text-gray-500">{produto.detalhe}</p>
                  )}
                  <p className="mt-1 font-semibold text-dark">
                    {formatarMoeda(produto.preco)}
                  </p>
                  <div className="mt-1 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1" role="group" aria-label={`Quantidade de ${produto.nome}`}>
                      <button
                        type="button"
                        onClick={() => alterarQuantidade(produto.id, quantidade - 1)}
                        aria-label="Diminuir quantidade"
                        className="h-7 w-7 cursor-pointer rounded hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="w-6 text-center" aria-live="polite">{quantidade}</span>
                      <button
                        type="button"
                        onClick={() => alterarQuantidade(produto.id, quantidade + 1)}
                        aria-label="Aumentar quantidade"
                        className="h-7 w-7 cursor-pointer rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remover(produto.id)}
                      className="cursor-pointer font-medium text-brand hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <LinkSeta href="/loja">Continuar comprando</LinkSeta>
          </div>
        </Cartao>

        <Cartao titulo="Calcular frete">
          <form onSubmit={calcularFrete} noValidate>
            <label htmlFor="cep-entrega" className="mb-2 block text-sm font-semibold text-dark">
              CEP de entrega
            </label>
            <div className="flex gap-3">
              <input
                id="cep-entrega"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => setCep(mascararCep(e.target.value))}
                aria-invalid={Boolean(erroCep)}
                aria-describedby="cep-entrega-dica"
                className={`h-12 min-w-0 flex-1 rounded-md border bg-white px-4 text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 ${
                  erroCep ? "border-red-500" : "border-gray-300 focus:border-brand"
                }`}
              />
              <Botao type="submit">Calcular</Botao>
            </div>
            <p
              id="cep-entrega-dica"
              className={`mt-3 text-xs ${erroCep ? "text-red-600" : "text-gray-500"}`}
              role="status"
            >
              {erroCep ||
                (cepConsultado
                  ? `CEP ${cepConsultado}: frete e prazo serão confirmados pela equipe (cálculo indisponível nesta demonstração).`
                  : "Frete e prazo de entrega: a confirmar após a consulta.")}
            </p>
          </form>
        </Cartao>
      </div>

      <div className="space-y-4">
        <Cartao titulo="Resumo da compra">
          <dl>
            <LinhaInfo
              rotulo={`Produtos (${quantidadeTotal} ${quantidadeTotal === 1 ? "item" : "itens"})`}
              valor={formatarMoeda(subtotal)}
            />
            <LinhaInfo rotulo="Frete" valor="A confirmar" />
          </dl>
          <Divisor />
          <dl>
            <LinhaInfo rotulo="Subtotal dos produtos" valor={formatarMoeda(subtotal)} />
            <LinhaInfo rotulo="Total com frete" valor="A confirmar" />
          </dl>
          <p className="mt-3 text-xs text-gray-500">
            Compra de produtos da Loja RiseFit, separada da assinatura da academia.
          </p>
        </Cartao>
        <Botao larguraTotal onClick={() => setAviso(true)}>
          Continuar para entrega e pagamento
        </Botao>
        {aviso && (
          <p role="status" className="text-center text-xs text-gray-500">
            A etapa de entrega e pagamento ainda não está disponível nesta demonstração.
          </p>
        )}
      </div>
    </div>
  );
}
