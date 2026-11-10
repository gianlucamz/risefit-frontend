import LojaCatalogo from "@/components/LojaCatalogo";

export const metadata = {
  title: "Loja | RiseFit",
  description: "Equipamentos e suplementos para potencializar seus treinos.",
};

// O header e o footer já vêm do layout do site.
export default function Loja() {
  return (
    <main className="bg-[#f8f9fa]">
      <LojaCatalogo />
    </main>
  );
}
