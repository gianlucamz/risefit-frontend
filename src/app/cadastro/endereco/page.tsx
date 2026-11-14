import type { Metadata } from "next";
import CadastroEnderecoForm from "@/components/CadastroEnderecoForm";

export const metadata: Metadata = {
  title: "Complete seu Cadastro | RiseFit",
  description:
    "Informe seu endereço de cobrança e forma de pagamento para finalizar o cadastro na RiseFit.",
};

export default function CadastroEnderecoPage() {
  return (
    <main className="flex justify-center bg-[#ededed]">
      <div className="w-full max-w-[1240px] bg-white px-4 pt-6 pb-12 sm:px-10 lg:min-h-[976px] lg:pt-[46px]">
        <div className="mx-auto max-w-[920px]">
          <CadastroEnderecoForm />
        </div>
      </div>
    </main>
  );
}
