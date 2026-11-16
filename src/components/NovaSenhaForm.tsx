"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertaErro, BotaoAcesso, CampoSenha } from "./AcessoUI";
import { BotaoLink, IconeCheck, PainelEstado } from "./PainelUI";
import { redefinirSenhaAPI } from "@/services/api";

export default function NovaSenhaForm({ token }: { token?: string }) {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  function validar(): boolean {
    const novosErros: Record<string, string> = {};

    if (!senha) {
      novosErros.senha = "Informe a nova senha.";
    } else if (senha.length < 8) {
      novosErros.senha = "A senha deve ter pelo menos 8 caracteres.";
    }

    if (!confirmacao) {
      novosErros.confirmacao = "Confirme a nova senha.";
    } else if (senha !== confirmacao) {
      novosErros.confirmacao = "As senhas não são iguais.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroGeral("");

    if (!validar()) return;

    if (!token) {
      setErroGeral(
        "Link de redefinição inválido ou expirado. Solicite um novo link.",
      );
      return;
    }

    setCarregando(true);
    try {
      await redefinirSenhaAPI({ token, senha });
      setConcluido(true);
    } catch (err) {
      setErroGeral(
        err instanceof Error ? err.message : "Não foi possível salvar.",
      );
    } finally {
      setCarregando(false);
    }
  }

  if (concluido) {
    return (
      <div role="status">
        <PainelEstado
          embutido
          icone={<IconeCheck />}
          titulo="Senha redefinida"
          descricao="Agora você pode voltar para o login e usar sua nova senha para acessar a conta."
          observacao="Por segurança, não compartilhe sua senha. Se não reconhecer a alteração, procure o atendimento."
        >
          <BotaoLink href="/login" larguraTotal>
            Entrar na minha conta
          </BotaoLink>
          <Link
            href="/contato#contato"
            className="self-start text-sm font-medium text-brand hover:underline"
          >
            Procurar atendimento
          </Link>
        </PainelEstado>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold text-dark sm:text-3xl">
        Crie uma nova senha
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Escolha uma senha segura para proteger a sua conta.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        <CampoSenha
          id="nova-senha"
          rotulo="Nova senha"
          valor={senha}
          placeholder="Digite sua nova senha"
          autoComplete="new-password"
          dica="Use pelo menos 8 caracteres."
          aoMudar={(v) => {
            setSenha(v);
            if (erros.senha) setErros((prev) => ({ ...prev, senha: "" }));
          }}
          erro={erros.senha}
        />

        <CampoSenha
          id="confirmar-senha"
          rotulo="Confirmar nova senha"
          valor={confirmacao}
          placeholder="Digite a nova senha novamente"
          autoComplete="new-password"
          aoMudar={(v) => {
            setConfirmacao(v);
            if (erros.confirmacao)
              setErros((prev) => ({ ...prev, confirmacao: "" }));
          }}
          erro={erros.confirmacao}
        />

        {erroGeral && (
          <AlertaErro>
            {erroGeral}{" "}
            {!token && (
              <Link
                href="/recuperar-senha"
                className="font-semibold underline"
              >
                Solicitar novo link
              </Link>
            )}
          </AlertaErro>
        )}

        <BotaoAcesso carregando={carregando} textoCarregando="Salvando...">
          Salvar nova senha
        </BotaoAcesso>
      </form>

      <Link
        href="/login"
        className="mt-6 inline-block text-sm font-medium text-brand hover:underline"
      >
        Voltar para login
      </Link>
    </>
  );
}
