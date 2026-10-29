import Image from "next/image";

const pilares = [
  {
    titulo: "Acolhimento sem insegurança",
    descricao:
      "Ambiente pensado para quem está começando, com orientação desde a primeira visita.",
  },
  {
    titulo: "Profissionais integrados ao seu plano",
    descricao:
      "Acompanhamento de profissionais conforme o plano que você escolher.",
  },
  {
    titulo: "Acompanhamento dentro e fora do treino",
    descricao:
      "Treino do dia, histórico e progresso reunidos na Área do Aluno.",
  },
];

export default function SobreNos() {
  return (
    <section id="sobre-nos" className="scroll-mt-24 pb-16 lg:pb-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-14">
        {/* Título da seção */}
        <p className="text-center text-xs tracking-widest text-gray-600">
          SOBRE NÓS
        </p>
        <h2 className="mt-4 max-w-4xl border-b-2 border-black pb-4 text-3xl font-bold lg:text-4xl">
          Mais do que um espaço de treino.
          <br />
          <span className="text-[#7c3aed]">O suporte que você precisa para evoluir.</span>
        </h2>

        {/* Texto + imagem lado a lado */}
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          <p className="max-w-2xl text-lg leading-relaxed lg:text-xl">
            Iniciar uma rotina de exercícios não precisa ser difícil, solitário
            ou intimidador. Na RiseFit, entendemos que o maior desafio não é
            apenas ir à academia, mas sentir-se seguro e orientado em cada passo
            do caminho. Por isso, fomos criados para romper com o modelo
            tradicional: combinamos um ambiente acolhedor, profissionais
            integrados aos nossos planos e tecnologia de ponta para acompanhar a
            sua jornada dentro e fora do treino.
          </p>

          {/* Imagem */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src="/sobrenos.png"
              alt="imagem sobre nos"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Nossos pilares */}
        <h3 className="mt-16 text-2xl font-bold lg:text-3xl">Nossos pilares</h3>

        <div className="mt-6 border-t-2 border-black">
          {pilares.map((pilar, indice) => (
            <div
              key={pilar.titulo}
              className="grid gap-3 border-b-1 border-black py-8 lg:grid-cols-2 lg:gap-10"
            >
              <div className="flex items-start gap-6">
                <span className="w-6 text-base text-[#7c3aed] lg:text-lg">{indice + 1}</span>
                <p className="max-w-sm text-lg font-medium lg:text-xl">{pilar.titulo}</p>
              </div>
              <p className="max-w-lg text-base text-gray-700 lg:text-lg">{pilar.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}