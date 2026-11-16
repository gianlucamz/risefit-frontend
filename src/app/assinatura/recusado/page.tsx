import type { Metadata } from "next";
import {
  BotaoLink,
  Cartao,
  IconeAlerta,
  LinhaInfo,
  PaginaInterna,
} from "@/components/PainelUI";
import { assinaturaDemo, formatarMoeda, planoPorId } from "@/data/aluno";

export const metadata: Metadata = { title: "Pagamento não aprovado | RiseFit" };

export default function AssinaturaRecusadaPage() {
  const plano = planoPorId(assinaturaDemo.planoId);

  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Assinatura" }}
      titulo="Pagamento não aprovado"
      subtitulo="Não foi possível aprovar o pagamento deste exemplo. Revise as informações ou escolha outra forma de pagamento."
      largura="estreita"
      centralizado
      icone={<IconeAlerta />}
    >
      <Cartao titulo="Assinatura não ativada">
        <dl>
          <LinhaInfo rotulo="Plano escolhido" valor={plano.nome} />
          <LinhaInfo rotulo="Valor mensal" valor={`${formatarMoeda(plano.preco)}/mês`} />
        </dl>
      </Cartao>

      <div className="mt-6 flex flex-col gap-4">
        <BotaoLink href="/cadastro/endereco" larguraTotal>
          Revisar forma de pagamento
        </BotaoLink>
        <BotaoLink href="/cadastro/endereco" variante="secundario" larguraTotal>
          Tentar novamente
        </BotaoLink>
      </div>
    </PaginaInterna>
  );
}
