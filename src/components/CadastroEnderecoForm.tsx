"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BotaoVoltar,
  LogoRiseFit,
  CampoFormulario,
  CampoSelect,
} from "@/components/CadastroComplementoForm";
import PaymentCardModal, { DadosCartao } from "@/components/PaymentCardModal";
import { useRouter } from "next/navigation";
import { obterPlanosAPI } from "@/services/api";

export const ESTADO = "SP";

export const CIDADES = [
  { valor: "Aparecida", rotulo: "Aparecida" },
  { valor: "Arapeí", rotulo: "Arapeí" },
  { valor: "Areias", rotulo: "Areias" },
  { valor: "Bananal", rotulo: "Bananal" },
  { valor: "Caçapava", rotulo: "Caçapava" },
  { valor: "Cachoeira Paulista", rotulo: "Cachoeira Paulista" },
  { valor: "Campos do Jordão", rotulo: "Campos do Jordão" },
  { valor: "Canas", rotulo: "Canas" },
  { valor: "Caraguatatuba", rotulo: "Caraguatatuba" },
  { valor: "Cruzeiro", rotulo: "Cruzeiro" },
  { valor: "Cunha", rotulo: "Cunha" },
  { valor: "Guaratinguetá", rotulo: "Guaratinguetá" },
  { valor: "Igaratá", rotulo: "Igaratá" },
  { valor: "Ilhabela", rotulo: "Ilhabela" },
  { valor: "Jacareí", rotulo: "Jacareí" },
  { valor: "Jambeiro", rotulo: "Jambeiro" },
  { valor: "Lagoinha", rotulo: "Lagoinha" },
  { valor: "Lavrinhas", rotulo: "Lavrinhas" },
  { valor: "Lorena", rotulo: "Lorena" },
  { valor: "Monteiro Lobato", rotulo: "Monteiro Lobato" },
  { valor: "Natividade da Serra", rotulo: "Natividade da Serra" },
  { valor: "Paraibuna", rotulo: "Paraibuna" },
  { valor: "Pindamonhangaba", rotulo: "Pindamonhangaba" },
  { valor: "Piquete", rotulo: "Piquete" },
  { valor: "Potim", rotulo: "Potim" },
  { valor: "Queluz", rotulo: "Queluz" },
  { valor: "Redenção da Serra", rotulo: "Redenção da Serra" },
  { valor: "Roseira", rotulo: "Roseira" },
  { valor: "Santa Branca", rotulo: "Santa Branca" },
  { valor: "Santo Antônio do Pinhal", rotulo: "Santo Antônio do Pinhal" },
  { valor: "São Bento do Sapucaí", rotulo: "São Bento do Sapucaí" },
  { valor: "São José do Barreiro", rotulo: "São José do Barreiro" },
  { valor: "São José dos Campos", rotulo: "São José dos Campos" },
  { valor: "São Luiz do Paraitinga", rotulo: "São Luiz do Paraitinga" },
  { valor: "São Sebastião", rotulo: "São Sebastião" },
  { valor: "Silveiras", rotulo: "Silveiras" },
  { valor: "Taubaté", rotulo: "Taubaté" },
  { valor: "Tremembé", rotulo: "Tremembé" },
  { valor: "Ubatuba", rotulo: "Ubatuba" },
];

