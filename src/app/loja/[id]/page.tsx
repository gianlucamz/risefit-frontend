import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Estrelas from "@/components/Estrelas";
import ProdutoAvaliacoes from "@/components/ProdutoAvaliacoes";
import ProdutoCompra from "@/components/ProdutoCompra";
import { detalhesProduto } from "@/data/produtoDetalhes";
import { produtoPorId, produtos } from "@/data/produtos";

export function generateStaticParams() {
  return produtos.map((p) => ({ id: String(p.id) }));
}

function buscar(id: string) {
  const produto = produtoPorId(Number(id));
  const detalhes = produto && detalhesProduto(produto.id);
  return produto && detalhes ? { produto, detalhes } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/loja/[id]">): Promise<Metadata> {
  const { id } = await params;
  const achado = buscar(id);
  return { title: achado ? `${achado.produto.nome} | Loja RiseFit` : "Produto | Loja RiseFit" };
}

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const numero = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Parcelamento sem juros com parcela mínima de R$ 5,00 (até 12x).
function parcelamento(preco: number) {
  const vezes = Math.max(1, Math.min(12, Math.floor(preco / 5)));
  return vezes > 1 ? { vezes, valor: preco / vezes } : null;
}

// Página de produto da loja. Medidas do modelo (1440px): conteúdo de 1046px,
// coluna da esquerda 586px e coluna de compra 396px.
export default async function ProdutoPage({ params }: PageProps<"/loja/[id]">) {
  const { id } = await params;
  const achado = buscar(id);
  if (!achado) notFound();
  const { produto, detalhes } = achado;

  const parcelas = parcelamento(produto.preco);
  const nota = detalhes.avaliacao.toFixed(1);
  const relacionados = produtos.filter((p) => p.id !== produto.id);

  return (
    <main className="bg-white px-5 pt-6 pb-12 lg:px-6 lg:pt-25 lg:pb-18">
      <div className="mx-auto max-w-261.5">
        <Link href="/loja" className="text-sm font-medium text-brand hover:underline lg:hidden">
          ← Loja
        </Link>

        <div className="mt-4 flex flex-col gap-10 lg:mt-0 lg:grid lg:grid-cols-[586px_396px] lg:justify-between lg:gap-0">
          {/* ---------- Coluna da esquerda ---------- */}
          <div className="contents lg:block">
            {/* Galeria */}
            <section aria-label="Imagens do produto" className="order-1">
              <div className="relative mx-auto aspect-[470/400] w-full max-w-117.5 lg:mt-9.5">
                {produto.imagem ? (
                  <Image
                    src={produto.imagem}
                    alt={produto.nome}
                    fill
                    priority
                    sizes="(min-width: 1024px) 470px, 100vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 rounded-xl bg-gray-100" />
                )}
              </div>
              {/* Miniaturas: só há uma foto por produto por enquanto */}
              {produto.imagem && (
                <ul className="mt-6 flex justify-center gap-3 lg:mt-10.5">
                  <li>
                    <span className="relative block h-17.75 w-15.5 overflow-hidden rounded-sm border-2 border-brand bg-white">
                      <Image src={produto.imagem} alt="" fill sizes="62px" className="object-contain p-1" />
                    </span>
                  </li>
                </ul>
              )}
            </section>

            {/* Descrição */}
            <section className="order-3 lg:mt-14 lg:px-7">
              <h2 className="text-xl font-bold text-dark uppercase lg:text-[22px]">Descrição do produto</h2>
              <div className="mt-2 space-y-6 text-base leading-[25px] text-dark lg:text-[17.5px]">
                {detalhes.descricao.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>

            {/* Avaliações */}
            <section className="order-5 lg:mt-14 lg:px-7" aria-labelledby="titulo-avaliacoes">
              <h2 id="titulo-avaliacoes" className="text-xl font-bold text-dark uppercase lg:text-[22px]">
                Avaliações
              </h2>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-5xl font-semibold text-dark">{nota}</span>
                <Estrelas nota={detalhes.avaliacao} tamanho={44} />
              </div>
              <p className="mt-1 text-[15px] text-gray-500">({detalhes.totalAvaliacoes} Avaliações)</p>
              <div className="lg:-ml-2">
                <ProdutoAvaliacoes avaliacoes={detalhes.avaliacoes} />
              </div>
            </section>
          </div>

          {/* ---------- Coluna de compra ---------- */}
          <div className="contents lg:block">
            <section className="order-2" aria-labelledby="titulo-produto">
              <h1 id="titulo-produto" className="text-[22px] leading-[30px] font-bold text-dark lg:text-[25.5px] lg:leading-[33px]">
                {produto.nome}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-dark">
                <Estrelas nota={detalhes.avaliacao} tamanho={20} />({detalhes.totalAvaliacoes})
              </p>
              <p className="mt-3 text-[38px] leading-none font-extrabold text-brand">{moeda.format(produto.preco)}</p>
              <p className="mt-1 text-[13px] text-gray-600">À vista</p>
              {parcelas && (
                <p className="mt-2 text-[13px] text-gray-600">
                  Em até {parcelas.vezes}x de <strong className="text-dark">{numero(parcelas.valor)}</strong> sem juros
                </p>
              )}
              <p className={`mt-3 text-[13px] font-semibold ${detalhes.emEstoque ? "text-brand" : "text-red-600"}`}>
                {detalhes.emEstoque ? "Em estoque" : "Indisponível"}
              </p>

              <ProdutoCompra produtoId={produto.id} emEstoque={detalhes.emEstoque} />
            </section>

            {/* Ficha técnica */}
            <section className="order-4 lg:mt-7.5" aria-labelledby="titulo-ficha">
              <h2 id="titulo-ficha" className="text-xl font-bold text-dark uppercase lg:text-[19px]">
                Ficha técnica
              </h2>
              <dl className="mt-1.5 space-y-5 text-[15px] leading-5 text-dark">
                {detalhes.ficha.map((bloco) => (
                  <div key={bloco.titulo}>
                    <dt className="font-semibold">{bloco.titulo}:</dt>
                    {bloco.itens.map((item) => (
                      <dd key={item}>- {item}</dd>
                    ))}
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* ---------- Relacionados ---------- */}
          <section className="order-6 lg:col-span-2 lg:mt-14" aria-labelledby="titulo-relacionados">
            <h2 id="titulo-relacionados" className="text-xl font-bold text-dark uppercase lg:text-[22px]">
              Produtos relacionados
            </h2>
            <ul className="-mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-4 lg:mx-0 lg:mt-8 lg:gap-4.5 lg:overflow-visible lg:px-0">
              {relacionados.map((p) => (
                <li key={p.id} className="w-44 shrink-0 snap-start">
                  <Link
                    href={`/loja/${p.id}`}
                    className="block h-full rounded-xl bg-white p-2.5 shadow-[0_2px_8px_rgba(10,12,17,0.12)] transition-shadow hover:shadow-[0_4px_14px_rgba(124,58,237,0.25)]"
                  >
                    <span className="relative block h-30 w-full">
                      {p.imagem && (
                        <Image src={p.imagem} alt="" fill sizes="176px" className="object-contain" />
                      )}
                    </span>
                    <span className="mt-2 line-clamp-3 text-[11px] leading-[14px] font-bold text-dark">{p.nome}</span>
                    <span className="mt-1 block text-[13px] font-extrabold text-dark">{moeda.format(p.preco)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
