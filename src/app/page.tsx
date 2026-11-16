import Hero from "@/components/Hero";
import Planos from "@/components/Planos";
import SobreNos from "@/components/SobreNos";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="bg-[#f8f8f9]">
        <Planos />
        <section id="sobre-nos">
          <SobreNos />
        </section>
      </div>
    </main>
  );
}
