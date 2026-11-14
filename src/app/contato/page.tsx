"use client";

import Link from "next/link";
import { useState } from "react";

// Página de contato (Atendimento). O header e o footer já vêm do layout do site.
// Âncoras usadas pelo footer: #trabalhe-conosco, #contato, #central-de-ajuda e #faq.

const areasInteresse = [
  "Recepção e atendimento",
  "Musculação e treino",
  "Aulas em grupo",
  "Nutrição",
  "Administrativo",
  "Outra área",
];

const assuntos = [
  "Planos e preços",
  "Pagamento e assinatura",
  "Treino e Área do Aluno",
  "Unidade e horários",
  "Outro assunto",
];

const centralDeAjuda = [
  {
    titulo: "Planos e orientação",
    descricao:
      "Entenda os diferenciais de cada plano, como escolher o melhor para o seu início e como acessar o treino do dia.",
    icone: <IconeAjuda />,
  },
  {
    titulo: "Pagamento e assinatura",
    descricao:
      "Dúvidas sobre cobrança, renovação, atualização de plano e como acompanhar seus pagamentos.",
    icone: <IconeCartao />,
  },
  {
    titulo: "Unidade e horários",
    descricao:
      "Confira endereço, funcionamento e horários de atendimento para visitas e orientações presenciais.",
    icone: <IconePino className="h-5 w-5" />,
  },
  {
    titulo: "Área do Aluno e progresso",
    descricao:
      "Saiba como acompanhar treinos, histórico, evolução e benefícios incluídos no seu plano.",
    icone: <IconeEscudo />,
  },
];

const perguntas = [
  {
    pergunta: "Como escolher o plano certo para mim?",
    resposta:
      "Compare os planos na página de Planos: o Essencial é ideal para quem está começando, o Personalizado inclui treino personalizado com acompanhamento de profissionais e o Premium reúne acompanhamento nutricional completo e acesso a todas as unidades.",
  },
  {
    pergunta: "Como acesso meu treino do dia?",
    resposta:
      "Entre na Área do Aluno: o treino do dia aparece logo na página inicial, com os exercícios, as séries e as repetições.",
  },
  {
    pergunta: "Posso atualizar meu plano?",
    resposta:
      "Sim. Fale com a nossa equipe pelo formulário de contato ou na unidade, e nós explicamos as condições para a troca.",
  },
  {
    pergunta: "Como acompanho meus pagamentos?",
    resposta:
      "Para consultar cobranças e renovações, fale com a nossa equipe pelo formulário de contato ou na unidade.",
  },
];

// Estilos repetidos
const cartao =
  "scroll-mt-28 rounded-3xl border border-[#e4e6eb] bg-white px-5 py-8 sm:px-10 sm:py-10";
const tituloCartao =
  "text-[26px] leading-9 font-bold text-[#0a0c11] sm:text-[32px] sm:leading-10";
const textoCartao = "mt-[11px] text-base leading-6 text-[#6b7280]";

