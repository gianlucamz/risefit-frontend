import Link from "next/link";
import type { CSSProperties } from "react";

// No design (1440px) cada cartão tem recuos um pouco diferentes; os valores abaixo
// (em px, a partir da borda de fora do cartão) reproduzem o PDF no desktop.
type Recuos = {
  texto: number;
  preco: number;
  lista: number;
  listaTexto: number;
  botao: number;
  linhaFim: number;
};

const planos: {
  nome: string;
  descricao: string[];
  descricaoPequena?: boolean;
  preco: string;
  beneficios: string[];
  larguraLista?: number;
  botao: string;
  destaque: boolean;
  recuos: Recuos;
}[] = [
  {
    nome: "Essencial",
    descricao: ["O plano ideal para quem está começando", "e quer cuidar da saúde."],
    preco: "99,90",
    beneficios: [
      "Acesso à musculação",
      "Aulas de grupo (horários limitados)",
      "Avaliação física inicial",
      "Acompanhamento básico",
      "Uso do vestiário",
    ],
    botao: "Assinar Essencial",
    destaque: false,
    recuos: { texto: 32, preco: 39, lista: 35, listaTexto: 62, botao: 30, linhaFim: 37 },
  },
  {
    nome: "Personalizado",
    descricao: ["O plano completo para quem busca", "resultados com acompanhamento."],
    preco: "139,90",
    beneficios: [
      "Tudo do plano Essencial",
      "Treino personalizado",
      "Acompanhamento de profissionais",
      "Avaliação física periódica",
      "Suporte nutricional (avaliação inicial)",
    ],
    larguraLista: 232,
    botao: "Assinar Personalizado",
    destaque: true,
    recuos: { texto: 41, preco: 48, lista: 40, listaTexto: 74, botao: 37, linhaFim: 47 },
  },
  {
    nome: "Premium",
    descricao: ["A experiência completa para quem", "busca o máximo de resultado."],
    descricaoPequena: true,
    preco: "159,90",
    beneficios: [
      "Tudo do plano Personalizado",
      "Acompanhamento nutricional completo",
      "Consultas com especialistas",
      "Acesso liberado a todas as unidades",
      "Prioridade em horários",
    ],
    botao: "Assinar Premium",
    destaque: false,
    recuos: { texto: 43, preco: 40, lista: 37, listaTexto: 63, botao: 33, linhaFim: 35 },
  },
];

function IconeCheck() {
  return (
    <svg
      width="13"
      height="10"
      viewBox="0 0 13 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[5px] shrink-0 text-brand"
      aria-hidden="true"
    >
      <path d="M1 5.2 4.6 8.8 12 1.2" />
    </svg>
  );
}

export default function Planos() {
  return (
    <section id="planos" className="scroll-mt-24 pt-14 lg:pt-[67px]">
      <div className="mx-auto max-w-[1440px] px-4 lg:pl-[84px] lg:pr-[94px]">
        <p className="text-center text-sm uppercase leading-none text-black lg:text-base">
          Nossos planos
        </p>
        <h2 className="mt-3 text-center text-[32px] font-bold leading-[1.15] tracking-[0.01em] text-black lg:mt-[12px] lg:text-[50px] lg:leading-none">
          Escolha o plano ideal para você
        </h2>

        <div className="mx-auto mt-12 grid max-w-[400px] gap-12 lg:mt-[57px] lg:max-w-none lg:grid-cols-[373fr_377fr_374fr] lg:gap-[69px]">
          {planos.map((plano) => (
            <div
              key={plano.nome}
              style={
                {
                  "--texto": `${plano.recuos.texto}px`,
                  "--preco": `${plano.recuos.preco}px`,
                  "--lista": `${plano.recuos.lista}px`,
                  "--lista-gap": `${plano.recuos.listaTexto - plano.recuos.lista - 13}px`,
                  "--botao": `${plano.recuos.botao}px`,
                  "--linha-fim": `${plano.recuos.linhaFim}px`,
                  "--b": plano.destaque ? "2.5px" : "1px",
                  "--botao-w": plano.destaque ? "304px" : "308px",
                } as CSSProperties
              }
              className={`relative flex flex-col bg-white pb-6 pt-8 lg:h-[461px] lg:pb-[12px] lg:pt-[32px] ${
                plano.destaque
                  ? "rounded-[27px] border-[2.5px] border-brand lg:-mt-[2px] lg:h-[465px]"
                  : "rounded-[26px] border border-black"
              }`}
            >
              {plano.destaque && (
                <span className="absolute -top-[16px] left-1/2 flex h-[36px] w-[144px] -translate-x-1/2 items-center justify-center rounded-full bg-brand text-[15px] text-white lg:-top-[16.5px]">
                  Mais escolhido
                </span>
              )}

              <div className="px-6 lg:pl-[calc(var(--texto)-var(--b))] lg:pr-4">
                <h3 className="text-[32px] font-bold leading-none text-black">{plano.nome}</h3>
                <p
                  className={`mt-[15px] text-black lg:min-h-[38px] ${
                    plano.descricaoPequena ? "text-xs leading-[16px]" : "text-sm leading-[19px]"
                  }`}
                >
                  {plano.descricao[0]}{" "}
                  <br className="hidden lg:inline" />
                  {plano.descricao[1]}
                </p>
              </div>

              <div className="mx-6 mt-[20px] border-b border-black pb-[21px] lg:ml-[calc(var(--preco)-var(--b))] lg:mr-[calc(var(--linha-fim)-var(--b))]">
                <p className="flex items-baseline gap-[9px] font-bold leading-none text-black">
                  <span className="relative top-[7px] text-[26px]">R$</span>
                  <span className="text-[38px]">{plano.preco}/mês</span>
                </p>
              </div>

              <ul
                className="mt-6 flex flex-1 flex-col gap-2 px-6 text-sm leading-[19px] text-black lg:mt-[25px] lg:pl-[calc(var(--lista)-var(--b))] lg:pr-4"
              >
                {plano.beneficios.map((beneficio) => (
                  <li key={beneficio} className="flex items-start gap-[14px] lg:gap-[var(--lista-gap)]">
                    <IconeCheck />
                    <span style={plano.larguraLista ? { maxWidth: plano.larguraLista } : undefined}>
                      {beneficio}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 px-6 lg:mt-auto lg:pl-[calc(var(--botao)-var(--b))] lg:pr-0">
                <Link
                  href={`/cadastro?plano=${plano.nome.toLowerCase()}`}
                  className={`flex h-[51px] w-full items-center justify-center rounded-[22px] border-2 border-brand text-[17px] lg:w-[var(--botao-w)] ${
                    plano.destaque ? "bg-brand text-white" : "bg-white text-brand"
                  }`}
                >
                  {plano.botao}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
