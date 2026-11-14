import type { Metadata } from "next";
import Link from "next/link";
import {
  BotaoLink,
  Cartao,
  IconeAlerta,
  LinhaInfo,
  Selo,
} from "@/components/PainelUI";
import {
  alunoDemo,
  assinaturaDemo,
  formatarMoeda,
  planoPorId,
  sessaoAtual,
} from "@/data/aluno";

export const metadata: Metadata = { title: "Minha conta | RiseFit" };

export default function MinhaContaPage() {
  const plano = planoPorId(assinaturaDemo.planoId);

  return (
    <main className="bg-[#f8f8f8] px-6 py-10 lg:py-14">
      <div className="mx-auto max-w-300">
        <p className="text-sm font-medium text-brand">Minha conta</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-dark lg:text-[44px]">
          Gerencie sua assinatura e informações
        </h1>
        <p className="mt-3 text-sm text-gray-500 lg:text-base">
          Acompanhe seu plano, dados pessoais e opções de suporte em um só lugar.
        </p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
          <Cartao titulo="Conta logada" className="shadow-sm">
            <dl>
              <LinhaInfo rotulo="Nome completo" valor={alunoDemo.nome} />
              <LinhaInfo rotulo="CPF" valor={alunoDemo.cpfMascarado} />
              <LinhaInfo rotulo="E-mail" valor={alunoDemo.email} />
              <LinhaInfo rotulo="Telefone" valor={alunoDemo.telefoneMascarado} />
            </dl>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <BotaoLink href="/minha-conta/editar" variante="secundario">
                Editar dados
              </BotaoLink>
              <BotaoLink href="/minha-conta/editar#contato" variante="secundario">
                Atualizar contato
              </BotaoLink>
            </div>
          </Cartao>

          <Cartao titulo="Plano atual" acao={<Selo>{assinaturaDemo.situacao}</Selo>} className="shadow-sm">
            <p className="text-2xl font-semibold text-dark lg:text-3xl">{plano.nome}</p>
            <p className="mt-1 mb-3 text-sm text-gray-500">{plano.descricao}</p>
            <dl>
              <LinhaInfo rotulo="Valor mensal" valor={formatarMoeda(plano.preco)} destaque />
              <LinhaInfo rotulo="Próxima cobrança" valor={assinaturaDemo.proximaCobranca} />
              <LinhaInfo rotulo="Método" valor={assinaturaDemo.metodo} />
            </dl>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <BotaoLink href="/minha-conta/plano">Alterar plano</BotaoLink>
              <BotaoLink href="/#planos" variante="secundario">
                Detalhes do plano
              </BotaoLink>
            </div>
          </Cartao>

          <Cartao titulo="Segurança da conta" acao={<Selo>Ativa</Selo>} className="shadow-sm">
            <dl>
              <LinhaInfo rotulo="Autenticação" valor="Ativa" />
              <LinhaInfo rotulo="Dispositivos" valor="1 dispositivo" />
              <LinhaInfo rotulo="Último acesso" valor={`Hoje, ${sessaoAtual.inicio.split("• ")[1]}`} />
            </dl>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <BotaoLink href="/minha-conta/seguranca" variante="secundario">
                Gerenciar dispositivos
              </BotaoLink>
              <BotaoLink href="/minha-conta/seguranca#historico" variante="secundario">
                Ver histórico
              </BotaoLink>
            </div>
          </Cartao>

          <Cartao titulo="Suporte" acao={<Selo>Atendimento</Selo>} className="shadow-sm">
            <dl>
              <LinhaInfo rotulo="Central de ajuda" valor="Disponível" />
              <LinhaInfo rotulo="Horário" valor="08:00 às 20:00" />
              <LinhaInfo rotulo="Canal" valor="Formulário de contato" />
            </dl>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <BotaoLink href="/contato#contato">Falar com suporte</BotaoLink>
              <BotaoLink href="/contato#faq" variante="secundario">
                Perguntas frequentes
              </BotaoLink>
            </div>
          </Cartao>
        </div>

        {/* Cancelar plano */}
        <section className="mt-6 grid gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_240px] lg:p-7">
          <div>
            <Selo tom="alerta">
              <IconeAlerta className="h-4 w-4" />
              Ação de atenção
            </Selo>
            <h2 className="mt-4 text-2xl font-semibold text-dark">Cancelar plano</h2>
            <p className="mt-2 max-w-xl text-sm text-gray-500">
              Você pode consultar as condições antes de confirmar a alteração. O
              cancelamento não é executado automaticamente nesta página.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-dark">
              {[
                "Verifique as condições antes de confirmar.",
                "Consulte a data de encerramento nas condições do plano.",
                "Contate o suporte para orientações adicionais.",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <path d="m8 12 3 3 5-6" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-gray-100 p-4">
            <h3 className="font-semibold text-dark">Próximos passos</h3>
            <div className="mt-3 flex flex-col gap-3">
              <BotaoLink href="/politicas/termos-de-uso" variante="secundario">
                Ver condições
              </BotaoLink>
              <BotaoLink href="/minha-conta/cancelamento" variante="perigo">
                Solicitar cancelamento
              </BotaoLink>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Revise as condições antes de confirmar sua solicitação.
            </p>
          </div>
        </section>

        <p className="mt-6 text-xs text-gray-500">
          Dados demonstrativos. Para sair da conta, use o{" "}
          <Link href="/login" className="text-brand hover:underline">
            login
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
