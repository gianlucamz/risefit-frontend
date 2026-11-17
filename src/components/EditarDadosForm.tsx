"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertaErro, AlertaSucesso } from "./AcessoUI";
import CampoTexto from "./CampoTexto";
import { Botao, BotaoLink, Cartao } from "./PainelUI";
import {
  useUsuarioLogado,
  salvarSessao,
  mascararCPF,
  formatarTelefoneExibicao,
} from "@/lib/sessao";
import {
  obterUsuarioAPI,
  atualizarUsuarioAPI,
} from "@/services/api";

type Erros = Partial<Record<"nome" | "email" | "telefone", string>>;

function formatarTelefoneInput(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function EditarDadosForm() {
  const router = useRouter();
  const usuarioSessao = useUsuarioLogado();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState("");
  const [salvo, setSalvo] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const sessaoStorage =
      typeof window !== "undefined"
        ? localStorage.getItem("usuario") || sessionStorage.getItem("usuario")
        : null;

    if (!sessaoStorage && !usuarioSessao) {
      router.push("/login");
      return;
    }

    const id =
      usuarioSessao?.id ||
      (sessaoStorage ? JSON.parse(sessaoStorage).id : null);

    if (!id) {
      setCarregandoDados(false);
      return;
    }

    setUsuarioId(Number(id));

    let ativo = true;

    async function carregar() {
      try {
        const dados = await obterUsuarioAPI(id);
        if (ativo) {
          setNome(dados.nome || "");
          setEmail(dados.email || "");
          setTelefone(formatarTelefoneExibicao(dados.telefone));
          setCpf(dados.cpf || "");
        }
      } catch {
        if (ativo) {
          setNome(
            usuarioSessao?.nome ||
              (usuarioSessao?.nomeCompleto as string) ||
              "",
          );
          setEmail(usuarioSessao?.email || "");
          setTelefone(
            formatarTelefoneExibicao(usuarioSessao?.telefone as string),
          );
          setCpf((usuarioSessao?.cpf as string) || "");
        }
      } finally {
        if (ativo) {
          setCarregandoDados(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [usuarioSessao, router]);

  function validar(): Erros {
    const e: Erros = {};
    if (!nome.trim() || nome.trim().split(/\s+/).length < 2) {
      e.nome = "Informe seu nome completo (nome e sobrenome).";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Informe um e-mail válido.";
    }
    const digitosTel = telefone.replace(/\D/g, "");
    if (digitosTel && (digitosTel.length < 10 || digitosTel.length > 11)) {
      e.telefone = "Informe um telefone válido com DDD.";
    }
    return e;
  }

  async function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault();
    setSalvo(false);
    setErroGeral("");

    const e = validar();
    setErros(e);
    if (Object.keys(e).length > 0) return;

    if (!usuarioId) {
      setErroGeral("Não foi possível identificar a conta ativa.");
      return;
    }

    setSalvando(true);

    try {
      const usuarioAtualizado = await atualizarUsuarioAPI(usuarioId, {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.replace(/\D/g, ""),
      });

      // Atualiza a sessão local para refletir imediatamente no Header
      salvarSessao(
        {
          ...(usuarioSessao || {}),
          id: usuarioAtualizado.id,
          nome: usuarioAtualizado.nome,
          email: usuarioAtualizado.email,
          telefone: usuarioAtualizado.telefone,
          cpf: usuarioAtualizado.cpf || cpf,
        },
        undefined,
        true,
      );

      setSalvo(true);
    } catch (erro) {
      setErroGeral(
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar as alterações. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoDados) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex items-center gap-3 text-brand">
          <svg
            className="h-6 w-6 animate-spin text-brand"
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
          <span className="text-sm font-semibold text-gray-600">
            Carregando seus dados...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="space-y-6">
      <Cartao titulo="Dados pessoais">
        <div className="space-y-5">
          <CampoTexto
            id="nome"
            rotulo="Nome completo"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              if (erros.nome) setErros((prev) => ({ ...prev, nome: "" }));
            }}
            autoComplete="name"
            erro={erros.nome}
          />
          <CampoTexto
            id="cpf"
            rotulo="CPF"
            value={mascararCPF(cpf)}
            disabled
            dica="Para corrigir o CPF cadastrado, solicite orientação pelo formulário de contato."
          />
        </div>
      </Cartao>

      <div id="contato" className="scroll-mt-28">
        <Cartao titulo="Informações de contato">
          <div className="space-y-5">
            <CampoTexto
              id="email"
              rotulo="E-mail"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (erros.email) setErros((prev) => ({ ...prev, email: "" }));
              }}
              autoComplete="email"
              erro={erros.email}
            />
            <CampoTexto
              id="telefone"
              rotulo="DDD + Celular"
              type="tel"
              inputMode="numeric"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(e) => {
                setTelefone(formatarTelefoneInput(e.target.value));
                if (erros.telefone)
                  setErros((prev) => ({ ...prev, telefone: "" }));
              }}
              autoComplete="tel"
              erro={erros.telefone}
              dica="Essas informações são usadas nas comunicações sobre sua conta e seu plano."
            />
          </div>
        </Cartao>
      </div>

      {erroGeral && <AlertaErro>{erroGeral}</AlertaErro>}

      {salvo && (
        <AlertaSucesso>
          Suas alterações foram salvas com sucesso!
        </AlertaSucesso>
      )}

      <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-3">
        <Botao type="submit" disabled={salvando}>
          {salvando ? "Salvando alterações..." : "Salvar alterações"}
        </Botao>
        <BotaoLink href="/minha-conta" variante="secundario">
          Cancelar
        </BotaoLink>
      </div>
    </form>
  );
}
