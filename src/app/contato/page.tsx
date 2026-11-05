"use client";

import { useState } from "react";

// Página de contato: salve como src/app/contato/page.tsx
// O header e o footer já vêm do layout do site, então aqui ficam só o conteúdo.
// Âncoras para o footer: #trabalhe-conosco, #central-de-ajuda e #faq
//
// Largura e margens: mesmo container das páginas de Profissionais, Planos e Sobre nós
// (max-w-[1440px] com px-6 no celular e px-14 no desktop).

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
      "Entenda as diferenças de cada plano, como escolher o melhor para o seu início e como acessar o treino do dia.",
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
    icone: <IconePino />,
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

// Estilo repetido dos cartões brancos
const cartao = "scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-6 lg:p-8";

export default function ContatoPage() {
  return (
    <main className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7c3aed]">
          Atendimento
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 lg:text-4xl">
          Como podemos ajudar hoje?
        </h1>

        {/* Formulários */}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
          <section id="trabalhe-conosco" className={cartao}>
            <h2 className="text-2xl font-bold text-gray-950">Trabalhe conosco</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 lg:text-base">
              Se você acredita em academia acolhedora, orientação integrada e
              progresso real, compartilhe seu interesse.
            </p>

            <Formulario
              id="candidatura"
              rotuloSelecao="Área de interesse"
              placeholderSelecao="Selecione uma área"
              opcoes={areasInteresse}
              placeholderMensagem="Conte um pouco sobre sua experiência e o que você gostaria de desenvolver conosco"
              botao="Enviar candidatura"
              sucesso="Candidatura enviada! Entraremos em contato se surgir uma oportunidade."
            />

            <p className="mt-5 text-xs leading-relaxed text-gray-600 lg:text-sm">
              Compartilhe seu perfil com a RiseFit. O envio demonstra interesse
              em oportunidades futuras e não representa uma oferta de emprego.
            </p>
          </section>

          <section id="contato" className={cartao}>
            <h2 className="text-2xl font-bold text-gray-950">Contato</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 lg:text-base">
              Preencha o formulário abaixo e nossa equipe irá te responder com a
              orientação certa para o seu caso.
            </p>

            <Formulario
              id="mensagem"
              rotuloSelecao="Assunto"
              placeholderSelecao="Selecione um assunto"
              opcoes={assuntos}
              placeholderMensagem="Descreva sua dúvida ou solicitação"
              botao="Enviar mensagem"
              sucesso="Mensagem enviada! Nossa equipe responderá em breve."
            />

            <div className="mt-6 rounded-xl bg-[#f5f3ff] p-5">
              <p className="text-sm font-semibold text-gray-950 lg:text-base">
                Informações de atendimento
              </p>
              <ul className="mt-3 space-y-3 text-sm text-gray-700 lg:text-base">
                <li className="flex items-center gap-3">
                  <span className="text-[#7c3aed]">
                    <IconePino />
                  </span>
                  Avenida Acre, 243 – Indaiá, Caraguatatuba – SP
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#7c3aed]">
                    <IconeRelogio />
                  </span>
                  08:00 às 20:00 · Segunda a Sexta, horário de Brasília
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Central de ajuda */}
        <section id="central-de-ajuda" className={`mt-6 ${cartao}`}>
          <h2 className="text-2xl font-bold text-gray-950">Central de ajuda</h2>
          <p className="mt-2 text-sm text-gray-600 lg:text-base">
            Encontre respostas rápidas para os principais temas da sua jornada na
            RiseFit.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {centralDeAjuda.map((item) => (
              <article
                key={item.titulo}
                className="flex items-start gap-4 rounded-xl bg-[#f7f7fa] p-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#7c3aed] text-white">
                  {item.icone}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-gray-950 lg:text-lg">
                    {item.titulo}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 lg:text-base">
                    {item.descricao}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Perguntas frequentes */}
        <section id="faq" className={`mt-6 ${cartao}`}>
          <h2 className="text-center text-2xl font-bold text-gray-950">
            Perguntas frequentes
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 lg:text-base">
            Respostas rápidas para facilitar sua navegação antes de entrar em
            contato.
          </p>

          <div className="mt-6 space-y-3">
            {perguntas.map((item) => (
              <details
                key={item.pergunta}
                className="rounded-xl border border-gray-200 bg-white px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-gray-950 lg:text-base [&::-webkit-details-marker]:hidden">
                  {item.pergunta}
                  <span className="text-gray-600 transition-transform [details[open]_&]:rotate-180">
                    <IconeSeta />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 lg:text-base">
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

/* ---------- Formulário (usado nos dois cartões) ---------- */

type Valores = { nome: string; email: string; selecao: string; mensagem: string };

function Formulario({
  id,
  rotuloSelecao,
  placeholderSelecao,
  opcoes,
  placeholderMensagem,
  botao,
  sucesso,
}: {
  id: string;
  rotuloSelecao: string;
  placeholderSelecao: string;
  opcoes: string[];
  placeholderMensagem: string;
  botao: string;
  sucesso: string;
}) {
  const vazio: Valores = { nome: "", email: "", selecao: "", mensagem: "" };
  const [valores, setValores] = useState<Valores>(vazio);
  const [erros, setErros] = useState<Partial<Valores>>({});
  const [enviado, setEnviado] = useState(false);

  function atualizar(campo: keyof Valores, valor: string) {
    setValores((atual) => ({ ...atual, [campo]: valor }));
    setEnviado(false);
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

    // TODO: enviar os dados para a sua API / serviço de e-mail
    console.log(id, valores);

    setValores(vazio);
    setEnviado(true);
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="mt-6 space-y-5">
      <Campo id={`${id}-nome`} rotulo="Nome completo" erro={erros.nome}>
        <input
          id={`${id}-nome`}
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          value={valores.nome}
          onChange={(e) => atualizar("nome", e.target.value)}
          className={estiloCampo(erros.nome)}
          {...ariaErro(`${id}-nome`, erros.nome)}
        />
      </Campo>

      <Campo id={`${id}-email`} rotulo="E-mail" erro={erros.email}>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          placeholder="nome@email.com"
          value={valores.email}
          onChange={(e) => atualizar("email", e.target.value)}
          className={estiloCampo(erros.email)}
          {...ariaErro(`${id}-email`, erros.email)}
        />
      </Campo>

      <Campo id={`${id}-selecao`} rotulo={rotuloSelecao} erro={erros.selecao}>
        <div className="relative">
          <select
            id={`${id}-selecao`}
            value={valores.selecao}
            onChange={(e) => atualizar("selecao", e.target.value)}
            className={`${estiloCampo(erros.selecao)} appearance-none pr-12 ${
              valores.selecao ? "text-gray-950" : "text-gray-500"
            }`}
            {...ariaErro(`${id}-selecao`, erros.selecao)}
          >
            <option value="">{placeholderSelecao}</option>
            {opcoes.map((opcao) => (
              <option key={opcao} value={opcao} className="text-gray-950">
                {opcao}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
            <IconeSeta />
          </span>
        </div>
      </Campo>

      <Campo id={`${id}-mensagem`} rotulo="Mensagem" erro={erros.mensagem}>
        <textarea
          id={`${id}-mensagem`}
          rows={4}
          placeholder={placeholderMensagem}
          value={valores.mensagem}
          onChange={(e) => atualizar("mensagem", e.target.value)}
          className={`${estiloCampo(erros.mensagem)} h-auto min-h-[130px] resize-y py-3`}
          {...ariaErro(`${id}-mensagem`, erros.mensagem)}
        />
      </Campo>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#7c3aed] py-3.5 text-sm font-semibold text-white transition hover:bg-[#6d28d9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa] lg:text-base"
      >
        {botao}
      </button>

      {enviado && (
        <p
          role="status"
          className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 lg:text-base"
        >
          {sucesso}
        </p>
      )}
    </form>
  );
}

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
        className="mb-2 block text-sm font-semibold text-gray-950 lg:text-base"
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
  return `h-12 w-full rounded-lg border bg-[#f7f7fa] px-4 text-sm text-gray-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 lg:h-14 lg:text-base ${
    erro ? "border-red-500" : "border-gray-200 focus:border-[#7c3aed]"
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
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: "h-5 w-5",
};

function IconeSeta() {
  return (
    <svg {...base} className="h-4 w-4">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconeAjuda() {
  return (
    <svg {...base} className="h-6 w-6">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function IconeCartao() {
  return (
    <svg {...base} className="h-6 w-6">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function IconePino() {
  return (
    <svg {...base} className="h-5 w-5 shrink-0">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconeEscudo() {
  return (
    <svg {...base} className="h-6 w-6">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconeRelogio() {
  return (
    <svg {...base} className="h-5 w-5 shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}