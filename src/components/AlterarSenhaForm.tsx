"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertaSucesso, CampoSenha } from "./AcessoUI";
import { Botao } from "./PainelUI";

type Erros = Partial<Record<"atual" | "nova" | "confirmacao", string>>;

// Troca de senha: validação apenas no navegador. Nada é enviado ao servidor.
export default function AlterarSenhaForm() {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [ok, setOk] = useState(false);

  function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault();
    const e: Erros = {};
    if (!atual) e.atual = "Informe sua senha atual.";
    if (nova.length < 8 || !/[a-zA-Z]/.test(nova) || !/\d/.test(nova))
      e.nova = "Use pelo menos 8 caracteres, com letras e números.";
    else if (nova === atual) e.nova = "A nova senha deve ser diferente da atual.";
    if (confirmacao !== nova) e.confirmacao = "As senhas não conferem.";
    setErros(e);
    const valido = Object.keys(e).length === 0;
    setOk(valido);
    if (valido) {
      setAtual("");
      setNova("");
      setConfirmacao("");
    }
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="space-y-5">
      <CampoSenha
        id="senha-atual"
        rotulo="Senha atual"
        placeholder="Digite sua senha atual"
        valor={atual}
        aoMudar={setAtual}
        erro={erros.atual}
      />
      <CampoSenha
        id="senha-nova"
        rotulo="Nova senha"
        placeholder="Digite sua nova senha"
        valor={nova}
        aoMudar={setNova}
        erro={erros.nova}
        dica="Use pelo menos 8 caracteres, com letras e números."
        autoComplete="new-password"
      />
      <CampoSenha
        id="senha-confirmacao"
        rotulo="Confirme a nova senha"
        placeholder="Repita a nova senha"
        valor={confirmacao}
        aoMudar={setConfirmacao}
        erro={erros.confirmacao}
        autoComplete="new-password"
      />
      {ok && (
        <AlertaSucesso>
          Senha validada neste exemplo. Nenhuma senha real foi alterada.
        </AlertaSucesso>
      )}
      <Botao type="submit" larguraTotal>
        Salvar nova senha
      </Botao>
      <Link
        href="/recuperar-senha"
        className="inline-block text-sm font-medium text-brand hover:underline"
      >
        Esqueci minha senha atual
      </Link>
    </form>
  );
}
