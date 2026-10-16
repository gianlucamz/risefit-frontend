// Os 3 pilares da seção. Para mudar os textos, é só editar aqui.
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
        <h2 className="mt-4 max-w-xl border-b border-gray-400 pb-4 text-2xl font-bold lg:text-3xl">
          Mais do que um espaço de treino.
          <br />
          O suporte que você precisa para evoluir.
        </h2>

        {/* Texto + imagem lado a lado */}
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
          <p className="max-w-xl leading-relaxed">
            Iniciar uma rotina de exercícios não precisa ser difícil, solitário
            ou intimidador. Na RiseFit, entendemos que o maior desafio não é
            apenas ir à academia, mas sentir-se seguro e orientado em cada passo
            do caminho. Por isso, fomos criados para romper com o modelo
            tradicional: combinamos um ambiente acolhedor, profissionais
            integrados aos nossos planos e tecnologia de ponta para acompanhar a
            sua jornada dentro e fora do treino.
          </p>

          {/* Caixa preta provisória: depois trocamos por uma foto ou vídeo */}
          <div className="aspect-video w-full bg-black" />
        </div>

        {/* Nossos pilares */}
        <h3 className="mt-16 text-xl font-bold">Nossos pilares</h3>

        <div className="mt-6 border-t border-gray-300">
          {pilares.map((pilar, indice) => (
            <div
              key={pilar.titulo}
              className="grid gap-3 border-b border-gray-300 py-6 lg:grid-cols-2 lg:gap-10"
            >
              <div className="flex items-start gap-6">
                <span className="text-sm">{indice + 1}</span>
                <p className="max-w-xs font-medium">{pilar.titulo}</p>
              </div>
              <p className="max-w-md text-gray-700">{pilar.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}