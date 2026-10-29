import Image from "next/image";
import Link from "next/link";

// Página Área do Aluno: salve como src/app/area-do-aluno/page.tsx
// O header e o footer já vêm do layout do site, então aqui ficam só o hero e os cards.
// O hero usa a imagem public/banneraluno.png (2172x724).

const treinoDoDia = {
  titulo: "Treino de Superior (Costas e Bíceps)",
  exercicios: [
    { nome: "Barra fixa", detalhe: "3 séries · 8 a 12 repetições" },
    { nome: "Remada curvada", detalhe: "3 séries · 8 a 12 repetições" },
    { nome: "Puxada alta", detalhe: "3 séries · 8 a 12 repetições" },
    { nome: "Rosca direta", detalhe: "3 séries · 8 a 12 repetições" },
    { nome: "Rosca alternada", detalhe: "3 séries · 8 a 12 repetições" },
  ],
};

const resumo = {
  concluidos: 0,
  meta: 5,
  tempo: "0h 00min",
  calorias: "0 kcal",
  peso: "Não informado",
};

export default function AreaDoAlunoPage() {
  return (
    <main>
      {/* ============ HERO (banner) ============ */}
      <section className="bg-[#0b0b10] text-white">
        {/* Largura total da tela, sem bordas laterais.
            [container-type:inline-size] faz o texto escalar pela largura do banner (cqw). */}
        <div className="relative w-full [container-type:inline-size]">
          <h1 className="sr-only">Área do Aluno</h1>

          {/* Mesma proporção da imagem: nada é cortado em nenhuma tela */}
          <div className="relative aspect-[2172/724] w-full">
            <Image
              src="/banneraluno1.png"
              alt="Academia moderna com esteiras e aparelhos de musculação"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* Título: no desktop fica sobre a parte escura, centralizado na vertical.
              No celular fica abaixo da imagem, para não ficar minúsculo. */}
          {/* Título: no desktop fica abaixo dos pontos, alinhado à esquerda deles.
    No celular fica abaixo da imagem. */}
          <div className="px-5 py-8 text-center md:absolute md:left-[50%] md:right-[6%] md:top-[40%] md:p-0 md:text-left">
            <p
              aria-hidden="true"
              className="text-5xl font-extrabold italic uppercase leading-[0.95] tracking-tight md:text-[6cqw]"
            >
              Área do
              <br />
              <span className="text-[#7c3aed]">Aluno</span>
            </p>
          </div>
        </div>
      </section>

      {/* ============ CARDS ============ */}
      <section className="bg-[#efeff1] px-6 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* Meu treino de hoje */}
          <article className="rounded-2xl bg-white p-6 shadow-sm lg:p-8">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-bold lg:text-xl">Meu treino de hoje</h2>
              <Link
                href="/area-do-aluno/treinos"
                className="inline-flex items-center gap-1 text-sm text-[#7c3aed] hover:underline"
              >
                Ver todos
                <ArrowRight />
              </Link>
            </header>

            <p className="mt-4 text-sm text-gray-800 lg:text-base">
              {treinoDoDia.titulo}
            </p>

            <ul className="mt-5 space-y-3">
              {treinoDoDia.exercicios.map((exercicio, i) => (
                <li
                  key={exercicio.nome}
                  className="flex items-center gap-4 rounded-lg border border-gray-300 px-4 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-400 text-sm">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{exercicio.nome}</p>
                    <p className="text-xs text-gray-600">{exercicio.detalhe}</p>
                  </div>
                  <Chevron />
                </li>
              ))}
            </ul>
          </article>

          {/* Resumo da semana */}
          <article className="rounded-2xl bg-white p-6 shadow-sm lg:p-8">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-bold lg:text-xl">Resumo da semana</h2>
              <Link
                href="/area-do-aluno/resumo"
                className="inline-flex items-center gap-1 text-sm text-[#7c3aed] hover:underline"
              >
                Ver detalhes
                <ArrowRight />
              </Link>
            </header>

            <div className="mt-6 flex items-center gap-6">
              <ProgressRing atual={resumo.concluidos} meta={resumo.meta} />
              <div>
                <p className="font-semibold">Treino</p>
                <p className="text-sm text-gray-600">Treinos concluídos</p>
              </div>
            </div>

            <ul className="mt-6 divide-y divide-gray-200">
              <ResumoItem
                icone={<ClockIcon />}
                rotulo="Tempo de treino"
                valor={resumo.tempo}
              />
              <ResumoItem
                icone={<FlameIcon />}
                rotulo="Calorias queimadas"
                valor={resumo.calorias}
              />
              <ResumoItem
                icone={<ScaleIcon />}
                rotulo="Peso atual"
                valor={resumo.peso}
              />
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

/* ---------- Componentes auxiliares ---------- */

function ProgressRing({ atual, meta }: { atual: number; meta: number }) {
  const raio = 54;
  const circunferencia = 2 * Math.PI * raio;
  const progresso = Math.min(atual / meta, 1);

  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={raio} fill="none" stroke="#d4d4d8" strokeWidth="12" />
        <circle
          cx="64"
          cy="64"
          r={raio}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - progresso)}
        />
      </svg>
      <p className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
        {atual}
        <span className="text-gray-500">/{meta}</span>
      </p>
    </div>
  );
}

function ResumoItem({
  icone,
  rotulo,
  valor,
}: {
  icone: React.ReactNode;
  rotulo: string;
  valor: string;
}) {
  return (
    <li className="flex items-center gap-4 py-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-800">
        {icone}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-600">{rotulo}</p>
        <p className="font-semibold">{valor}</p>
      </div>
      <span className="text-xs text-gray-400">-0%</span>
    </li>
  );
}

const iconeBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: "h-5 w-5",
};

function ArrowRight() {
  return (
    <svg {...iconeBase} className="h-3.5 w-3.5">
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg {...iconeBase} className="h-4 w-4 text-gray-700">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...iconeBase}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg {...iconeBase}>
      <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2.3 1.2 1 2 2 2.2C11.5 8.5 11 5.8 12 3z" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg {...iconeBase}>
      <path d="M6 7h12l2 13H4L6 7z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
      <path d="M12 12v3" />
    </svg>
  );
}