"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Página de cadastro: salve como src/app/cadastro/page.tsx
// O header e o footer já vêm do layout do site, então aqui fica só o formulário.

function formatarCelular(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [erros, setErros] = useState<Record<string, string>>({});

  function validar() {
    const novos: Record<string, string> = {};
    if (nome.trim().split(/\s+/).length < 2)
      novos.nome = "Informe seu nome completo.";
    if (!/^\S+@\S+\.\S+$/.test(email))
      novos.email = "Informe um e-mail válido.";
    if (celular.replace(/\D/g, "").length < 10)
      novos.celular = "Informe DDD + celular.";
    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    // TODO: enviar os dados para a sua API / próximo passo do cadastro
    console.log({ nome, email, celular });
  }

  return (
    <main className="bg-[#ececec] px-4 py-10 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-[1100px] rounded-sm bg-white px-6 py-12 sm:px-12 lg:py-16">
        {/* Topo: mais largo que o formulário, para o título caber em uma linha */}
        <div className="mx-auto max-w-[860px]">
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Voltar"
              className="absolute left-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-400 bg-white text-gray-900 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed] max-sm:static max-sm:mr-3 max-sm:translate-y-0"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 12H4" />
                <path d="M10 6l-6 6 6 6" />
              </svg>
            </button>

            <h1 className="text-center text-2xl font-semibold text-gray-950 sm:text-3xl lg:whitespace-nowrap lg:text-[2rem]">
              Sua jornada RiseFit começa agora!
            </h1>
          </div>

          {/* Logo: ícone R (/logo.png) + texto "RiseFit" */}
          <div
            role="img"
            aria-label="RiseFit"
            className="mt-6 flex items-center justify-center gap-2"
          >
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-9 w-auto"
            />
            <span
              aria-hidden="true"
              className="text-3xl font-black italic tracking-tight text-gray-950"
            >
              Rise<span className="text-[#7c3aed]">Fit</span>
            </span>
          </div>
        </div>

        {/* Formulário */}
        <div className="mx-auto mt-10 max-w-[560px]">
          <form onSubmit={aoEnviar} noValidate className="space-y-6">
            <Campo
              id="email"
              rotulo="E-mail"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              erro={erros.email}
            />

            <Campo
              id="celular"
              rotulo="DDD + Celular"
              type="tel"
              inputMode="numeric"
              placeholder="(00) 00000-0000"
              autoComplete="tel"
              value={celular}
              onChange={(v) => setCelular(formatarCelular(v))}
              erro={erros.celular}
            />

            <p className="text-center">
              <Link
                href="/login"
                className="text-sm font-medium text-[#6d28d9] underline underline-offset-2 hover:text-[#5b21b6]"
              >
                Já fui aluno(a) RiseFit →
              </Link>
            </p>

            <div className="space-y-4 text-sm leading-relaxed text-gray-700">
              <p>
                Utilizamos seus dados pessoais para o cadastro em nossa
                plataforma, que nos permite lhe prestar nossos serviços. Para
                mais informações, acesse nossa Política de Privacidade. Caso não
                queira receber comunicações de marketing, o descadastramento
                pode ser realizado pelo Portal de Privacidade ou pelo link
                disponibilizado no rodapé dos e-mails da RiseFit.
              </p>
              <p>
                <strong className="font-semibold text-gray-950">
                  Importante:
                </strong>{" "}
                <strong className="font-semibold text-gray-950">
                  apenas comunicações de Marketing podem ser desativadas.
                </strong>{" "}
                O envio de informações sobre seus planos e/ou sobre sua RiseFit
                continuarão a ser encaminhados, pois são essenciais para
                prestação de serviços.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#7c3aed] py-4 text-base font-semibold text-white transition hover:bg-[#6d28d9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
            >
              Continuar cadastro
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

/* ---------- Campo de formulário ---------- */

function Campo({
  id,
  rotulo,
  value,
  onChange,
  erro,
  type = "text",
  ...resto
}: {
  id: string;
  rotulo: string;
  value: string;
  onChange: (valor: string) => void;
  erro?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-950"
      >
        {rotulo}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`h-14 w-full rounded-lg border bg-white px-4 text-base text-gray-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 ${
          erro ? "border-red-500" : "border-gray-400 focus:border-[#7c3aed]"
        }`}
        {...resto}
      />
      {erro && (
        <p id={`${id}-erro`} className="mt-1 text-sm text-red-600">
          {erro}
        </p>
      )}
    </div>
  );
}
