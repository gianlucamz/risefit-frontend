"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertaErro } from "./AcessoUI";
import { cadastrarUsuarioAPI } from "@/services/api";
import { salvarSessao } from "@/lib/sessao";
import {
  AvisoPrivacidade,
  BotaoCadastro,
  BotaoVoltar,
  CampoFormulario,
  CampoSelect,
  LogoRiseFit,
  TituloCadastro,
  type OpcaoSelect,
} from "./CadastroForm";

export {
  BotaoVoltar,
  CampoFormulario,
  CampoSelect,
  LogoRiseFit,
} from "./CadastroForm";

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

export function validarDataNascimento(data: string): {
  valido: boolean;
  mensagem?: string;
} {
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
    return {
      valido: false,
      mensagem: "É necessário ter no mínimo 12 anos para se cadastrar.",
    };
  }

  return { valido: true };
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
}

export default function CadastroComplementoForm({
  dadosIniciais,
  aoCompletar,
}: CadastroComplementoFormProps) {
  const router = useRouter();

  const [cpf, setCpf] = useState(
    dadosIniciais?.cpf ? formatarCPF(dadosIniciais.cpf) : "",
  );
  const [sexo, setSexo] = useState(dadosIniciais?.sexo ?? "");
  const [dataNascimento, setDataNascimento] = useState(
    dadosIniciais?.dataNascimento
      ? formatarData(dadosIniciais.dataNascimento)
      : "",
  );

  const [dadosEtapa1] = useState<{
    nome?: string;
    email?: string;
    celular?: string;
    senha?: string;
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
  const [erroGeral, setErroGeral] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [planoParam] = useState<string>(() => {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    const param = params.get("plano");
    const salvo = sessionStorage.getItem("risefit_plano_escolhido") || "";
    const planoDefinido = (param || salvo).toLowerCase();

    if (param) {
      sessionStorage.setItem("risefit_plano_escolhido", planoDefinido);
    }

    return planoDefinido;
  } catch {
    return "";
  }
});

  const opcoesSexo: OpcaoSelect[] = [
    { valor: "Feminino", rotulo: "Feminino" },
    { valor: "Masculino", rotulo: "Masculino" },
    { valor: "Outro", rotulo: "Outro" },
    { valor: "Prefiro não informar", rotulo: "Prefiro não informar" },
  ];

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
    setErroGeral("");

    if (!validar()) return;

    setCarregando(true);

    try {
      const dataIso = dataNascimento.includes("/")
        ? dataNascimento.split("/").reverse().join("-")
        : dataNascimento;

      const usuarioCriado = await cadastrarUsuarioAPI({
        nome: dadosEtapa1.nome?.trim() || "Aluno RiseFit",
        email: dadosEtapa1.email?.trim().toLowerCase() || "",
        senha: dadosEtapa1.senha || "RiseFit@123",
        dataNascimento: dataIso,
        telefone: dadosEtapa1.celular ? dadosEtapa1.celular.replace(/\D/g, "") : "",
        cpf: cpf.replace(/\D/g, ""),
        sexo: sexo.trim(),
        cargo: "ALUNO",
      });

      const usuarioObj = (
        usuarioCriado && typeof usuarioCriado === "object"
          ? usuarioCriado
          : {}
      ) as Record<string, unknown>;

      salvarSessao(
        {
          id: usuarioObj.id as string | number | undefined,
          nome: (usuarioObj.nome as string) || dadosEtapa1.nome,
          email: (usuarioObj.email as string) || dadosEtapa1.email,
          cpf: cpf.trim(),
          cargo: "ALUNO",
        },
        undefined,
        true,
      );

      const payloadFinal = {
        ...dadosEtapa1,
        cpf: cpf.trim(),
        sexo: sexo.trim(),
        dataNascimento: dataNascimento.trim(),
      };

      try {
        sessionStorage.setItem(
          "risefit_cadastro_completo",
          JSON.stringify(payloadFinal),
        );
      } catch {
        // Ignora erro de sessionStorage
      }

      if (aoCompletar) {
        aoCompletar(payloadFinal);
      }
      const queryPlano = planoParam
        ? `?plano=${encodeURIComponent(planoParam)}`
        : "";
      router.push(`/cadastro/endereco${queryPlano}`);
    } catch (erro) {
      setErroGeral(
        erro instanceof Error
          ? erro.message
          : "Não foi possível concluir o cadastro. Tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <BotaoVoltar
          href={`/cadastro${planoParam ? `?plano=${encodeURIComponent(planoParam)}` : ""}`}
          ariaLabel="Voltar para a primeira etapa"
          className="absolute top-0 left-0"
        />
        <LogoRiseFit className="mx-auto pt-13 sm:mt-0.5 sm:pt-0" />
      </div>

      <TituloCadastro className="mt-6 sm:mt-8.75">
        Só faltam mais algumas informações
      </TituloCadastro>

      <div className="mt-8 sm:mt-9">
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5.75">
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
              chevron="escuro"
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
          </div>

          <div className="mt-5.5">
            <AvisoPrivacidade />
          </div>

          {erroGeral && (
            <div className="mt-4">
              <AlertaErro>{erroGeral}</AlertaErro>
            </div>
          )}

          <BotaoCadastro carregando={carregando} className="mt-6.25">
            Continuar para endereço e cobrança
          </BotaoCadastro>
        </form>
      </div>
    </div>
  );
}
