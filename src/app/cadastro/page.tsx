import type { Metadata } from "next";
import CadastroForm from "@/components/CadastroForm";

export const metadata: Metadata = {
  title: "Cadastro | RiseFit - Sua jornada começa agora",
  description:
    "Faça seu cadastro na RiseFit e comece a transformar seus resultados hoje mesmo.",
};

export default function CadastroPage() {
  return (
    <main className="flex justify-center bg-[#ededed]">
      <div className="w-full max-w-[1240px] bg-white px-4 pt-6 pb-12 sm:px-10 lg:min-h-[976px] lg:pt-[46px]">
        <div className="mx-auto max-w-[920px]">
          <CadastroForm />
        </div>
      </div>
    </main>
  );
}
