import Link from "next/link";

const planos = [
  {
    nome: "Essencial",
    descricao: "O plano ideal para quem está começando e quer cuidar da saúde.",
    preco: "99,90",
    beneficios: [
      "Acesso à musculação",
      "Aulas de grupo (horários limitados)",
      "Avaliação física inicial",
      "Acompanhamento básico",
      "Uso do vestiário",
    ],
    botao: "Assinar Essencial",
    destaque: false,
  },
  {
    nome: "Personalizado",
    descricao:
      "O plano completo para quem busca resultados com acompanhamento.",
    preco: "139,90",
    beneficios: [
      "Tudo do plano Essencial",
      "Treino personalizado",
      "Acompanhamento de profissionais",
      "Avaliação física periódica",
      "Suporte nutricional (avaliação inicial)",
    ],
    botao: "Assinar Personalizado",
    destaque: true,
  },
  {
    nome: "Premium",
    descricao: "A experiência completa para quem busca o máximo de resultado.",
    preco: "159,90",
    beneficios: [
      "Tudo do plano Personalizado",
      "Acompanhamento nutricional completo",
      "Consultas com especialistas",
      "Acesso liberado a todas as unidades",
      "Prioridade nos horários",
    ],
    botao: "Assinar Premium",
    destaque: false,
  },
];

export default function Planos() {
  return (
    <section id="planos" className="scroll-mt-24 py-16 lg:py-24">
      <div className="mx-auto max-w-360 px-6 lg:px-14">
        <p className="text-center text-sm text-gray-900 font-semibold">
          NOSSOS PLANOS
        </p>
        <h2 className="mt-2 text-center text-3xl font-black lg:text-5xl">
          Escolha o plano ideal para você
        </h2>

        <div className="mx-auto mt-14 grid max-w-275 gap-8 lg:grid-cols-3">
          {planos.map((plano) => (
            <div
              key={plano.nome}
              className={`relative flex flex-col rounded-2xl bg-white p-8 ${
                plano.destaque
                  ? "border-2 border-brand shadow-lg"
                  : "border border-gray-600"
              }`}
            >
              {plano.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-brand bg-brand px-4 py-1 text-xs font-medium text-white">
                  Mais escolhido
                </span>
              )}

              <h3 className="text-3xl font-black">{plano.nome}</h3>
              <p className="mt-2 text-sm text-black">{plano.descricao}</p>

              <p className="mt-6 border-b border-gray-500 pb-4">
                <span className="text-lg font-bold">R$ </span>
                <span className="text-4xl font-black">{plano.preco}</span>
                <span className="text-3xl font-black">/mês</span>
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                {plano.beneficios.map((beneficio) => (
                  <li key={beneficio} className="flex items-start gap-3">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-1 shrink-0 text-brand"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {beneficio}
                  </li>
                ))}
              </ul>

              <Link
                href={`/cadastro?plano=${plano.nome.toLowerCase()}`}
                className={`mt-8 rounded-full px-6 py-3 text-center text-sm font-medium ${
                  plano.destaque
                    ? "bg-brand text-white"
                    : "border border-brand text-brand"
                }`}
              >
                {plano.botao}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
