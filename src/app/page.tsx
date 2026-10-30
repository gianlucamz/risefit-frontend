import Hero from "@/components/Hero";
import Planos from "@/components/Planos";
import SobreNos from "@/components/SobreNos";

export default function Home() {
  return (
    <main>
      <Hero />
      <Planos />
      <section id="sobre-nos">
        <SobreNos />
      </section>
    </main>
  );
}
