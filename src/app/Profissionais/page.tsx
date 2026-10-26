import ProfissionaisBanner from "@/components/ProfissionaisBanner";
import ProfissionaisExplorar from "@/components/ProfissionaisExplorar";

export const metadata = {
  title: "Profissionais | RiseFit",
};

export default function Profissionais() {
  return (
    <main>
      <ProfissionaisBanner />
      <ProfissionaisExplorar />
    </main>
  );
}