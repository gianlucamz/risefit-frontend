import type { Metadata } from "next";
import EditarDadosForm from "@/components/EditarDadosForm";
import { PaginaInterna } from "@/components/PainelUI";

export const metadata: Metadata = { title: "Editar dados e contato | RiseFit" };

export default function EditarDadosPage() {
  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Editar dados e contato"
      subtitulo="Mantenha suas informações de cadastro atualizadas."
      largura="estreita"
    >
      <EditarDadosForm />
    </PaginaInterna>
  );
}
