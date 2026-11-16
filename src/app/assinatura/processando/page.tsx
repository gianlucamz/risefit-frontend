import type { Metadata } from "next";
import {
  BotaoLink,
  Cartao,
  Divisor,
  IconeRelogio,
  LinhaInfo,
  PaginaInterna,
} from "@/components/PainelUI";
import { assinaturaDemo, formatarMoeda, planoPorId } from "@/data/aluno";

export const metadata: Metadata = { title: "Pagamento em processamento | RiseFit" };

export default function AssinaturaProcessandoPage() {
  const plano = planoPorId(assinaturaDemo.planoId);

  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Assinatura" }}
      titulo="Pagamento em processamento"
      subtitulo="A aprovação ainda está pendente. Seu plano não está ativo enquanto aguardamos a confirmação."
      largura="estreita"
      centralizado
      icone={<IconeRelogio />}
    >
      <Cartao titulo="Resumo do plano">
        <dl>
          <LinhaInfo rotulo="Plano" valor={plano.nome} />
          <LinhaInfo rotulo="Mensalidade" valor={`${formatarMoeda(plano.preco)}/mês`} />
          <LinhaInfo rotulo="Situação" valor="Aguardando aprovação" />
        </dl>
        <Divisor />
        <p className="text-sm text-gray-500">{plano.descricao}</p>
        <dl className="mt-2">
          <LinhaInfo rotulo="Próxima cobrança" valor="A confirmar" />
        </dl>
      </Cartao>

      <p className="mt-6 text-sm text-gray-500">
        Evite uma nova tentativa enquanto o pagamento estiver em análise.
        Consulte a situação antes de continuar.
      </p>
      <div className="mt-4 flex flex-col gap-4">
        <BotaoLink href="/assinatura/processando" larguraTotal>
          Consultar situação
        </BotaoLink>
        <BotaoLink href="/minha-conta" variante="secundario" larguraTotal>
          Voltar para minha conta
        </BotaoLink>
      </div>
    </PaginaInterna>
  );
}
