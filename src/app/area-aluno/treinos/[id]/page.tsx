import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TreinoExecucao from "@/components/TreinoExecucao";
import { PaginaInterna } from "@/components/PainelUI";
import { treinoPorId, treinos } from "@/data/aluno";

export function generateStaticParams() {
  return treinos.map((treino) => ({ id: treino.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/area-aluno/treinos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const treino = treinoPorId(id);
  return { title: treino ? `${treino.titulo} | RiseFit` : "Treino | RiseFit" };
}

export default async function TreinoPage({
  params,
  searchParams,
}: PageProps<"/area-aluno/treinos/[id]">) {
  const { id } = await params;
  const treino = treinoPorId(id);
  if (!treino) notFound();

  // ?exercicio=2 abre direto no segundo exercício
  const { exercicio } = await searchParams;
  const numero = Number(Array.isArray(exercicio) ? exercicio[0] : exercicio);
  const indiceInicial =
    Number.isInteger(numero) && numero >= 1 && numero <= treino.exercicios.length
      ? numero - 1
      : 0;

  return (
    <PaginaInterna
      voltar={{ href: "/area-aluno/treinos", texto: "Meus treinos" }}
      titulo={treino.titulo}
      subtitulo={`${treino.foco} • ${treino.dataLonga}`}
    >
      <TreinoExecucao key={indiceInicial} treino={treino} indiceInicial={indiceInicial} />
    </PaginaInterna>
  );
}
