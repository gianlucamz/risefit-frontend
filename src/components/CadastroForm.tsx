"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CampoSenha } from "./AcessoUI";

export function formatarTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return `(${digitos}`;
  if (digitos.length <= 7)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---------- Peças visuais compartilhadas pelas telas de cadastro/acesso ---------- */

interface BotaoVoltarProps {
  onClick?: () => void;
  ariaLabel?: string;
  href?: string;
  className?: string;
}

export function BotaoVoltar({
  onClick,
  ariaLabel = "Voltar para página anterior",
  href,
  className = "",
}: BotaoVoltarProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`flex h-10.75 w-10.75 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-[#d1d4db] bg-white text-black transition-colors duration-200 hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-95 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 18 16"
        className="h-4 w-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 8H1.5" />
        <path d="M8 1 1 8l7 7" />
      </svg>
    </button>
  );
}

export function LogoRiseFit({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/design/logo-risefit-escuro.png"
      alt="RiseFit"
      width={180}
      height={60}
      priority
      className={`block h-12.5 w-37.5 select-none sm:h-15 sm:w-45 ${className}`}
    />
  );
}

/** Classes base dos campos (input/select) das telas de cadastro e acesso. */
export function classesCampo({
  erro,
  compacto = false,
  corPlaceholder = "placeholder:text-[#9ca3af]",
}: {
  erro?: string;
  compacto?: boolean;
  corPlaceholder?: string;
}) {
  const tamanho = compacto
    ? "h-[47px] rounded-[9.5px] px-[12.5px] text-sm"
    : "h-[52px] rounded-[9.5px] px-[14.5px] text-base sm:h-[59px] sm:px-[18.5px] sm:text-[17px]";
  const borda = erro
    ? "border-red-500 focus:border-red-500"
    : "border-[#d1d4db] focus:border-brand";
  return `w-full border-[1.5px] bg-white text-dark ${corPlaceholder} placeholder:font-normal transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand/20 ${tamanho} ${borda}`;
}

export function RotuloCampo({
  htmlFor,
  compacto = false,
  children,
}: {
  htmlFor: string;
  compacto?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={
        compacto
          ? "mb-1.25 block text-xs leading-4 font-medium text-black"
          : "mb-2 block text-[15px] leading-5 font-semibold text-dark"
      }
    >
      {children}
    </label>
  );
}

export function MensagemErroCampo({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} className="mt-1.5 text-left text-xs font-medium text-red-600">
      {children}
    </p>
  );
}

interface CampoFormularioProps {
  id: string;
  rotulo: React.ReactNode;
  tipo?: string;
  valor: string;
  placeholder: string;
  aoMudar: (novoValor: string) => void;
  erro?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  obrigatorio?: boolean;
  /** Campo menor usado dentro do modal de pagamento. */
  compacto?: boolean;
  /** Classe Tailwind da cor do placeholder (ex.: "placeholder:text-[#6b7280]"). */
  corPlaceholder?: string;
  /** Ícone exibido à esquerda do texto, dentro do campo. */
  icone?: React.ReactNode;
}

export function CampoFormulario({
  id,
  rotulo,
  tipo = "text",
  valor,
  placeholder,
  aoMudar,
  erro,
  autoComplete,
  inputMode,
  obrigatorio = true,
  compacto = false,
  corPlaceholder,
  icone,
}: CampoFormularioProps) {
  return (
    <div className="w-full text-left">
      <RotuloCampo htmlFor={id} compacto={compacto}>
        {rotulo}
      </RotuloCampo>
      <div className="relative">
        {icone && (
          <span className="pointer-events-none absolute top-1/2 left-[12.5px] -translate-y-1/2 text-[#9ca3af]">
            {icone}
          </span>
        )}
        <input
          id={id}
          name={id}
          type={tipo}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={obrigatorio}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? `${id}-erro` : undefined}
          className={`${classesCampo({ erro, compacto, corPlaceholder })} ${
            icone ? "!pl-10.5!" : ""
          }`}
        />
      </div>
      {erro && <MensagemErroCampo id={`${id}-erro`}>{erro}</MensagemErroCampo>}
    </div>
  );
}

export interface OpcaoSelect {
  valor: string;
  rotulo: string;
}

interface CampoSelectProps {
  id: string;
  rotulo: React.ReactNode;
  valor: string;
  placeholder?: string;
  opcoes: OpcaoSelect[];
  aoMudar: (novoValor: string) => void;
  erro?: string;
  obrigatorio?: boolean;
  compacto?: boolean;
  /** "cinza": chevron cinza (endereço/modal); "escuro": chevron escuro (complemento). */
  chevron?: "cinza" | "escuro";
}

export function CampoSelect({
  id,
  rotulo,
  valor,
  placeholder = "Toque para escolher",
  opcoes,
  aoMudar,
  erro,
  obrigatorio = true,
  compacto = false,
  chevron = "cinza",
}: CampoSelectProps) {
  return (
    <div className="w-full text-left">
      <RotuloCampo htmlFor={id} compacto={compacto}>
        {rotulo}
      </RotuloCampo>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={valor}
          required={obrigatorio}
          onChange={(e) => aoMudar(e.target.value)}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? `${id}-erro` : undefined}
          className={`${classesCampo({ erro, compacto })} cursor-pointer appearance-none pr-12 ${
            valor ? "text-dark" : "text-[#9ca3af]"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {opcoes.map((opcao) => (
            <option
              key={opcao.valor}
              value={opcao.valor}
              className="text-dark"
            >
              {opcao.rotulo}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
            compacto ? "right-3.75" : "right-[21.5px]"
          } ${chevron === "escuro" ? "text-dark" : "text-[#9ca3af]"}`}
        >
          {chevron === "escuro" ? (
            <svg viewBox="0 0 12 6" className="h-1.5 w-3" fill="none">
              <path
                d="M1.2 1.2 6 4.6l4.8-3.4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 10 7"
              className={compacto ? "h-1.5 w-2.25" : "h-1.75 w-2.5"}
              fill="none"
            >
              <path
                d="M1.3 1.3 5 5.2l3.7-3.9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </div>
      {erro && <MensagemErroCampo id={`${id}-erro`}>{erro}</MensagemErroCampo>}
    </div>
  );
}

export function AvisoPrivacidade() {
  return (
    <div className="space-y-6 text-[13px] leading-5 text-[#6b7280] sm:text-sm sm:leading-5.5">
      <p>
        Utilizamos seus dados pessoais para o cadastro em nossa plataforma, que
        nos permite lhe prestar nossos serviços. Para mais informações, acesse
        nossa{" "}
        <Link
          href="/politicas/privacidade"
          className="transition-colors hover:text-brand hover:underline"
        >
          Política de Privacidade
        </Link>
        . Caso não queira receber comunicações de marketing, o descadastramento
        pode ser realizado pelo Portal de Privacidade ou pelo link
        disponibilizado no rodapé dos e-mails da RiseFit.
      </p>

      <p>
        Importante:{" "}
        <strong className="font-semibold text-dark">
          apenas comunicações de Marketing podem ser desativadas.
        </strong>{" "}
        O envio de informações sobre seus planos e/ou sobre sua RiseFit
        continuarão a ser encaminhados, pois são essenciais para prestação de
        serviços.
      </p>
    </div>
  );
}

/** Botão roxo arredondado (pílula) das etapas de cadastro. */
export function BotaoCadastro({
  carregando,
  children,
  className = "",
}: {
  carregando: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={carregando}
      className={`flex h-13 w-full cursor-pointer items-center justify-center rounded-full bg-brand px-6 text-base font-semibold text-white transition-all duration-200 hover:bg-[#6d28d9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:text-lg ${className}`}
    >
      {carregando ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 animate-spin text-white"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
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
        children
      )}
    </button>
  );
}

/** Título grande centralizado das etapas de cadastro. */
export function TituloCadastro({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`text-center text-[26px] leading-8 font-bold text-dark sm:text-[38px] sm:leading-11.5 ${className}`}
    >
      {children}
    </h1>
  );
}

/** Cabeçalho "botão voltar + título + logo" (etapas 1 e 3 do cadastro). */
export function CabecalhoCadastro({
  titulo,
  voltarHref,
  voltarAriaLabel,
}: {
  titulo: React.ReactNode;
  voltarHref?: string;
  voltarAriaLabel?: string;
}) {
  return (
    <div className="relative">
      <BotaoVoltar
        href={voltarHref}
        ariaLabel={voltarAriaLabel}
        className="absolute top-0 left-0"
      />
      <TituloCadastro className="px-12 pt-13 sm:pt-1.25">
        {titulo}
      </TituloCadastro>
      <LogoRiseFit className="mx-auto mt-6 sm:mt-8.75" />
    </div>
  );
}

export interface CadastroFormProps {
  dadosIniciais?: {
    nome?: string;
    email?: string;
    celular?: string;
    senha?: string;
  };
  aoCompletar?: (dados: {
    nome: string;
    email: string;
    celular: string;
    senha?: string;
  }) => void;
  titulo?: string;
}

export default function CadastroForm({
  dadosIniciais,
  aoCompletar,
  titulo = "Sua jornada RiseFit começa agora!",
}: CadastroFormProps) {
  const router = useRouter();

  const [nome, setNome] = useState(() => {
    if (dadosIniciais?.nome) return dadosIniciais.nome;
    if (typeof window !== "undefined") {
      try {
        const salvo = sessionStorage.getItem("risefit_cadastro_step1");
        if (salvo) return JSON.parse(salvo).nome || "";
      } catch {}
    }
    return "";
  });

  const [email, setEmail] = useState(() => {
    if (dadosIniciais?.email) return dadosIniciais.email;
    if (typeof window !== "undefined") {
      try {
        const salvo = sessionStorage.getItem("risefit_cadastro_step1");
        if (salvo) return JSON.parse(salvo).email || "";
      } catch {}
    }
    return "";
  });

  const [celular, setCelular] = useState(() => {
    if (dadosIniciais?.celular) return formatarTelefone(dadosIniciais.celular);
    if (typeof window !== "undefined") {
      try {
        const salvo = sessionStorage.getItem("risefit_cadastro_step1");
        if (salvo) return formatarTelefone(JSON.parse(salvo).celular || "");
      } catch {}
    }
    return "";
  });

  const [senha, setSenha] = useState(() => {
    if (dadosIniciais?.senha) return dadosIniciais.senha;
    if (typeof window !== "undefined") {
      try {
        const salvo = sessionStorage.getItem("risefit_cadastro_step1");
        if (salvo) return JSON.parse(salvo).senha || "";
      } catch {}
    }
    return "";
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const planoParam = params.get("plano");
      if (planoParam) {
        sessionStorage.setItem("risefit_plano_escolhido", planoParam.toLowerCase());
      }
    } catch {}
  }, []);

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!nome.trim()) {
      novosErros.nome = "Por favor, informe seu nome completo.";
    } else if (nome.trim().split(/\s+/).length < 2) {
      novosErros.nome = "Informe nome e sobrenome.";
    }

    if (!email.trim()) {
      novosErros.email = "Por favor, informe seu e-mail.";
    } else if (!validarEmail(email.trim())) {
      novosErros.email = "Informe um endereço de e-mail válido.";
    }

    if (!senha.trim()) {
      novosErros.senha = "Por favor, crie uma senha.";
    } else if (senha.length < 8) {
      novosErros.senha = "A senha deve ter no mínimo 8 caracteres.";
    }

    const digitosCelular = celular.replace(/\D/g, "");
    if (!celular.trim()) {
      novosErros.celular = "Por favor, informe o DDD e celular.";
    } else if (digitosCelular.length < 10 || digitosCelular.length > 11) {
      novosErros.celular = "Informe um número de telefone com DDD válido.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) return;

    setCarregando(true);

    try {
      const payload = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha,
        celular: celular.trim(),
      };

      try {
        sessionStorage.setItem(
          "risefit_cadastro_step1",
          JSON.stringify(payload),
        );
      } catch {}

      const planoEscolhido =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("plano") ||
            sessionStorage.getItem("risefit_plano_escolhido")
          : null;
      const queryPlano = planoEscolhido
        ? `?plano=${encodeURIComponent(planoEscolhido)}`
        : "";

      if (aoCompletar) {
        aoCompletar(payload);
        setSucesso(true);
      } else {
        router.push(`/cadastro/complemento${queryPlano}`);
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full">
      <CabecalhoCadastro titulo={titulo} />

      <div className="mt-8">
        {sucesso ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
            <h3 className="text-lg font-bold text-green-900">
              Cadastro iniciado com sucesso!
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Seja bem-vindo(a) à RiseFit, <strong>{nome}</strong>!
              Redirecionando para a escolha do seu plano...
            </p>
            <div className="mt-5">
              <Link
                href="/#planos"
                className="inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9]"
              >
                Ver Planos
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5.75">
              <CampoFormulario
                id="nome"
                rotulo="Nome completo"
                tipo="text"
                valor={nome}
                placeholder="Seu nome completo"
                autoComplete="name"
                aoMudar={(v) => {
                  setNome(v);
                  if (erros.nome) setErros((prev) => ({ ...prev, nome: "" }));
                }}
                erro={erros.nome}
              />

              <CampoFormulario
                id="email"
                rotulo="E-mail"
                tipo="email"
                valor={email}
                placeholder="seu@email.com"
                autoComplete="email"
                inputMode="email"
                aoMudar={(v) => {
                  setEmail(v);
                  if (erros.email)
                    setErros((prev) => ({ ...prev, email: "" }));
                }}
                erro={erros.email}
              />

              <CampoSenha
                id="senha"
                rotulo="Senha de acesso"
                valor={senha}
                placeholder="Crie uma senha (mínimo 8 caracteres)"
                autoComplete="new-password"
                aoMudar={(v) => {
                  setSenha(v);
                  if (erros.senha) setErros((prev) => ({ ...prev, senha: "" }));
                }}
                erro={erros.senha}
              />

              <CampoFormulario
                id="celular"
                rotulo="DDD + Celular"
                tipo="tel"
                valor={celular}
                placeholder="(00) 00000-0000"
                autoComplete="tel"
                inputMode="numeric"
                aoMudar={(v) => {
                  setCelular(formatarTelefone(v));
                  if (erros.celular)
                    setErros((prev) => ({ ...prev, celular: "" }));
                }}
                erro={erros.celular}
              />
            </div>

            <div className="mt-5.25 text-center">
              <Link
                href="/login"
                className="text-[15px] leading-5 font-medium text-brand underline underline-offset-[3px] transition-colors hover:text-[#6d28d9]"
              >
                Já fui aluno(a) RiseFit →
              </Link>
            </div>

            <div className="mt-6.25">
              <AvisoPrivacidade />
            </div>

            <BotaoCadastro carregando={carregando} className="mt-6.25">
              Continuar cadastro
            </BotaoCadastro>
          </form>
        )}
      </div>
    </div>
  );
}
