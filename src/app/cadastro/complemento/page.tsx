import type { Metadata } from "next";
import CadastroComplementoForm from "@/components/CadastroComplementoForm";

export const metadata: Metadata = {
  title: "Complemento de Cadastro | RiseFit",
  description:
    "Só faltam mais algumas informações para completar o seu cadastro na RiseFit.",
};

export default function CadastroComplementoPage() {
  return (
    <main className="flex justify-center bg-[#ededed]">
      <div className="w-full max-w-[1240px] bg-white px-4 pt-6 pb-12 sm:px-10 lg:min-h-[976px] lg:pt-[46px]">
        <div className="mx-auto max-w-[920px]">
          <CadastroComplementoForm />
        </div>
      </div>
    </main>
  );
}