export default function ContatoPage() {
  return (
    <main className="bg-white px-4 pt-10 pb-14 sm:px-6 lg:pt-[55px] lg:pb-[89px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-sm leading-5 font-semibold text-brand">Atendimento</p>
        <h1 className="mt-3 text-[34px] leading-[42px] font-bold text-[#0a0c11] lg:mt-[19px] lg:text-[48px] lg:leading-14">
          Como podemos ajudar hoje?
        </h1>

        {/* Formulários */}
        <div className="mt-8 grid items-start gap-6 lg:mt-[54px] lg:grid-cols-[minmax(0,600fr)_minmax(0,568fr)] lg:gap-8">
          <CartaoFormulario
            id="trabalhe-conosco"
            titulo="Trabalhe conosco"
            descricao="Se você acredita em academia acolhedora, orientação integrada e progresso real, compartilhe seu interesse."
            campoId="candidatura"
            rotuloSelecao="Área de interesse"
            placeholderSelecao="Selecione uma área"
            opcoes={areasInteresse}
            placeholderMensagem="Conte um pouco sobre sua experiência e o que você gostaria de desenvolver conosco"
            botao="Enviar candidatura"
            sucesso={{
              cabecalho: "Trabalhe conosco • Interesse enviado",
              titulo: "Interesse profissional enviado",
              descricao:
                "Seu interesse em oportunidades foi registrado no exemplo. O envio não representa uma oferta de emprego.",
              observacao:
                "Você pode continuar conhecendo a RiseFit ou voltar à página de atendimento.",
              primario: { href: "/sobre-nos", texto: "Conhecer a RiseFit" },
              secundario: { texto: "Voltar para atendimento" },
            }}
          >
            <p className="mt-6 text-[13px] leading-5 text-[#6b7280]">
              Compartilhe seu perfil com a RiseFit. O envio demonstra interesse
              em oportunidades futuras e não representa uma oferta de emprego.
            </p>
          </CartaoFormulario>

          <CartaoFormulario
            id="contato"
            titulo="Contato"
            descricao="Preencha o formulário abaixo e nossa equipe irá te responder com a orientação certa para o seu caso."
            campoId="mensagem"
            rotuloSelecao="Assunto"
            placeholderSelecao="Selecione um assunto"
            opcoes={assuntos}
            placeholderMensagem="Descreva sua dúvida ou solicitação"
            botao="Enviar mensagem"
            sucesso={{
              cabecalho: "Contato • Mensagem enviada",
              titulo: "Mensagem enviada",
              descricao:
                "Sua mensagem foi registrada no exemplo. A equipe poderá usar o contato informado para dar continuidade ao atendimento.",
              observacao:
                "Enquanto isso, consulte as perguntas frequentes ou retorne para a Home.",
              primario: { href: "#faq", texto: "Ver perguntas frequentes" },
              secundario: { href: "/", texto: "Voltar para Home" },
            }}
          >
            <div className="mt-6 rounded-[18px] bg-[#f8f6ff] px-5 pt-5 pb-[22px]">
              <p className="text-sm leading-5 font-semibold text-[#0a0c11]">
                Informações de atendimento
              </p>
              <ul className="mt-3 space-y-3.5 text-sm leading-5 text-[#6b7280]">
                <li className="flex items-start gap-3">
                  <span className="mt-px text-brand">
                    <IconePino className="h-[18px] w-[18px]" />
                  </span>
                  Avenida Acre, 243 – Indaiá, Caraguatatuba – SP
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-px text-brand">
                    <IconeRelogio />
                  </span>
                  08:00 às 20:00 - Segunda a Sexta, horário de Brasília
                </li>
              </ul>
            </div>
          </CartaoFormulario>
        </div>

        {/* Central de ajuda */}
        <section
          id="central-de-ajuda"
          className={`mt-6 lg:mt-[46px] ${cartao}`}
        >
          <h2 className={tituloCartao}>Central de ajuda</h2>
          <p className={textoCartao}>
            Encontre respostas rápidas para os principais temas da sua jornada na
            RiseFit.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {centralDeAjuda.map((item) => (
              <article
                key={item.titulo}
                className="flex items-start gap-4 rounded-[18px] bg-[#f9f9fb] p-4 sm:items-center sm:py-5 sm:pr-6 sm:pl-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                  {item.icone}
                </span>
                <div>
                  <h3 className="text-base leading-6 font-semibold text-[#0a0c11]">
                    {item.titulo}
                  </h3>
                  <p className="mt-0.5 text-sm leading-[22px] text-[#6b7280]">
                    {item.descricao}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Perguntas frequentes */}
        <section id="faq" className={`mt-6 lg:mt-[46px] ${cartao}`}>
          <h2 className={`text-center ${tituloCartao}`}>Perguntas frequentes</h2>
          <p className={`text-center ${textoCartao}`}>
            Respostas rápidas para facilitar sua navegação antes de entrar em
            contato.
          </p>

          <div className="mt-6 space-y-2.5">
            {perguntas.map((item) => (
              <details
                key={item.pergunta}
                className="group rounded-2xl border border-[#e4e6eb] bg-white"
              >
                <summary className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-4 py-3 pr-6 pl-5 text-base leading-6 font-semibold text-[#0a0c11] [&::-webkit-details-marker]:hidden">
                  {item.pergunta}
                  <span className="shrink-0 text-[#6b7280] transition-transform group-open:rotate-180">
                    <IconeSeta />
                  </span>
                </summary>
                <p className="-mt-1 px-5 pb-5 text-sm leading-[22px] text-[#6b7280] sm:text-base sm:leading-6">
                  {item.resposta}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------- Cartão com formulário (usado em "Trabalhe conosco" e "Contato") ---------- */

type Valores = { nome: string; email: string; selecao: string; mensagem: string };

type Sucesso = {
  cabecalho: string;
  titulo: string;
  descricao: string;
  observacao: string;
  primario: { href: string; texto: string };
  // Sem href, o botão volta para o formulário (continua na página de atendimento)
  secundario: { href?: string; texto: string };
};

function CartaoFormulario({
  id,
  titulo,
  descricao,
  campoId,
  rotuloSelecao,
  placeholderSelecao,
  opcoes,
  placeholderMensagem,
  botao,
  sucesso,
  children,
}: {
  id: string;
  titulo: string;
  descricao: string;
  campoId: string;
  rotuloSelecao: string;
  placeholderSelecao: string;
  opcoes: string[];
  placeholderMensagem: string;
  botao: string;
  sucesso: Sucesso;
  children?: React.ReactNode;
}) {
  const vazio: Valores = { nome: "", email: "", selecao: "", mensagem: "" };
  const [valores, setValores] = useState<Valores>(vazio);
  const [erros, setErros] = useState<Partial<Valores>>({});
  const [enviado, setEnviado] = useState(false);

  function atualizar(campo: keyof Valores, valor: string) {
    setValores((atual) => ({ ...atual, [campo]: valor }));
  }

  function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const novos: Partial<Valores> = {};
    if (valores.nome.trim().length < 3) novos.nome = "Informe seu nome.";
    if (!/^\S+@\S+\.\S+$/.test(valores.email)) novos.email = "Informe um e-mail válido.";
    if (!valores.selecao) novos.selecao = "Selecione uma opção.";
    if (valores.mensagem.trim().length < 10)
      novos.mensagem = "Escreva uma mensagem com pelo menos 10 caracteres.";

    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    // TODO: enviar os dados para a API / serviço de e-mail quando existir.
    setValores(vazio);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <section
        id={id}
        role="status"
        className="scroll-mt-28 rounded-[20px] border border-[#e4e6eb] bg-white px-5 pt-[29px] pb-[27px] sm:px-7"
      >
        <h2 className="text-lg leading-7 font-semibold text-[#0a0c11] sm:text-[22px]">
          {sucesso.cabecalho}
        </h2>
        <div className="mt-[25px] flex flex-col items-center text-center">
          <span className="text-brand">
            <IconeCheck />
          </span>
          <p className="mt-[21px] text-2xl leading-8 font-semibold text-[#0a0c11] sm:text-[30px] sm:leading-9">
            {sucesso.titulo}
          </p>
          <p className="mt-[21px] text-base leading-6 text-[#6b7280]">
            {sucesso.descricao}
          </p>
        </div>
        <p className="mt-[21px] text-sm leading-5 text-[#6b7280]">
          {sucesso.observacao}
        </p>
        <div className="mt-[21px] flex flex-col gap-5">
          <Link href={sucesso.primario.href} className={`${estiloBotao} bg-brand text-white hover:bg-[#6d28d9]`}>
            {sucesso.primario.texto}
          </Link>
          {sucesso.secundario.href ? (
            <Link
              href={sucesso.secundario.href}
              className={`${estiloBotao} border border-[#d1d4db] bg-white text-[#0a0c11] hover:border-brand hover:text-brand`}
            >
              {sucesso.secundario.texto}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setEnviado(false)}
              className={`${estiloBotao} cursor-pointer border border-[#d1d4db] bg-white text-[#0a0c11] hover:border-brand hover:text-brand`}
            >
              {sucesso.secundario.texto}
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className={cartao}>
      <h2 className={tituloCartao}>{titulo}</h2>
      <p className={textoCartao}>{descricao}</p>

      <form onSubmit={aoEnviar} noValidate className="mt-6 flex flex-col gap-[13px]">
        <Campo id={`${campoId}-nome`} rotulo="Nome completo" erro={erros.nome}>
          <input
            id={`${campoId}-nome`}
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            value={valores.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
            className={estiloCampo(erros.nome)}
            {...ariaErro(`${campoId}-nome`, erros.nome)}
          />
        </Campo>

        <Campo id={`${campoId}-email`} rotulo="E-mail" erro={erros.email}>
          <input
            id={`${campoId}-email`}
            type="email"
            autoComplete="email"
            placeholder="nome@email.com"
            value={valores.email}
            onChange={(e) => atualizar("email", e.target.value)}
            className={estiloCampo(erros.email)}
            {...ariaErro(`${campoId}-email`, erros.email)}
          />
        </Campo>

        <Campo id={`${campoId}-selecao`} rotulo={rotuloSelecao} erro={erros.selecao}>
          <select
            id={`${campoId}-selecao`}
            value={valores.selecao}
            onChange={(e) => atualizar("selecao", e.target.value)}
            className={`${estiloCampo(erros.selecao)} cursor-pointer appearance-none ${
              valores.selecao ? "text-[#0a0c11]" : "text-[#9ca3af]"
            }`}
            {...ariaErro(`${campoId}-selecao`, erros.selecao)}
          >
            <option value="">{placeholderSelecao}</option>
            {opcoes.map((opcao) => (
              <option key={opcao} value={opcao} className="text-[#0a0c11]">
                {opcao}
              </option>
            ))}
          </select>
        </Campo>

        <Campo id={`${campoId}-mensagem`} rotulo="Mensagem" erro={erros.mensagem}>
          <textarea
            id={`${campoId}-mensagem`}
            rows={4}
            placeholder={placeholderMensagem}
            value={valores.mensagem}
            onChange={(e) => atualizar("mensagem", e.target.value)}
            className={`${estiloCampo(erros.mensagem)} block h-[142px] resize-none py-4 leading-6`}
            {...ariaErro(`${campoId}-mensagem`, erros.mensagem)}
          />
        </Campo>

        <button
          type="submit"
          className="mt-[10px] h-[52px] w-full cursor-pointer rounded-xl bg-brand text-base font-semibold text-white transition-colors hover:bg-[#6d28d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {botao}
        </button>
      </form>

      {children}
    </section>
  );
}

const estiloBotao =
  "inline-flex h-12 w-full items-center justify-center rounded-xl px-4 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

function Campo({
  id,
  rotulo,
  erro,
  children,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm leading-5 font-semibold text-[#0a0c11]"
      >
        {rotulo}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="mt-1 text-sm text-red-600">
          {erro}
        </p>
      )}
    </div>
  );
}

function estiloCampo(erro?: string) {
  return `h-[54px] w-full rounded-xl border bg-[#f9f9fb] px-4 text-[15px] text-[#0a0c11] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-brand/30 ${
    erro ? "border-red-500" : "border-[#e4e6eb] focus:border-brand"
  }`;
}

function ariaErro(id: string, erro?: string) {
  return {
    "aria-invalid": erro ? true : undefined,
    "aria-describedby": erro ? `${id}-erro` : undefined,
  } as const;
}

/* ---------- Ícones ---------- */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconeSeta() {
  return (
    <svg
      viewBox="0 0 12 8"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-2 w-3"
    >
      <path d="M1 1.5l5 5 5-5" />
    </svg>
  );
}

function IconeCheck() {
  return (
    <svg {...base} strokeWidth={1.6} className="h-9 w-9">
      <circle cx="12" cy="12" r="10.2" />
      <path d="M7.8 12.4l2.9 2.9 5.6-6" />
    </svg>
  );
}

function IconeAjuda() {
  return (
    <svg {...base} className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function IconeCartao() {
  return (
    <svg {...base} className="h-5 w-5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IconePino({ className }: { className: string }) {
  return (
    <svg {...base} className={`${className} shrink-0`}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconeEscudo() {
  return (
    <svg {...base} className="h-5 w-5">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
    </svg>
  );
}

function IconeRelogio() {
  return (
    <svg {...base} className="h-[18px] w-[18px] shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
