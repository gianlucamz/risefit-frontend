import type { Metadata } from "next";
import {
  BotaoLink,
  Cartao,
  IconeCheck,
  LinhaInfo,
  LinkSeta,
  PaginaInterna,
} from "@/components/PainelUI";
import { assinaturaDemo, planoPorId } from "@/data/aluno";

export const metadata: Metadata = {
  title: "Solicitação de cancelamento registrada | RiseFit",
};

export default function CancelamentoConfirmadoPage() {
  const plano = planoPorId(assinaturaDemo.planoId);

  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Solicitação de cancelamento registrada"
      subtitulo="Sua solicitação foi apresentada neste exemplo. Ela não confirma o encerramento imediato do plano."
      largura="estreita"
      centralizado
      icone={<IconeCheck />}
    >
      <Cartao titulo="Resumo da solicitação">
        <dl>
          <LinhaInfo rotulo="Plano" valor={plano.nome} />
          <LinhaInfo rotulo="Solicitação" valor="Aguardando análise" />
          <LinhaInfo rotulo="Encerramento" valor="A confirmar" />
        </dl>
        <p className="mt-3 text-sm text-gray-500">
          Consulte a equipe para verificar as condições e o andamento. A
          confirmação da solicitação não altera automaticamente o acesso ou a
          cobrança.
        </p>
      </Cartao>

      <div className="mt-6">
        <BotaoLink href="/minha-conta" larguraTotal>
          Voltar para minha conta
        </BotaoLink>
      </div>
      <div className="mt-6">
        <LinkSeta href="/contato#contato">Falar com a equipe de atendimento</LinkSeta>
      </div>
    </PaginaInterna>
  );
}
