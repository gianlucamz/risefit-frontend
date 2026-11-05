import type { Metadata } from "next";
import CadastroEnderecoForm from "@/components/CadastroEnderecoForm";

export const metadata: Metadata = {
  title: "Complete seu Cadastro | RiseFit",
  description:
    "Informe seu endereço de cobrança e forma de pagamento para finalizar o cadastro na RiseFit.",
};

export default function CadastroEnderecoPage() {
  return (
    <main className="min-h-[calc(100vh-100px)] bg-[#ececec] px-3 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-260 rounded-sm sm:rounded-md bg-white px-4 py-8 sm:px-10 sm:py-12 lg:px-16 shadow-xs">
        <CadastroEnderecoForm mostrarBotaoMock={true} />
      </div>
    </main>
  );
}
