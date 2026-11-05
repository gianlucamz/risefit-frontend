"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

interface BotaoVoltarProps {
  onClick?: () => void;
  ariaLabel?: string;
}

export function BotaoVoltar({
  onClick,
  ariaLabel = "Voltar para página anterior",
}: BotaoVoltarProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-800 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 shrink-0 cursor-pointer shadow-xs"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

export function LogoRiseFit({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="RiseFit"
      className={`flex items-center justify-center gap-2.5 ${className}`}
    >
      <Image
        src="/logo.png"
        alt="Ícone RiseFit"
        width={42}
        height={42}
        priority
        className="h-9 w-auto select-none"
      />
      <span
        aria-hidden="true"
        className="text-[28px] sm:text-[32px] font-black italic tracking-tight text-dark"
      >
        Rise<span className="text-brand">Fit</span>
      </span>
    </div>
  );
}

interface CampoFormularioProps {
  id: string;
  rotulo: string;
  tipo?: string;
  valor: string;
  placeholder: string;
  aoMudar: (novoValor: string) => void;
  erro?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  obrigatorio?: boolean;
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
}: CampoFormularioProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-gray-900"
      >
        {rotulo}
      </label>
      <div className="relative">
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
          className={`h-12 w-full rounded-md border bg-white px-4 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 placeholder:font-normal transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand/20 ${
            erro
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-brand"
          }`}
        />
      </div>
      {erro && (
        <p
          id={`${id}-erro`}
          className="mt-1.5 text-xs text-red-600 font-medium"
        >
          {erro}
        </p>
      )}
    </div>
  );
}

export function AvisoPrivacidade() {
  return (
    <div className="space-y-3.5 text-xs sm:text-[13px] leading-relaxed text-[#6b7280]">
      <p>
        Utilizamos seus dados pessoais para o cadastro em nossa plataforma, que
        nos permite lhe prestar nossos serviços. Para mais informações, acesse
        nossa{" "}
        <Link
          href="/politica-de-privacidade"
          className="text-[#6b7280] hover:text-brand underline underline-offset-2 transition-colors"
        >
          Política de Privacidade
        </Link>
        . Caso não queira receber comunicações de marketing, o descadastramento
        pode ser realizado pelo Portal de Privacidade ou pelo link
        disponibilizado no rodapé dos e-mails da RiseFit.
      </p>

      <p>
        Importante:{" "}
        <strong className="font-bold text-gray-900">
          apenas comunicações de Marketing podem ser desativadas.
        </strong>{" "}
        O envio de informações sobre seus planos e/ou sobre sua RiseFit
        continuarão a ser encaminhados, pois são essenciais para prestação de
        serviços.
      </p>
    </div>
  );
}

export interface CadastroFormProps {
  dadosIniciais?: {
    nome?: string;
    email?: string;
    celular?: string;
  };
  aoCompletar?: (dados: {
    nome: string;
    email: string;
    celular: string;
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

  const [erros, setErros] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

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
        celular: celular.trim(),
      };

      try {
        sessionStorage.setItem(
          "risefit_cadastro_step1",
          JSON.stringify(payload),
        );
      } catch {}

      if (aoCompletar) {
        aoCompletar(payload);
        setSucesso(true);
      } else {
        router.push("/cadastro/complemento");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative mx-auto max-w-210">
        <div className="flex items-center justify-between sm:justify-center">
          <div className="sm:absolute sm:left-0 sm:top-0">
            <BotaoVoltar />
          </div>

          <h1 className="text-center text-xl font-bold tracking-tight text-[#0f172a] sm:text-2xl md:text-3xl lg:text-[32px] px-2 sm:px-14">
            {titulo}
          </h1>

          <div className="w-10 sm:hidden" aria-hidden="true" />
        </div>

        <div className="mt-6 sm:mt-7">
          <LogoRiseFit />
        </div>
      </div>

      <div className="mx-auto mt-8 sm:mt-9 max-w-160">
        {sucesso ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center animate-fade-in">
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
              Cadastro iniciado com sucesso!
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Seja bem-vindo(a) à RiseFit, <strong>{nome}</strong>!
              Redirecionando para a escolha do seu plano...
            </p>
            <div className="mt-5">
              <Link
                href="/#planos"
                className="inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#6d28d9] transition-colors"
              >
                Ver Planos
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                if (erros.email) setErros((prev) => ({ ...prev, email: "" }));
              }}
              erro={erros.email}
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

            <div className="pt-1 text-center">
              <Link
                href="/area-aluno"
                className="text-sm font-medium text-[#6d28d9] hover:text-[#5b21b6] transition-colors hover:underline"
              >
                Já fui aluno(a) RiseFit →
              </Link>
            </div>

            <div className="pt-2">
              <AvisoPrivacidade />
            </div>

            <div className="pt-3">
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
                  "Continuar cadastro"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
