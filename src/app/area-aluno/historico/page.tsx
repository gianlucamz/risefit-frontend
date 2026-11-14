import type { Metadata } from "next";
import { Cartao, LinkSeta, PaginaInterna } from "@/components/PainelUI";
import {
  evolucaoSemanal,
  formatarDuracao,
  resumoSemana,
  treinosAnteriores,
} from "@/data/aluno";

export const metadata: Metadata = { title: "Histórico e progresso | RiseFit" };

export default function HistoricoPage() {
  const totalMin = treinosAnteriores.reduce((s, t) => s + (t.duracaoMin ?? 0), 0);
  const maxSemana = Math.max(...evolucaoSemanal.map((s) => s.treinos), 1);

  const indicadores = [
    {
      titulo: "Treinos concluídos",
      valor: `${treinosAnteriores.length} treinos`,
      nota: "No período selecionado",
    },
    {
      titulo: "Tempo de treino",
      valor: formatarDuracao(totalMin),
      nota: "Soma das sessões registradas",
    },
    {
      titulo: "Peso atual",
      valor: resumoSemana.peso,
      nota: "Sem dados para comparação",
    },
  ];

  return (
    <PaginaInterna
      voltar={{ href: "/area-aluno", texto: "Área do Aluno" }}
      titulo="Histórico e progresso"
      subtitulo="Acompanhe sua constância com base nos treinos registrados."
    >
      <p className="-mt-3 mb-6 flex items-center gap-2 text-sm font-medium text-brand">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M5 20v-4M10 20v-8M15 20v-6M20 20V8" />
        </svg>
        26 de outubro a 08 de novembro de 2026
      </p>

      <div className="grid gap-6 sm:grid-cols-3">
        {indicadores.map((item) => (
          <Cartao key={item.titulo} titulo={item.titulo}>
            <p className="text-2xl font-semibold text-dark lg:text-3xl">{item.valor}</p>
            <p className="mt-4 text-sm text-gray-500">{item.nota}</p>
          </Cartao>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Cartao titulo="Evolução semanal">
          <p className="text-sm text-gray-500">Treinos concluídos por semana</p>
          <div
            className="mt-6 flex h-48 items-end justify-around gap-6"
            role="img"
            aria-label={evolucaoSemanal
              .map((s) => `${s.rotulo}: ${s.treinos} treinos`)
              .join("; ")}
          >
            {evolucaoSemanal.map((semana) => (
              <div key={semana.rotulo} className="flex w-24 flex-col items-center">
                <span className="mb-2 font-semibold text-dark">{semana.treinos}</span>
                <div
                  className="w-full rounded-sm bg-brand"
                  style={{
                    height: `${Math.max((semana.treinos / maxSemana) * 110, 3)}px`,
                  }}
                />
                <span className="mt-3 text-sm whitespace-nowrap text-gray-500">
                  {semana.rotulo}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            A semana atual ainda está em andamento.
          </p>
        </Cartao>

        <Cartao titulo="Sessões registradas">
          <ul className="divide-y divide-gray-200 border-b border-gray-200">
            {treinosAnteriores.map((treino) => (
              <li key={treino.id} className="flex justify-between py-3.5 text-sm">
                <span className="text-gray-500">
                  {treino.dataCurta.slice(0, 5)} • {treino.grupo}
                </span>
                <span className="font-semibold text-dark">{treino.duracaoMin} min</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-500">
            Semana atual: {resumoSemana.concluidos} de {resumoSemana.meta} treinos
            concluídos e {formatarDuracao(resumoSemana.tempoMin)}.
          </p>
          <div className="mt-4">
            <LinkSeta href="/area-aluno/treinos">Voltar aos meus treinos</LinkSeta>
          </div>
        </Cartao>
      </div>
    </PaginaInterna>
  );
}
