import type { Metadata } from "next";
import AlterarSenhaForm from "@/components/AlterarSenhaForm";
import {
  BotaoLink,
  Cartao,
  LinhaInfo,
  PaginaInterna,
} from "@/components/PainelUI";
import EncerrarAcessosBotao from "@/components/EncerrarAcessosBotao";
import { historicoAcessos, sessaoAtual } from "@/data/aluno";

export const metadata: Metadata = { title: "Segurança e acessos | RiseFit" };

export default function SegurancaPage() {
  return (
    <PaginaInterna
      voltar={{ href: "/minha-conta", texto: "Minha conta" }}
      titulo="Segurança e acessos"
      subtitulo="Altere sua senha, confira seus dispositivos e consulte os acessos."
    >
      <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Cartao titulo="Alterar senha">
          <AlterarSenhaForm />
        </Cartao>

        <div className="space-y-6">
          <Cartao titulo="Dispositivos conectados">
            <dl>
              <LinhaInfo rotulo="Este dispositivo" valor={sessaoAtual.dispositivo} />
              <LinhaInfo rotulo="Sessão atual" valor={sessaoAtual.inicio} />
            </dl>
            <p className="mt-2 text-sm text-gray-500">1 dispositivo conectado no exemplo.</p>
            <EncerrarAcessosBotao />
          </Cartao>

          <Cartao titulo="Não reconhece um acesso?">
            <p className="text-sm text-gray-500">
              Altere sua senha e procure orientação da equipe pelo formulário de
              contato. Não compartilhe sua senha.
            </p>
            <div className="mt-4">
              <BotaoLink href="/contato#contato" variante="secundario" larguraTotal>
                Procurar atendimento
              </BotaoLink>
            </div>
          </Cartao>
        </div>
      </div>

      <div id="historico" className="mt-6 scroll-mt-28">
        <Cartao titulo="Histórico de acessos">
          <ul className="divide-y divide-gray-200 border-b border-gray-200">
            {historicoAcessos.map((acesso) => (
              <li
                key={acesso.data}
                className="flex flex-col gap-1 py-3.5 text-sm sm:flex-row sm:justify-between"
              >
                <span className="text-gray-500">{acesso.data}</span>
                <span className="font-semibold text-dark">
                  {acesso.dispositivo} • {acesso.status}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            Horários de Brasília. Histórico demonstrativo, sem consulta a acessos reais.
          </p>
        </Cartao>
      </div>
    </PaginaInterna>
  );
}
