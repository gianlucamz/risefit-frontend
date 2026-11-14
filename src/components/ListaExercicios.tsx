import Link from "next/link";
import type { Exercicio } from "@/data/aluno";

// Lista numerada de exercícios usada na Área do Aluno e em Meus treinos.
export default function ListaExercicios({
  exercicios,
  hrefTreino,
}: {
  exercicios: Exercicio[];
  hrefTreino: string;
}) {
  return (
    <ol className="space-y-3">
      {exercicios.map((exercicio, i) => (
        <li key={exercicio.nome}>
          <Link
            href={`${hrefTreino}?exercicio=${i + 1}`}
            className="flex items-center gap-4 rounded-lg border border-gray-300 px-4 py-3 transition-colors hover:border-brand"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dark text-base">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-dark">{exercicio.nome}</span>
              <span className="block text-xs text-gray-700">
                {exercicio.series} séries - {exercicio.repeticoes} repetições
              </span>
            </span>
            <span aria-hidden="true" className="text-lg text-brand">
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
