"use client";

import { useState } from "react";
import { AlertaSucesso } from "./AcessoUI";
import CampoTexto from "./CampoTexto";
import { Botao, BotaoLink, Cartao } from "./PainelUI";
import { alunoDemo } from "@/data/aluno";

type Erros = Partial<Record<"nome" | "email" | "telefone", string>>;

function mascararTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Formulário de edição de dados. Só valida no navegador: nada é enviado ao servidor.
export default function EditarDadosForm() {
  const [nome, setNome] = useState(alunoDemo.nome);
  const [email, setEmail] = useState(alunoDemo.email);
  const [telefone, setTelefone] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [salvo, setSalvo] = useState(false);

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().split(/\s+/).length < 2) e.nome = "Informe seu nome completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Informe um e-mail válido.";
    if (telefone && telefone.replace(/\D/g, "").length < 11)
      e.telefone = "Informe o DDD e o número do celular.";
    return e;
  }

  function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault();
    const e = validar();
    setErros(e);
    setSalvo(Object.keys(e).length === 0);
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="space-y-6">
      <Cartao titulo="Dados pessoais">
        <div className="space-y-5">
          <CampoTexto
            id="nome"
            rotulo="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            erro={erros.nome}
          />
          <CampoTexto
            id="cpf"
            rotulo="CPF"
            value={alunoDemo.cpfMascarado}
            disabled
            dica="Para corrigir o CPF, solicite orientação pelo formulário de contato."
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
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              erro={erros.email}
            />
            <CampoTexto
              id="telefone"
              rotulo="DDD + Celular"
              type="tel"
              inputMode="numeric"
              placeholder={alunoDemo.telefoneMascarado}
              value={telefone}
              onChange={(e) => setTelefone(mascararTelefone(e.target.value))}
              autoComplete="tel"
              erro={erros.telefone}
              dica="Essas informações são usadas nas comunicações sobre sua conta e seu plano."
            />
          </div>
        </Cartao>
      </div>

      {salvo && (
        <AlertaSucesso>
          Alterações validadas neste exemplo. Nenhum dado foi enviado.
        </AlertaSucesso>
      )}

      <div className="flex flex-wrap gap-3">
        <Botao type="submit">Salvar alterações</Botao>
        <BotaoLink href="/minha-conta" variante="secundario">
          Cancelar
        </BotaoLink>
      </div>
    </form>
  );
}
