import type { Metadata } from "next";
import {
  BotaoLink,
  Cartao,
  Divisor,
  IconeCheck,
  LinhaInfo,
  LinkSeta,
  PaginaInterna,
} from "@/components/PainelUI";
import { assinaturaDemo, formatarMoeda, planoPorId } from "@/data/aluno";

export const metadata: Metadata = { title: "Cadastro concluído | RiseFit" };

export default function AssinaturaSucessoPage() {
  const plano = planoPorId(assinaturaDemo.planoId);

  return (
    <PaginaInterna
      voltar={{ href: "/", texto: "Início" }}
      titulo="Tudo certo com seu cadastro!"
      subtitulo="Seu cadastro foi realizado e seu pagamento foi aprovado com sucesso. Seu plano já está ativo e você tem acesso completo à RiseFit."
      largura="estreita"
      centralizado
      icone={<IconeCheck />}
    >
      <Cartao titulo="Resumo do plano">
        <dl>
          <LinhaInfo rotulo="Plano" valor={plano.nome} />
          <LinhaInfo rotulo="Mensalidade" valor={`${formatarMoeda(plano.preco)}/mês`} />
          <LinhaInfo rotulo="Situação" valor="Ativo" />
        </dl>
        <Divisor />
        <p className="text-sm text-gray-500">{plano.descricao}</p>
        <dl className="mt-2">
          <LinhaInfo rotulo="Próxima cobrança" valor="A confirmar" />
        </dl>
      </Cartao>

      <div className="mt-6 flex flex-col gap-3">
        <BotaoLink href="/area-aluno" larguraTotal>
          Acessar Área do Aluno
        </BotaoLink>
        <BotaoLink href="/minha-conta" variante="secundario" larguraTotal>
          Ver minha conta
        </BotaoLink>
      </div>
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <LinkSeta href="/#planos">Ver Planos</LinkSeta>
        <LinkSeta href="/">Página Inicial</LinkSeta>
      </div>
    </PaginaInterna>
  );
}
