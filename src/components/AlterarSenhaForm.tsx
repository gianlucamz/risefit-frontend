"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertaErro, AlertaSucesso, CampoSenha } from "./AcessoUI";
import { Botao } from "./PainelUI";
import { useUsuarioLogado } from "@/lib/sessao";
import { atualizarUsuarioAPI } from "@/services/api";

type Erros = Partial<Record<"atual" | "nova" | "confirmacao", string>>;

export default function AlterarSenhaForm() {
  const usuarioSessao = useUsuarioLogado();
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState("");
  const [ok, setOk] = useState(false);
  const [salvando, setSalvando] = useState(false);

  function validar(): Erros {
    const e: Erros = {};
    if (!atual) e.atual = "Informe sua senha atual.";
    if (nova.length < 8) {
      e.nova = "A nova senha deve ter no mínimo 8 caracteres.";
    } else if (nova === atual) {
      e.nova = "A nova senha deve ser diferente da atual.";
    }
    if (confirmacao !== nova) {
      e.confirmacao = "As senhas não conferem.";
    }
    return e;
  }

  async function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault();
    setOk(false);
    setErroGeral("");

    const e = validar();
    setErros(e);
    if (Object.keys(e).length > 0) return;

    const id =
      usuarioSessao?.id ||
      (typeof window !== "undefined"
        ? JSON.parse(
            localStorage.getItem("usuario") ||
              sessionStorage.getItem("usuario") ||
              "{}",
          )?.id
        : null);

    if (!id) {
      setErroGeral("Não foi possível identificar a sessão ativa.");
      return;
    }

    setSalvando(true);

    try {
      await atualizarUsuarioAPI(id, {
        senhaAtual: atual,
        novaSenha: nova,
      });

      setOk(true);
      setAtual("");
      setNova("");
      setConfirmacao("");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Não foi possível alterar a senha. Verifique os dados.";
      if (msg.toLowerCase().includes("atual")) {
        setErros((prev) => ({ ...prev, atual: msg }));
      } else {
        setErroGeral(msg);
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="space-y-5">
      <CampoSenha
        id="senha-atual"
        rotulo="Senha atual"
        placeholder="Digite sua senha atual"
        valor={atual}
        aoMudar={(v) => {
          setAtual(v);
          if (erros.atual) setErros((prev) => ({ ...prev, atual: "" }));
        }}
        erro={erros.atual}
        autoComplete="current-password"
      />
      <CampoSenha
        id="senha-nova"
        rotulo="Nova senha"
        placeholder="Digite sua nova senha"
        valor={nova}
        aoMudar={(v) => {
          setNova(v);
          if (erros.nova) setErros((prev) => ({ ...prev, nova: "" }));
        }}
        erro={erros.nova}
        dica="Use pelo menos 8 caracteres."
        autoComplete="new-password"
      />
      <CampoSenha
        id="senha-confirmacao"
        rotulo="Confirme a nova senha"
        placeholder="Repita a nova senha"
        valor={confirmacao}
        aoMudar={(v) => {
          setConfirmacao(v);
          if (erros.confirmacao)
            setErros((prev) => ({ ...prev, confirmacao: "" }));
        }}
        erro={erros.confirmacao}
        autoComplete="new-password"
      />

      {erroGeral && <AlertaErro>{erroGeral}</AlertaErro>}

      {ok && (
        <AlertaSucesso>
          Sua senha foi alterada com sucesso!
        </AlertaSucesso>
      )}

      <Botao type="submit" larguraTotal disabled={salvando}>
        {salvando ? "Salvando nova senha..." : "Salvar nova senha"}
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
