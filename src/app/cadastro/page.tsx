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
      <div className="w-full max-w-310 bg-white px-4 pt-6 pb-12 sm:px-10 lg:min-h-244 lg:pt-11.5">
        <div className="mx-auto max-w-230">
          <CadastroForm />
        </div>
      </div>
    </main>
  );
}
