import Image from "next/image";

// Cada título/descrição vem em duas linhas, como no design (no celular o texto quebra sozinho)
const pilares = [
  {
    titulo: ["Acolhimento sem", "insegurança"],
    descricao: ["Ambiente pensado para quem está começando,", "com orientação desde a primeira visita."],
  },
  {
    titulo: ["Profissionais integrados ao", "seu plano"],
    descricao: ["Acompanhamento de profissionais", "conforme o plano que você escolher."],
  },
  {
    titulo: ["Acompanhamento dentro", "e fora do treino"],
    descricao: ["Treino do dia, histórico e progresso", "reunidos na Área do Aluno."],
  },
];

function DuasLinhas({ linhas }: { linhas: string[] }) {
  return (
    <>
      {linhas[0]} <br className="hidden lg:inline" />
      {linhas[1]}
    </>
  );
}

export default function SobreNos() {
  return (
    <div className="scroll-mt-24 pb-12 pt-16 lg:pb-[34px] lg:pt-[60px]">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-[46px] lg:pr-[70px]">
        <p className="text-center text-sm uppercase leading-none text-black lg:-ml-[46px] lg:-mr-[70px] lg:pr-[10px] lg:text-base">
          Sobre nós
        </p>

        <div className="mt-6 border-b border-black pb-5 lg:mt-[26px] lg:w-[860px] lg:pb-[25px] lg:pl-[12px] lg:ml-[19px]">
          <h2 className="text-[28px] font-bold leading-[1.15] tracking-[0.01em] text-black lg:text-[42px] lg:leading-[46px]">
            Mais do que um espaço de treino.
            <br />
            <span className="text-brand">O suporte que você precisa para evoluir.</span>
          </h2>
        </div>

        {/* Texto + imagem lado a lado */}
        <div className="mt-8 flex flex-col gap-8 lg:mt-[44px] lg:flex-row lg:items-start lg:justify-between lg:gap-0">
          <p className="text-lg leading-[1.35] text-black lg:mt-[28px] lg:ml-[43px] lg:w-[580px] lg:text-[26px] lg:leading-[29px]">
            Iniciar uma rotina de exercícios não precisa ser difícil, solitário ou intimidador. Na
            RiseFit, entendemos que o maior desafio não é apenas ir à academia, mas sentir-se
            seguro e orientado em cada passo do caminho. Por isso, fomos criados para romper com o
            modelo tradicional: combinamos um ambiente acolhedor, profissionais integrados aos
            nossos planos e tecnologia de ponta para acompanhar a sua jornada dentro e fora do
            treino.
          </p>

          <div className="relative aspect-[600/330] w-full shrink-0 overflow-hidden lg:mr-[6px] lg:w-[600px]">
            <Image
              src="/design/sobre-nos.jpg"
              alt="Área de musculação da RiseFit com halteres e equipamentos"
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Nossos pilares */}
        <h3 className="mt-12 text-2xl font-semibold leading-none text-black lg:ml-[52px] lg:mt-[78px] lg:text-[30px]">
          Nossos pilares
        </h3>

        <div className="mt-4 border-t border-black lg:mt-[18px]">
          {pilares.map((pilar, indice) => (
            <div
              key={pilar.titulo[0]}
              className="grid grid-cols-[32px_1fr] gap-x-3 gap-y-2 border-b border-black py-6 lg:h-[130px] lg:grid-cols-[67px_599px_1fr] lg:gap-0 lg:py-0"
            >
              <span className="row-span-2 text-xl leading-none font-medium text-brand lg:row-span-1 lg:pl-[4px] lg:pt-[45px] lg:text-[26px]">
                {indice + 1}
              </span>
              <p className="text-lg font-semibold leading-snug text-black lg:pt-[37px] lg:text-[26px] lg:leading-[29px]">
                <DuasLinhas linhas={pilar.titulo} />
              </p>
              <p className="text-base leading-snug text-black lg:pt-[34px] lg:text-[26px] lg:leading-[29px]">
                <DuasLinhas linhas={pilar.descricao} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
