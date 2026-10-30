import Link from "next/link";

// Dados dos planos. Para mudar preço ou texto, é só editar aqui.
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
      <div className="mx-auto max-w-[1440px] px-6 lg:px-14">
        {/* Título da seção */}
        <p className="text-center text-xs tracking-widest text-gray-600">
          NOSSOS PLANOS
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold lg:text-4xl">
          Escolha o plano ideal para você
        </h2>

        {/* Cards: o .map() cria um card para cada plano da lista acima */}
        <div className="mx-auto mt-14 grid max-w-[1100px] gap-8 lg:grid-cols-3">
          {planos.map((plano) => (
            <div
              key={plano.nome}
              className={`relative flex flex-col rounded-2xl bg-white p-8 ${
                plano.destaque
                  ? "border-2 border-brand shadow-lg lg:scale-105"
                  : "border border-gray-300"
              }`}
            >
              {/* Selo "Mais escolhido" (só no plano em destaque) */}
              {plano.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-brand bg-white px-4 py-1 text-xs font-medium text-brand">
                  Mais escolhido
                </span>
              )}

              <h3 className="text-2xl font-bold">{plano.nome}</h3>
              <p className="mt-2 text-sm text-gray-600">{plano.descricao}</p>

              {/* Preço */}
              <p className="mt-6 border-b border-gray-300 pb-4">
                <span className="text-lg font-semibold">R$ </span>
                <span className="text-4xl font-bold">{plano.preco}</span>
                <span className="text-sm text-gray-600">/mês</span>
              </p>

              {/* Lista de benefícios */}
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

              {/* Botão (o link "#" é provisório, depois trocamos) */}
              <Link
                href={`/cadastro?plano=${plano.nome.toLowerCase()}`}
                className={`mt-8 rounded-lg px-6 py-3 text-center text-sm font-medium ${
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
