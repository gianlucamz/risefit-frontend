"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertaErro, BotaoAcesso, CampoSenha } from "./AcessoUI";
import { CampoFormulario, LogoRiseFit, validarEmail } from "./CadastroForm";
import { formatarCPF, validarCPF } from "./CadastroComplementoForm";
import { loginAPI } from "@/services/api";

function formatarIdentificador(valor: string): string {
  if (/[a-zA-Z@]/.test(valor)) return valor;
  return formatarCPF(valor);
}

export default function LoginForm() {
  const router = useRouter();

  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState("");
  const [carregando, setCarregando] = useState(false);

  function validar(): boolean {
    const novosErros: Record<string, string> = {};
    const valor = identificador.trim();

    if (!valor) {
      novosErros.identificador = "Informe seu e-mail ou CPF.";
    } else if (valor.includes("@")) {
      if (!validarEmail(valor)) {
        novosErros.identificador = "Informe um e-mail válido.";
      }
    } else if (!validarCPF(valor)) {
      novosErros.identificador = "Informe um e-mail ou CPF válido.";
    }

    if (!senha) {
      novosErros.senha = "Informe sua senha.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroGeral("");

    if (!validar()) return;

    setCarregando(true);
    try {
      const valor = identificador.trim();
      const resposta = await loginAPI({
        identificador: valor.includes("@") ? valor.toLowerCase() : valor,
        senha,
      });

      try {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        sessionStorage.removeItem("usuario");
        sessionStorage.removeItem("token");

        const armazenamento = lembrar ? localStorage : sessionStorage;
        armazenamento.setItem("usuario", JSON.stringify(resposta.usuario));
        if (resposta.token) armazenamento.setItem("token", resposta.token);
      } catch (erro) {
        console.error("Não foi possível salvar a sessão no navegador:", erro);
        setErroGeral(
          "Não foi possível salvar sua sessão neste navegador. Verifique as permissões de armazenamento e tente novamente.",
        );
        return;
      }

      window.dispatchEvent(new Event("usuario_logado"));
      router.push("/area-aluno");
    } catch (erro) {
      setErroGeral(
        erro instanceof Error ? erro.message : "Não foi possível entrar.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <LogoRiseFit />

      <h1 className="mt-6 text-2xl font-extrabold text-dark sm:text-3xl">
        Acesse sua conta
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Entre com seus dados para acessar a sua Área do Aluno.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 space-y-5 text-left"
      >
        <CampoFormulario
          id="identificador"
          rotulo="E-mail ou CPF"
          valor={identificador}
          placeholder="Digite seu e-mail ou CPF"
          autoComplete="username"
          aoMudar={(v) => {
            setIdentificador(formatarIdentificador(v));
            if (erros.identificador)
              setErros((prev) => ({ ...prev, identificador: "" }));
          }}
          erro={erros.identificador}
        />

        <CampoSenha
          id="senha"
          rotulo="Senha"
          valor={senha}
          placeholder="Digite sua senha"
          aoMudar={(v) => {
            setSenha(v);
            if (erros.senha) setErros((prev) => ({ ...prev, senha: "" }));
          }}
          erro={erros.senha}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-brand"
            />
            Lembrar de mim
          </label>

          <Link
            href="/recuperar-senha"
            className="text-xs font-medium text-brand hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>

        {erroGeral && <AlertaErro>{erroGeral}</AlertaErro>}

        <BotaoAcesso carregando={carregando} textoCarregando="Entrando...">
          Entrar
        </BotaoAcesso>
      </form>

      <p className="mt-6 text-sm text-dark">Ainda não é aluno?</p>
      <Link
        href="/cadastro"
        className="mt-1 inline-block text-sm font-medium text-brand hover:underline"
      >
        Cadastre-se na RiseFit →
      </Link>
    </>
  );
}
