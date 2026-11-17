"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ListaExercicios from "@/components/ListaExercicios";
import {
  formatarMoeda,
  resumoSemana,
  treinoDoDia,
} from "@/data/aluno";
import { useUsuarioLogado } from "@/lib/sessao";
import { obterUsuarioAPI, type UsuarioDetalhes } from "@/services/api";

export default function AreaDoAlunoPage() {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();
  const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);

  useEffect(() => {
    const sessaoStorage =
      typeof window !== "undefined"
        ? localStorage.getItem("usuario") || sessionStorage.getItem("usuario")
        : null;

    if (!sessaoStorage && !usuarioSessao) {
      router.push("/login");
      return;
    }

    const id =
      usuarioSessao?.id ||
      (sessaoStorage ? JSON.parse(sessaoStorage).id : null);

    if (!id) return;

    let ativo = true;

    obterUsuarioAPI(id)
      .then((dados) => {
        if (ativo) setUsuario(dados);
      })
      .catch((e) => console.error("Erro ao carregar dados do aluno:", e));

    return () => {
      ativo = false;
    };
  }, [usuarioSessao, router]);

  const assinatura = usuario?.assinaturas?.[0];
  const plano = assinatura?.plano;

  return (
    <main>
      {/* ============ HERO (banner) ============ */}
      <section className="bg-[#0b0b10] text-white">
        <div className="relative w-full @container">
          <h1 className="sr-only">Área do Aluno</h1>

          <div className="relative aspect-2172/724 w-full">
            <Image
              src="/banneraluno1.png"
              alt="Academia moderna com esteiras e aparelhos de musculação"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="px-5 py-8 text-center md:absolute md:left-[50%] md:right-[6%] md:top-[40%] md:p-0 md:text-left">
            <p
              aria-hidden="true"
              className="text-5xl font-extrabold italic uppercase leading-[0.95] tracking-tight md:text-[6cqw]"
            >
              Área do
              <br />
              <span className="text-brand">Aluno</span>
            </p>
          </div>
        </div>
      </section>

      {/* ============ CARDS ============ */}
      <section className="bg-[#efeff1] px-6 py-10 lg:px-14 lg:py-14">
        <div className="mx-auto grid max-w-360 gap-6 lg:grid-cols-[1.55fr_1fr]">
          {/* Meu treino de hoje */}
          <article className="rounded-2xl bg-white p-6 shadow-sm lg:p-8">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-bold lg:text-xl">Meu treino de hoje</h2>
              <Link
                href="/area-aluno/treinos"
                className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
              >
                Ver todos
                <ArrowRight />
              </Link>
            </header>

            <p className="mt-4 text-sm text-gray-800 lg:text-base">
              {treinoDoDia.titulo} ({treinoDoDia.foco})
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {treinoDoDia.diaSemana}, {treinoDoDia.dataLonga}
            </p>

            <div className="mt-5">
              <ListaExercicios
                exercicios={treinoDoDia.exercicios}
                hrefTreino={`/area-aluno/treinos/${treinoDoDia.id}`}
              />
            </div>
          </article>

          {/* Resumo da semana */}
          <article className="rounded-2xl bg-white p-6 shadow-sm lg:p-8">
            <header className="flex items-center justify-between">
              <h2 className="text-lg font-bold lg:text-xl">Resumo da semana</h2>
              <Link
                href="/area-aluno/historico"
                className="inline-flex items-center gap-1 text-sm text-brand hover:underline"
              >
                Ver detalhes
                <ArrowRight />
              </Link>
            </header>

            <div className="mt-6 flex items-center gap-6">
              <ProgressRing atual={resumoSemana.concluidos} meta={resumoSemana.meta} />
              <div>
                <p className="font-semibold">Treinos concluídos</p>
                <p className="text-sm text-gray-600">{resumoSemana.periodo}</p>
              </div>
            </div>

            <ul className="mt-6 divide-y divide-gray-200">
              <ResumoItem
                icone={<ClockIcon />}
                rotulo="Tempo de treino"
                valor="0h 00min"
              />
              <ResumoItem
                icone={<FlameIcon />}
                rotulo="Calorias queimadas"
                valor={resumoSemana.calorias}
              />
              <ResumoItem
                icone={<ScaleIcon />}
                rotulo="Peso atual"
                valor={resumoSemana.peso}
              />
            </ul>
          </article>
        </div>

        {/* Meu plano */}
        <article className="mx-auto mt-6 max-w-360 rounded-2xl bg-white p-6 shadow-sm lg:p-8">
          <h2 className="text-lg font-bold lg:text-xl">Meu plano</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600">{plano?.nome || "Plano"}</dt>
              <dd className="font-semibold">
                {plano?.preco ? `${formatarMoeda(Number(plano.preco))}/mês` : "Nenhum plano ativo"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600">Situação</dt>
              <dd className="font-semibold">
                {assinatura?.status === "ATIVA"
                  ? "Ativo"
                  : assinatura?.status || "Pendente"}
              </dd>
            </div>
          </dl>
          <Link
            href="/minha-conta"
            className="mt-5 inline-flex items-center gap-1 text-sm text-brand hover:underline"
          >
            Gerenciar minha assinatura
            <ArrowRight />
          </Link>
        </article>
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
