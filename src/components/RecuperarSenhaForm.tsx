"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertaErro, AlertaSucesso, BotaoAcesso } from "./AcessoUI";
import { CampoFormulario, LogoRiseFit, validarEmail } from "./CadastroForm";
import { solicitarRecuperacaoSenhaAPI } from "@/services/api";

export default function RecuperarSenhaForm() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [erroGeral, setErroGeral] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroGeral("");

    const valor = email.trim().toLowerCase();
    if (!valor) {
      setErro("Informe o e-mail cadastrado.");
      return;
    }
    if (!validarEmail(valor)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    setErro("");
    setCarregando(true);
    try {
      await solicitarRecuperacaoSenhaAPI(valor);
      setEnviado(true);
    } catch (err) {
      setErroGeral(
        err instanceof Error ? err.message : "Não foi possível enviar.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <LogoRiseFit className="!justify-start" />

      <h1 className="mt-6 text-2xl font-extrabold text-dark sm:text-3xl">
        Esqueceu sua senha?
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Informe o e-mail da sua conta e enviaremos as instruções para criar
        uma nova senha.
      </p>

      {enviado ? (
        <div className="mt-8 space-y-5">
          <AlertaSucesso>
            Se existir uma conta com o e-mail <strong>{email.trim()}</strong>,
            você receberá as instruções em instantes. Confira também a caixa de
            spam.
          </AlertaSucesso>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <CampoFormulario
            id="email"
            rotulo="E-mail cadastrado"
            tipo="email"
            valor={email}
            placeholder="Digite seu e-mail"
            autoComplete="email"
            inputMode="email"
            aoMudar={(v) => {
              setEmail(v);
              if (erro) setErro("");
            }}
            erro={erro}
          />

          {erroGeral && <AlertaErro>{erroGeral}</AlertaErro>}

          <BotaoAcesso carregando={carregando} textoCarregando="Enviando...">
            Enviar instruções
          </BotaoAcesso>
        </form>
      )}

      <Link
        href="/login"
        className="mt-6 inline-block text-sm font-medium text-brand hover:underline"
      >
        Voltar para login
      </Link>
    </>
  );
}
