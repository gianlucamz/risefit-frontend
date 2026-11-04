"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const MOCK_COMPLEMENTO = {
  cpf: "529.982.247-25",
  sexo: "Masculino",
  dataNascimento: "15/08/1998",
};

export function formatarCPF(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

export function validarCPF(cpf: string): boolean {
  const limpo = cpf.replace(/\D/g, "");
  if (limpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(limpo)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(limpo.charAt(i), 10) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  const digito1 = resto >= 10 ? 0 : resto;
  if (digito1 !== parseInt(limpo.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(limpo.charAt(i), 10) * (11 - i);
  }
  resto = 11 - (soma % 11);
  const digito2 = resto >= 10 ? 0 : resto;
  return digito2 === parseInt(limpo.charAt(10), 10);
}

export function formatarData(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4, 8)}`;
}

export function validarDataNascimento(data: string): { valido: boolean; mensagem?: string } {
  const limpo = data.replace(/\D/g, "");
  if (limpo.length !== 8) {
    return { valido: false, mensagem: "Informe a data no formato DD/MM/AAAA." };
  }

  const dia = parseInt(limpo.slice(0, 2), 10);
  const mes = parseInt(limpo.slice(2, 4), 10);
  const ano = parseInt(limpo.slice(4, 8), 10);

  if (mes < 1 || mes > 12) {
    return { valido: false, mensagem: "Mês inválido." };
  }

  const diasNoMes = new Date(ano, mes, 0).getDate();
  if (dia < 1 || dia > diasNoMes) {
    return { valido: false, mensagem: "Dia inválido para o mês informado." };
  }

  const anoAtual = new Date().getFullYear();
  if (ano < 1900 || ano > anoAtual) {
    return { valido: false, mensagem: "Ano de nascimento inválido." };
  }

  const hoje = new Date();
  const dataNasc = new Date(ano, mes - 1, dia);
  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const m = hoje.getMonth() - dataNasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
    idade--;
  }

  if (idade < 12) {
    return { valido: false, mensagem: "É necessário ter no mínimo 12 anos para se cadastrar." };
  }

  return { valido: true };
}

interface BotaoVoltarProps {
  onClick?: () => void;
  ariaLabel?: string;
  href?: string;
}

export function BotaoVoltar({
  onClick,
  ariaLabel = "Voltar para página anterior",
  href,
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
  inputMode?: "text" | "numeric";
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
        <p id={`${id}-erro`} className="mt-1.5 text-xs text-red-600 font-medium">
          {erro}
        </p>
      )}
    </div>
  );
}

interface OpcaoSelect {
  valor: string;
  rotulo: string;
}

interface CampoSelectProps {
  id: string;
  rotulo: string;
  valor: string;
  placeholder?: string;
  opcoes: OpcaoSelect[];
  aoMudar: (novoValor: string) => void;
  erro?: string;
  obrigatorio?: boolean;
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
}: CampoSelectProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-gray-900"
      >
        {rotulo}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={valor}
          required={obrigatorio}
          onChange={(e) => aoMudar(e.target.value)}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? `${id}-erro` : undefined}
          className={`h-12 w-full appearance-none rounded-md border bg-white px-4 pr-10 text-sm sm:text-base transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer ${
            !valor ? "text-gray-400 font-normal" : "text-gray-900 font-normal"
          } ${
            erro
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-brand"
          }`}
        >
          <option value="" disabled className="text-gray-400">
            {placeholder}
          </option>
          {opcoes.map((opcao) => (
            <option
              key={opcao.valor}
              value={opcao.valor}
              className="text-gray-900 font-normal"
            >
              {opcao.rotulo}
            </option>
          ))}
        </select>

        {/* Ícone de Chevron Down */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-700">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {erro && (
        <p id={`${id}-erro`} className="mt-1.5 text-xs text-red-600 font-medium">
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

export interface DadosCadastroFinal {
  nome?: string;
  email?: string;
  celular?: string;
  cpf: string;
  sexo: string;
  dataNascimento: string;
}

export interface CadastroComplementoFormProps {
  dadosIniciais?: {
    cpf?: string;
    sexo?: string;
    dataNascimento?: string;
  };
  aoCompletar?: (dadosCompletos: DadosCadastroFinal) => void;
  mostrarBotaoMock?: boolean;
}

export default function CadastroComplementoForm({
  dadosIniciais,
  aoCompletar,
  mostrarBotaoMock = false,
}: CadastroComplementoFormProps) {
  const [cpf, setCpf] = useState(
    dadosIniciais?.cpf ? formatarCPF(dadosIniciais.cpf) : ""
  );
  const [sexo, setSexo] = useState(dadosIniciais?.sexo ?? "");
  const [dataNascimento, setDataNascimento] = useState(
    dadosIniciais?.dataNascimento
      ? formatarData(dadosIniciais.dataNascimento)
      : ""
  );

  const [dadosEtapa1] = useState<{
    nome?: string;
    email?: string;
    celular?: string;
  }>(() => {
    if (typeof window === "undefined") return {};
    try {
      const etapa1Salva = sessionStorage.getItem("risefit_cadastro_step1");
      return etapa1Salva ? JSON.parse(etapa1Salva) : {};
    } catch {
      return {};
    }
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Opções para o campo Sexo
  const opcoesSexo: OpcaoSelect[] = [
    { valor: "Feminino", rotulo: "Feminino" },
    { valor: "Masculino", rotulo: "Masculino" },
    { valor: "Outro", rotulo: "Outro" },
    { valor: "Prefiro não informar", rotulo: "Prefiro não informar" },
  ];

  const preencherComMock = () => {
    setCpf(MOCK_COMPLEMENTO.cpf);
    setSexo(MOCK_COMPLEMENTO.sexo);
    setDataNascimento(MOCK_COMPLEMENTO.dataNascimento);
    setErros({});
  };

  const limparCampos = () => {
    setCpf("");
    setSexo("");
    setDataNascimento("");
    setErros({});
  };

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (!cpf.trim()) {
      novosErros.cpf = "Por favor, informe seu CPF.";
    } else if (!validarCPF(cpf)) {
      novosErros.cpf = "Informe um CPF válido.";
    }

    if (!sexo.trim()) {
      novosErros.sexo = "Selecione uma opção de sexo.";
    }

    if (!dataNascimento.trim()) {
      novosErros.dataNascimento = "Por favor, informe sua data de nascimento.";
    } else {
      const resData = validarDataNascimento(dataNascimento);
      if (!resData.valido) {
        novosErros.dataNascimento =
          resData.mensagem || "Data de nascimento inválida.";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) return;

    setCarregando(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const payloadFinal = {
        ...dadosEtapa1,
        cpf: cpf.trim(),
        sexo: sexo.trim(),
        dataNascimento: dataNascimento.trim(),
      };

      try {
        sessionStorage.setItem(
          "risefit_cadastro_completo",
          JSON.stringify(payloadFinal)
        );
      } catch {
      }

      if (aoCompletar) {
        aoCompletar(payloadFinal);
      }

      setSucesso(true);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full">
      {mostrarBotaoMock && (
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={preencherComMock}
            className="rounded border border-purple-200 bg-purple-50 px-2.5 py-1 font-medium text-brand hover:bg-purple-100 transition-colors cursor-pointer"
          >
            Preencher Mock
          </button>
          <button
            type="button"
            onClick={limparCampos}
            className="rounded border border-gray-200 bg-gray-50 px-2.5 py-1 font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Limpar
          </button>
        </div>
      )}

      <div className="relative mx-auto max-w-210">
        <div className="flex items-center justify-between sm:justify-center">
          <div className="sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2">
            <BotaoVoltar href="/cadastro" ariaLabel="Voltar para a primeira etapa" />
          </div>

          <div className="flex items-center justify-center">
            <LogoRiseFit />
          </div>

          <div className="w-10 sm:hidden" aria-hidden="true" />
        </div>

        <h1 className="mt-5 sm:mt-6 text-center text-xl font-bold tracking-tight text-[#0f172a] sm:text-2xl md:text-3xl lg:text-[32px] px-2 sm:px-14">
          Só faltam mais algumas informações
        </h1>
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
              Cadastro finalizado com sucesso!
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Parabéns{dadosEtapa1.nome ? `, ${dadosEtapa1.nome}` : ""}! Seus dados foram
              cadastrados e você já pode escolher o seu plano.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#planos"
                className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#6d28d9] transition-colors"
              >
                Escolher Plano
              </Link>
              <Link
                href="/area-aluno"
                className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Área do Aluno
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <CampoFormulario
              id="cpf"
              rotulo="CPF"
              tipo="text"
              valor={cpf}
              placeholder="Digite seu CPF"
              autoComplete="off"
              inputMode="numeric"
              aoMudar={(v) => {
                setCpf(formatarCPF(v));
                if (erros.cpf) setErros((prev) => ({ ...prev, cpf: "" }));
              }}
              erro={erros.cpf}
            />

            <CampoSelect
              id="sexo"
              rotulo="Sexo"
              valor={sexo}
              placeholder="Toque para escolher"
              opcoes={opcoesSexo}
              aoMudar={(v) => {
                setSexo(v);
                if (erros.sexo) setErros((prev) => ({ ...prev, sexo: "" }));
              }}
              erro={erros.sexo}
            />

            <CampoFormulario
              id="dataNascimento"
              rotulo="Data de nascimento"
              tipo="text"
              valor={dataNascimento}
              placeholder="DD/MM/AAAA"
              autoComplete="bday"
              inputMode="numeric"
              aoMudar={(v) => {
                setDataNascimento(formatarData(v));
                if (erros.dataNascimento) {
                  setErros((prev) => ({ ...prev, dataNascimento: "" }));
                }
              }}
              erro={erros.dataNascimento}
            />

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
