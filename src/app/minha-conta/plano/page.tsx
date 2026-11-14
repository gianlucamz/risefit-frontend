import type { Metadata } from "next";
import AlterarPlano from "@/components/AlterarPlano";
import { PaginaInterna } from "@/components/PainelUI";

export const metadata: Metadata = { title: "Alterar meu plano | RiseFit" };

export default function AlterarPlanoPage() {
  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Alterar meu plano"
      subtitulo="Compare as opções e revise sua escolha antes de solicitar a mudança."
    >
      <AlterarPlano />
    </PaginaInterna>
  );
}
