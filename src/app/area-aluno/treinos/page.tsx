import type { Metadata } from "next";
import ListaExercicios from "@/components/ListaExercicios";
import { BotaoLink, Cartao, LinkSeta, PaginaInterna } from "@/components/PainelUI";
import { treinoDoDia, treinosAnteriores } from "@/data/aluno";

export const metadata: Metadata = { title: "Meus treinos | RiseFit" };

export default function MeusTreinosPage() {
  const hrefHoje = `/area-aluno/treinos/${treinoDoDia.id}`;

  return (
    <PaginaInterna
      voltar={{ href: "/area-aluno", texto: "Área do Aluno" }}
      titulo="Meus treinos"
      subtitulo="Confira o treino de hoje e consulte suas sessões anteriores."
    >
      <div className="grid items-start gap-6 lg:grid-cols-[1.45fr_1fr]">
        <Cartao titulo="Treino do dia">
          <p className="text-dark">
            {treinoDoDia.titulo} ({treinoDoDia.foco})
          </p>
          <div className="mt-4 mb-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">{treinoDoDia.dataCurta}</span>
            <span className="font-semibold text-dark">Ainda não iniciado</span>
          </div>
          <ListaExercicios exercicios={treinoDoDia.exercicios} hrefTreino={hrefHoje} />
          <div className="mt-4">
            <BotaoLink href={hrefHoje} larguraTotal>
              Abrir treino
            </BotaoLink>
          </div>
        </Cartao>

        <Cartao titulo="Treinos anteriores">
          <p className="text-sm text-gray-500">Semana anterior • 26/10 a 01/11</p>
          <ul className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
            {treinosAnteriores.map((treino) => (
              <li key={treino.id} className="py-4">
                <p className="font-semibold text-dark">
                  {treino.dataCurta} • {treino.grupo} • {treino.duracaoMin} min
                </p>
                <p className="mt-2 text-sm text-gray-500">Concluído</p>
                <div className="mt-2">
                  <LinkSeta href={`/area-aluno/treinos/${treino.id}`}>Ver treino</LinkSeta>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <LinkSeta href="/area-aluno/historico">Ver histórico e progresso</LinkSeta>
          </div>
        </Cartao>
      </div>
    </PaginaInterna>
  );
}