export function formatarCEP(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5, 8)}`;
}

function BandeirasCredito() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-6 w-9 rounded-sm bg-[#1a1f71] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white italic">VISA</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#eb001b] flex items-center justify-center">
        <div className="flex -space-x-1.5">
          <div className="h-3.5 w-3.5 rounded-full bg-[#eb001b] border border-white/30" />
          <div className="h-3.5 w-3.5 rounded-full bg-[#f79e1b] border border-white/30" />
        </div>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#f5a623] flex items-center justify-center">
        <span className="text-[7px] font-bold text-black">ELO</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#2e77bc] flex items-center justify-center">
        <span className="text-[6px] font-bold text-white">AMEX</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#822124] flex items-center justify-center">
        <span className="text-[6px] font-bold text-white">HIPER</span>
      </div>
    </div>
  );
}

function BandeirasDebito() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-6 w-9 rounded-sm bg-[#1a1f71] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white italic">VISA</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#0099df] flex items-center justify-center">
        <span className="text-[6px] font-bold text-white">MAE</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#f5a623] flex items-center justify-center">
        <span className="text-[7px] font-bold text-black">ELO</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#eb001b] flex items-center justify-center">
        <div className="flex -space-x-1.5">
          <div className="h-3.5 w-3.5 rounded-full bg-[#eb001b] border border-white/30" />
          <div className="h-3.5 w-3.5 rounded-full bg-[#f79e1b] border border-white/30" />
        </div>
      </div>
    </div>
  );
}

function IconeShield() {
  return (
    <svg
      className="h-5 w-5 text-brand"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 15l-4-4 1.41-1.41L11 14.17l5.59-5.59L18 10l-7 7z" />
    </svg>
  );
}

interface CardPagamentoProps {
  tipo: "credito" | "debito";
  titulo: string;
  selecionado: boolean;
  aoSelecionar: () => void;
  children: React.ReactNode;
}

function CardPagamento({
  titulo,
  selecionado,
  aoSelecionar,
  children,
}: CardPagamentoProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selecionado}
      onClick={aoSelecionar}
      className={`w-full rounded-lg border-2 px-4 py-3.5 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        selecionado
          ? "border-brand bg-brand/5"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{titulo}</p>
          <div className="mt-1.5">{children}</div>
        </div>

        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selecionado ? "border-brand" : "border-gray-300"
          }`}
        >
          {selecionado && <div className="h-2.5 w-2.5 rounded-full bg-brand" />}
        </div>
      </div>
    </button>
  );
}

interface CheckboxTermosProps {
  marcado: boolean;
  aoMudar: (novo: boolean) => void;
  erro?: string;
}

function CheckboxTermos({ marcado, aoMudar, erro }: CheckboxTermosProps) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={marcado}
            onChange={(e) => aoMudar(e.target.checked)}
            className="peer sr-only"
            aria-describedby={erro ? "termos-erro" : undefined}
          />
          <div
            className={`flex h-4.5 w-4.5 items-center justify-center rounded border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 ${
              marcado
                ? "border-brand bg-brand"
                : erro
                  ? "border-red-500 bg-white"
                  : "border-gray-300 bg-white group-hover:border-gray-400"
            }`}
          >
            {marcado && (
              <svg
                className="h-3 w-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
        <span className="text-xs sm:text-[13px] leading-relaxed text-gray-600">
          Ao concluir o cadastro, você concorda com os nossos{" "}
          <Link
            href="/termos-de-adesao"
            className="font-semibold text-gray-900 underline underline-offset-2 hover:text-brand transition-colors"
          >
            termos de adesão
          </Link>
          , enviando sua solicitação de plano para análise e ativação na
          plataforma RiseFit.
        </span>
      </label>
      {erro && (
        <p
          id="termos-erro"
          className="mt-1.5 ml-7.5 text-xs text-red-600 font-medium"
        >
          {erro}
        </p>
      )}
    </div>
  );
}

export interface InfoPlanoVisual {
  id: number | string;
  slug: string;
  nome: string;
  preco: number;
  precoFormatado: string;
  descricao: string;
  beneficios: string[];
  destaque?: boolean;
}

const BENEFICIOS_POR_PLANO: Record<
  string,
  { descricao: string; beneficios: string[]; destaque?: boolean }
> = {
  essencial: {
    descricao: "O plano ideal para quem está começando e quer cuidar da saúde.",
    beneficios: [
      "Acesso à musculação",
      "Aulas de grupo (horários limitados)",
      "Avaliação física inicial",
      "Acompanhamento básico",
      "Uso do vestiário",
    ],
  },
  personalizado: {
    descricao:
      "O plano completo para quem busca resultados com acompanhamento.",
    beneficios: [
      "Tudo do plano Essencial",
      "Treino personalizado",
      "Acompanhamento de profissionais",
      "Avaliação física periódica",
      "Suporte nutricional (avaliação inicial)",
    ],
    destaque: true,
  },
  premium: {
    descricao: "A experiência completa para quem busca o máximo de resultado.",
    beneficios: [
      "Tudo do plano Personalizado",
      "Acompanhamento nutricional completo",
      "Consultas com especialistas",
      "Acesso liberado a todas as unidades",
      "Prioridade em horários",
    ],
  },
};

const PLANOS_PADRAO: InfoPlanoVisual[] = [
  {
    id: 1,
    slug: "essencial",
    nome: "Essencial",
    preco: 99.9,
    precoFormatado: "R$ 99,90/mês",
    descricao: BENEFICIOS_POR_PLANO.essencial.descricao,
    beneficios: BENEFICIOS_POR_PLANO.essencial.beneficios,
  },
  {
    id: 2,
    slug: "personalizado",
    nome: "Personalizado",
    preco: 139.9,
    precoFormatado: "R$ 139,90/mês",
    descricao: BENEFICIOS_POR_PLANO.personalizado.descricao,
    beneficios: BENEFICIOS_POR_PLANO.personalizado.beneficios,
    destaque: true,
  },
  {
    id: 3,
    slug: "premium",
    nome: "Premium",
    preco: 159.9,
    precoFormatado: "R$ 159,90/mês",
    descricao: BENEFICIOS_POR_PLANO.premium.descricao,
    beneficios: BENEFICIOS_POR_PLANO.premium.beneficios,
  },
];

interface CardPlanoProps {
  plano: InfoPlanoVisual;
  selecionado: boolean;
  infoAberta: boolean;
  aoSelecionar: () => void;
  aoAlternarInfo: (e: React.MouseEvent) => void;
  aoFecharInfo: () => void;
}

function CardPlano({
  plano,
  selecionado,
  infoAberta,
  aoSelecionar,
  aoAlternarInfo,
  aoFecharInfo,
}: CardPlanoProps) {
  return (
    <div className="relative">
      <div
        role="radio"
        aria-checked={selecionado}
        tabIndex={0}
        onClick={aoSelecionar}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            aoSelecionar();
          }
        }}
        className={`w-full rounded-lg border-2 p-4 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
          selecionado
            ? "border-brand bg-brand/5 shadow-xs"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-gray-900">
                {plano.nome}
              </span>
              {plano.destaque && (
                <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                  Mais escolhido
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs sm:text-sm font-semibold text-brand">
              {plano.precoFormatado}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={aoAlternarInfo}
              aria-label={`Ver benefícios do plano ${plano.nome}`}
              title="Ver benefícios"
              className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all cursor-pointer ${
                infoAberta
                  ? "border-brand bg-brand text-white shadow-xs"
                  : "border-gray-300 bg-gray-50 text-gray-600 hover:border-brand hover:text-brand hover:bg-white"
              }`}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>

            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                selecionado ? "border-brand" : "border-gray-300"
              }`}
            >
              {selecionado && (
                <div className="h-2.5 w-2.5 rounded-full bg-brand" />
              )}
            </div>
          </div>
        </div>
      </div>

      {infoAberta && (
        <div
          role="region"
          aria-label={`Benefícios do plano ${plano.nome}`}
          className="mt-2 rounded-xl border border-brand/20 bg-linear-to-b from-[#faf8ff] to-[#f5f0ff] p-4 text-left shadow-md transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 border-b border-brand/10 pb-2.5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
                Benefícios inclusos
              </span>
              <h4 className="text-sm font-bold text-gray-900">
                Plano {plano.nome}
              </h4>
              <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">
                {plano.descricao}
              </p>
            </div>
            <button
              type="button"
              onClick={aoFecharInfo}
              className="rounded-lg p-1 text-gray-400 hover:bg-black/5 hover:text-gray-700 transition-colors cursor-pointer"
              aria-label="Fechar detalhes do plano"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <ul className="mt-3 space-y-2">
            {plano.beneficios.map((beneficio) => (
              <li
                key={beneficio}
                className="flex items-start gap-2.5 text-xs sm:text-[13px] text-gray-800"
              >
                <svg
                  className="h-4 w-4 text-brand shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="leading-tight">{beneficio}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CadastroEnderecoForm() {
  const router = useRouter();

  const [dadosPendenteSalvo] = useState<{
    endereco?: {
      cep?: string;
      estado?: string;
      cidade?: string;
      bairro?: string;
      rua?: string;
      numero?: string;
      complemento?: string;
    };
    formaPagamento?: "credito" | "debito" | "";
    planoSlug?: string;
  } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const salvo = sessionStorage.getItem("risefit_cadastro_pendente");
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const [cep, setCep] = useState(() =>
    dadosPendenteSalvo?.endereco?.cep
      ? formatarCEP(dadosPendenteSalvo.endereco.cep)
      : "",
  );
  const [cidade, setCidade] = useState(
    () => dadosPendenteSalvo?.endereco?.cidade || "",
  );
  const [bairro, setBairro] = useState(
    () => dadosPendenteSalvo?.endereco?.bairro || "",
  );
  const [rua, setRua] = useState(() => dadosPendenteSalvo?.endereco?.rua || "");
  const [numero, setNumero] = useState(
    () => dadosPendenteSalvo?.endereco?.numero || "",
  );
  const [complemento, setComplemento] = useState(
    () => dadosPendenteSalvo?.endereco?.complemento || "",
  );
  const [formaPagamento, setFormaPagamento] = useState<
    "credito" | "debito" | ""
  >(() => dadosPendenteSalvo?.formaPagamento || "");

  const [aceitouTermos, setAceitouTermos] = useState(() =>
    Boolean(dadosPendenteSalvo),
  );
  const [erros, setErros] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);
  const [sucesso] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const [planos, setPlanos] = useState<InfoPlanoVisual[]>(PLANOS_PADRAO);

  useEffect(() => {
    let ativo = true;
    obterPlanosAPI()
      .then((planosApi) => {
        if (!ativo || !Array.isArray(planosApi) || planosApi.length === 0)
          return;
        setPlanos((prev) =>
          prev.map((p, idx) => {
            const encontrado =
              planosApi.find(
                (ap) =>
                  ap.nome.toLowerCase().includes(p.slug) ||
                  ap.nome.toLowerCase().includes(p.nome.toLowerCase()),
              ) || planosApi[idx];
            return encontrado ? { ...p, id: encontrado.id } : p;
          }),
        );
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  const [planoSelecionado, setPlanoSelecionado] = useState<string>(() => {
    if (typeof window === "undefined") return PLANOS_PADRAO[0].slug;
    try {
      const params = new URLSearchParams(window.location.search);
      const planoParam =
        params.get("plano") ||
        dadosPendenteSalvo?.planoSlug ||
        sessionStorage.getItem("risefit_plano_escolhido") ||
        "";
      const encontrado = PLANOS_PADRAO.find(
        (p) =>
          p.slug === planoParam.toLowerCase() ||
          p.nome.toLowerCase() === planoParam.toLowerCase(),
      );
      if (encontrado) return encontrado.slug;
    } catch {}
    return [...PLANOS_PADRAO].sort((a, b) => a.preco - b.preco)[0].slug;
  });
  const [infoPlanoAberto, setInfoPlanoAberto] = useState<string | null>(null);

  const [dadosAnteriores] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const step1 = sessionStorage.getItem("risefit_cadastro_step1");
      const step2 = sessionStorage.getItem("risefit_cadastro_completo");
      const sessaoUsuario =
        localStorage.getItem("usuario") ?? sessionStorage.getItem("usuario");
      const usuarioObj = sessaoUsuario ? JSON.parse(sessaoUsuario) : {};
      return {
        ...usuarioObj,
        ...(step1 ? JSON.parse(step1) : {}),
        ...(step2 ? JSON.parse(step2) : {}),
      };
    } catch {
      return {};
    }
  });

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};

    const cepLimpo = cep.replace(/\D/g, "");
    if (!cep.trim()) {
      novosErros.cep = "Por favor, informe seu CEP.";
    } else if (cepLimpo.length !== 8) {
      novosErros.cep = "Informe um CEP válido com 8 dígitos.";
    }

    if (!cidade) {
      novosErros.cidade = "Selecione sua cidade.";
    }

    if (!bairro.trim()) {
      novosErros.bairro = "Por favor, informe seu bairro.";
    }

    if (!rua.trim()) {
      novosErros.rua = "Por favor, informe sua rua.";
    }

    if (!numero.trim()) {
      novosErros.numero = "Informe o número.";
    }

    if (!formaPagamento) {
      novosErros.formaPagamento = "Selecione uma forma de pagamento.";
    }

    if (!planoSelecionado) {
      novosErros.plano = "Selecione um plano para continuar.";
    }

    if (!aceitouTermos) {
      novosErros.termos =
        "Você precisa aceitar os termos de adesão para continuar.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    setModalAberto(true);
  };

  const handleConfirmarModal = (dadosCartao: DadosCartao) => {
    setModalAberto(false);
    setCarregando(true);

    try {
      const pagamentoTokenizado = {
        token: `tok_mock_${Date.now()}`,
        bandeira: "VISA",
        ultimosDigitos: dadosCartao.numeroCartao.replace(/\s/g, "").slice(-4),
      };

      const planoEscolhido = planos.find((p) => p.slug === planoSelecionado);

      const payloadPendente = {
        usuario: {
          nome: dadosAnteriores.nome || "",
          email: dadosAnteriores.email || "",
          senha: dadosAnteriores.senha || "RiseFit@123",
          dataNascimento: dadosAnteriores.dataNascimento
            ? dadosAnteriores.dataNascimento.includes("/")
              ? dadosAnteriores.dataNascimento.split("/").reverse().join("-")
              : dadosAnteriores.dataNascimento
            : "2000-01-01",
          telefone: (
            dadosAnteriores.celular ||
            dadosAnteriores.telefone ||
            ""
          ).replace(/\D/g, ""),
          cpf: (dadosAnteriores.cpf || "").replace(/\D/g, ""),
          sexo: dadosAnteriores.sexo || "Não informado",
        },
        endereco: {
          cep: cep.replace(/\D/g, ""),
          estado: ESTADO,
          cidade,
          bairro: bairro.trim(),
          rua: rua.trim(),
          numero: numero.trim(),
          complemento: complemento.trim() || undefined,
        },
        formaPagamento: formaPagamento as "credito" | "debito",
        pagamento: pagamentoTokenizado,
        planoId: planoEscolhido?.id ?? 1,
        planoSlug: planoSelecionado,
        planoNome: planoEscolhido?.nome ?? "Personalizado",
        planoPreco: planoEscolhido?.preco ?? 139.9,
        planoPrecoFormatado: planoEscolhido?.precoFormatado ?? "R$ 139,90/mês",
        planoDescricao:
          planoEscolhido?.descricao ??
          "Acompanhamento mensal com suporte completo para seu treino.",
      };

      sessionStorage.setItem(
        "risefit_cadastro_pendente",
        JSON.stringify(payloadPendente),
      );
      sessionStorage.setItem("risefit_plano_escolhido", planoSelecionado);

      router.push(
        `/cadastro/concluido?plano=${encodeURIComponent(planoSelecionado)}`,
      );
    } catch {
      alert("Não foi possível prosseguir para a confirmação. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative mx-auto max-w-210">
        <div className="flex items-center justify-between sm:justify-center">
          <div className="sm:absolute sm:left-0 sm:top-0">
            <BotaoVoltar
              href="/cadastro/complemento"
              ariaLabel="Voltar para a etapa anterior"
            />
          </div>

          <h1 className="text-center text-xl font-bold tracking-tight text-[#0f172a] sm:text-2xl md:text-3xl lg:text-[32px] px-2 sm:px-14">
            Complete seu cadastro
          </h1>

          <div className="w-10 sm:hidden" aria-hidden="true" />
        </div>

        <div className="mt-5 sm:mt-6">
          <LogoRiseFit />
        </div>
      </div>

      <div className="mx-auto mt-5 sm:mt-6 max-w-160">
        {sucesso ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-green-900">
              Cadastro finalizado com sucesso!
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Parabéns{dadosAnteriores.nome ? `, ${dadosAnteriores.nome}` : ""}!
              Seu cadastro e pagamento foram efetuados. Seu plano será ativado
              em instantes.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/cadastro/concluido"
                className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#6d28d9] transition-colors"
              >
                Concluir Cadastro
              </Link>
              <Link
                href="/area-aluno"
                className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Área do Aluno
              </Link>
              <Link
                href="/#planos"
                className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Ver Planos
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitForm} noValidate className="space-y-8">
            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Escolha seu plano
              </h2>
              <div
                className="mt-4 space-y-3"
                role="radiogroup"
                aria-label="Plano"
              >
                {planos.map((plano) => (
                  <CardPlano
                    key={plano.slug}
                    plano={plano}
                    selecionado={planoSelecionado === plano.slug}
                    infoAberta={infoPlanoAberto === plano.slug}
                    aoSelecionar={() => {
                      setPlanoSelecionado(plano.slug);
                      if (erros.plano)
                        setErros((prev) => ({ ...prev, plano: "" }));
                    }}
                    aoAlternarInfo={(e) => {
                      e.stopPropagation();
                      setInfoPlanoAberto((prev) =>
                        prev === plano.slug ? null : plano.slug,
                      );
                    }}
                    aoFecharInfo={() => setInfoPlanoAberto(null)}
                  />
                ))}
              </div>
              {erros.plano && (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  {erros.plano}
                </p>
              )}
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Qual seu endereço de cobrança?
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Atendimento presencial disponível para o Litoral Norte e Vale do
                Paraíba — SP.
              </p>

              <div className="mt-5 space-y-5">
                <div>
                  <CampoFormulario
                    id="cep"
                    rotulo="CEP"
                    tipo="text"
                    valor={cep}
                    placeholder="00000-000"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    aoMudar={(v) => {
                      setCep(formatarCEP(v));
                      if (erros.cep) setErros((prev) => ({ ...prev, cep: "" }));
                    }}
                    erro={erros.cep}
                  />
                  <div className="mt-1.5 text-right">
                    <a
                      href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-medium text-[#6d28d9] hover:text-[#5b21b6] transition-colors hover:underline italic"
                    >
                      Não sei meu CEP
                    </a>
                  </div>
                </div>

                <CampoSelect
                  id="cidade"
                  rotulo="Cidade (SP)"
                  valor={cidade}
                  placeholder="Selecione sua cidade"
                  opcoes={CIDADES}
                  aoMudar={(v) => {
                    setCidade(v);
                    if (erros.cidade)
                      setErros((prev) => ({ ...prev, cidade: "" }));
                  }}
                  erro={erros.cidade}
                />

                <CampoFormulario
                  id="bairro"
                  rotulo="Bairro"
                  tipo="text"
                  valor={bairro}
                  placeholder="Digite seu bairro"
                  autoComplete="address-level3"
                  aoMudar={(v) => {
                    setBairro(v);
                    if (erros.bairro)
                      setErros((prev) => ({ ...prev, bairro: "" }));
                  }}
                  erro={erros.bairro}
                />

                <CampoFormulario
                  id="rua"
                  rotulo="Rua"
                  tipo="text"
                  valor={rua}
                  placeholder="Digite seu endereço"
                  autoComplete="street-address"
                  aoMudar={(v) => {
                    setRua(v);
                    if (erros.rua) setErros((prev) => ({ ...prev, rua: "" }));
                  }}
                  erro={erros.rua}
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <CampoFormulario
                    id="numero"
                    rotulo="Número"
                    tipo="text"
                    valor={numero}
                    placeholder="Digite seu número"
                    autoComplete="address-line2"
                    inputMode="numeric"
                    aoMudar={(v) => {
                      setNumero(v);
                      if (erros.numero)
                        setErros((prev) => ({ ...prev, numero: "" }));
                    }}
                    erro={erros.numero}
                  />
                  <div className="w-full">
                    <label
                      htmlFor="complemento"
                      className="mb-1.5 block text-sm font-semibold text-gray-900"
                    >
                      Complemento{" "}
                      <span className="font-normal text-gray-400">
                        (opcional)
                      </span>
                    </label>
                    <input
                      id="complemento"
                      name="complemento"
                      type="text"
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                      placeholder="Digite seu complemento"
                      autoComplete="address-line3"
                      className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 placeholder:font-normal transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Qual sua forma de pagamento?
              </h2>

              <div className="mt-3 flex items-center gap-2">
                <IconeShield />
                <span className="text-sm font-semibold text-gray-900">
                  Compra 100% segura
                </span>
              </div>

              <div
                className="mt-4 space-y-3"
                role="radiogroup"
                aria-label="Forma de pagamento"
              >
                <CardPagamento
                  tipo="credito"
                  titulo="Cartão de Crédito"
                  selecionado={formaPagamento === "credito"}
                  aoSelecionar={() => {
                    setFormaPagamento("credito");
                    if (erros.formaPagamento)
                      setErros((prev) => ({ ...prev, formaPagamento: "" }));
                  }}
                >
                  <BandeirasCredito />
                </CardPagamento>

                <CardPagamento
                  tipo="debito"
                  titulo="Cartão de Débito"
                  selecionado={formaPagamento === "debito"}
                  aoSelecionar={() => {
                    setFormaPagamento("debito");
                    if (erros.formaPagamento)
                      setErros((prev) => ({ ...prev, formaPagamento: "" }));
                  }}
                >
                  <BandeirasDebito />
                </CardPagamento>
              </div>

              {erros.formaPagamento && (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  {erros.formaPagamento}
                </p>
              )}
            </section>

            <CheckboxTermos
              marcado={aceitouTermos}
              aoMudar={(v) => {
                setAceitouTermos(v);
                if (erros.termos) setErros((prev) => ({ ...prev, termos: "" }));
              }}
              erro={erros.termos}
            />

            <div className="pt-1">
              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-full bg-brand py-3.5 sm:py-4 px-6 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#6d28d9] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                {carregando ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Processando...
                  </span>
                ) : (
                  "Finalizar cadastro"
                )}
              </button>
            </div>
          </form>
        )}

        {formaPagamento && (
          <PaymentCardModal
            aberto={modalAberto}
            tipoCartao={formaPagamento}
            aoFechar={() => setModalAberto(false)}
            aoConfirmar={handleConfirmarModal}
          />
        )}
      </div>
    </div>
  );
}
