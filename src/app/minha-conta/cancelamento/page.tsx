import type { Metadata } from "next";
import CancelamentoForm from "@/components/CancelamentoForm";
import { Cartao, Divisor, LinhaInfo, LinkSeta, PaginaInterna } from "@/components/PainelUI";
import { assinaturaDemo, formatarMoeda, planoPorId } from "@/data/aluno";

export const metadata: Metadata = {
  title: "Revisar solicitação de cancelamento | RiseFit",
};

export default function CancelamentoPage() {
  const plano = planoPorId(assinaturaDemo.planoId);

  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Revisar solicitação de cancelamento"
      subtitulo="Antes de continuar, consulte as condições do seu plano."
      largura="estreita"
    >
      <Cartao titulo="Plano a ser revisado">
        <dl>
          <LinhaInfo rotulo="Plano atual" valor={plano.nome} />
          <LinhaInfo rotulo="Mensalidade" valor={`${formatarMoeda(plano.preco)}/mês`} />
          <LinhaInfo rotulo="Situação atual" valor={assinaturaDemo.situacao} />
        </dl>
        <Divisor />
        <p className="text-gray-500">
          A solicitação não representa encerramento imediato da assinatura. A
          data de encerramento e eventuais condições precisam ser verificadas
          com a equipe.
        </p>
        <dl className="mt-2">
          <LinhaInfo rotulo="Data de encerramento" valor="A confirmar" />
          <LinhaInfo rotulo="Condições aplicáveis" valor="A consultar" />
        </dl>
        <div className="mt-3">
          <LinkSeta href="/politicas/termos-de-uso">Consultar condições do plano</LinkSeta>
        </div>
      </Cartao>

      <CancelamentoForm />
    </PaginaInterna>
  );
}
