import type { Metadata } from "next";
import CarrinhoConteudo from "@/components/CarrinhoConteudo";
import { PaginaInterna } from "@/components/PainelUI";

export const metadata: Metadata = { title: "Meu carrinho | RiseFit" };

export default function CarrinhoPage() {
  return (
    <PaginaInterna
      voltar={{ href: "/loja", texto: "Loja" }}
      titulo="Meu carrinho"
      subtitulo="Confira os produtos e as quantidades antes de continuar."
    >
      <CarrinhoConteudo />
    </PaginaInterna>
  );
}
