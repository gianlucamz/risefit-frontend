import Link from "next/link";

// Peças visuais reaproveitadas nas páginas internas (Área do Aluno, Minha conta,
// Carrinho, Assinatura e estados de confirmação). Só visual: nenhuma chamada de API.

/* ---------- Layout da página ---------- */

// Medidas do layout (1440px): conteúdo de 1200px (ou 920px no modo "estreita"),
// link de voltar 48px abaixo do header, título 38px e cartões 28px abaixo do subtítulo.
export function PaginaInterna({
  voltar,
  titulo,
  subtitulo,
  largura = "larga",
  centralizado = false,
  icone,
  children,
}: {
  voltar?: { href: string; texto?: string; rotulo?: string };
  titulo: React.ReactNode;
  subtitulo?: React.ReactNode;
  largura?: "larga" | "estreita";
  centralizado?: boolean;
  icone?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="bg-[#f8f8f9] px-5 pt-7.5 pb-10 sm:px-6 lg:pt-12 lg:pb-16">
      <div
        className={`mx-auto ${largura === "larga" ? "max-w-300" : "max-w-230"}`}
      >
        {voltar && (
          <Link
            href={voltar.href}
            aria-label={voltar.texto ? undefined : voltar.rotulo ?? "Voltar"}
            className="inline-block text-sm leading-5 font-semibold text-brand hover:underline"
          >
            ←{voltar.texto ? ` ${voltar.texto}` : ""}
          </Link>
        )}

        <header
          className={
            centralizado
              ? "mt-7 flex flex-col items-center text-center"
              : voltar
                ? "mt-6 lg:mt-8"
                : ""
          }
        >
          {icone && <div className="mb-5 text-brand">{icone}</div>}
          <h1
            className={`font-bold tracking-tight text-dark lg:tracking-normal ${
              centralizado
                ? "text-[28px] leading-8.75 lg:text-[30px] lg:leading-9.5"
                : "text-[28px] leading-8.75 lg:text-[38px] lg:leading-11.5"
            }`}
          >
            {titulo}
          </h1>
          {subtitulo && (
            <p
              className={`text-[15px] leading-5.75 text-gray-500 sm:text-base sm:leading-6 ${centralizado ? "mt-4.75" : "mt-3 lg:mt-4"}`}
            >
              {subtitulo}
            </p>
          )}
        </header>

        <div className="mt-7">{children}</div>
      </div>
    </main>
  );
}

/* ---------- Cartões ---------- */

export function Cartao({
  titulo,
  acao,
  destaque = false,
  className = "",
  classeCabecalho = "mb-[22px]",
  children,
}: {
  titulo?: React.ReactNode;
  acao?: React.ReactNode;
  destaque?: boolean;
  className?: string;
  // Espaço entre o título e o conteúdo (muda conforme a tela do layout)
  classeCabecalho?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[20px] border bg-white p-5 sm:p-7 ${
        destaque ? "border-brand" : "border-[#e4e6eb] sm:border-gray-200"
      } ${className}`}
    >
      {(titulo || acao) && (
        <header
          className={`flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${classeCabecalho}`}
        >
          {titulo && (
            <h2 className="text-[22px] leading-7.5 font-bold text-dark">
              {titulo}
            </h2>
          )}
          {acao}
        </header>
      )}
      {children}
    </section>
  );
}

// Linha "rótulo .......... valor" usada nos resumos (42px de altura no layout)
export function LinhaInfo({
  rotulo,
  valor,
  destaque = false,
}: {
  rotulo: React.ReactNode;
  valor: React.ReactNode;
  destaque?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:py-2.25">
      <dt className="text-[13px] text-gray-500 sm:text-sm">{rotulo}</dt>
      <dd
        className={`font-bold sm:text-right ${
          destaque
            ? "text-2xl leading-7 text-brand sm:text-[22px] sm:leading-6"
            : "text-[15px] leading-6 text-dark sm:text-base"
        }`}
      >
        {valor}
      </dd>
    </div>
  );
}

export function Divisor({ className = "mt-2.5 mb-5" }: { className?: string }) {
  return <hr className={`border-gray-200 ${className}`} />;
}

export function Selo({
  children,
  tom = "neutro",
}: {
  children: React.ReactNode;
  tom?: "neutro" | "alerta";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        tom === "alerta" ? "text-red-600" : "bg-gray-100 text-gray-600"
      }`}
    >
      {children}
    </span>
  );
}

// Caixa de seleção no estilo do layout (18px, borda cinza, marcada em roxo)
export function CaixaSelecao({
  className = "",
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <input
      type="checkbox"
      {...props}
      className={`grid h-4.5 w-4.5 shrink-0 cursor-pointer appearance-none place-content-center rounded-sm border border-gray-300 bg-white transition-colors before:hidden before:h-2.5 before:w-2.5 before:bg-white before:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0%,43%_62%)] checked:border-brand checked:bg-brand checked:before:block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed ${className}`}
    />
  );
}

/* ---------- Botões ---------- */

type VarianteBotao = "primario" | "secundario" | "perigo";

const estiloBotao: Record<VarianteBotao, string> = {
  primario: "bg-brand text-white hover:bg-[#6d28d9] border border-brand",
  secundario: "bg-white text-dark border border-gray-300 hover:border-brand hover:text-brand",
  perigo: "bg-red-600 text-white border border-red-600 hover:bg-red-700",
};

// "grande": medida dos botões do layout (48px de altura, raio 12, texto 15px em negrito)
function classesBotao(variante: VarianteBotao, larguraTotal: boolean, grande = false) {
  return `inline-flex cursor-pointer items-center justify-center text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
    grande
      ? "min-h-12 rounded-xl px-6 py-2 text-[15px] leading-5 font-bold"
      : "min-h-12 rounded-lg px-6 py-2.5 text-sm font-semibold sm:min-h-11"
  } ${estiloBotao[variante]} ${larguraTotal ? "w-full" : ""}`;
}

export function BotaoLink({
  href,
  variante = "primario",
  larguraTotal = false,
  grande = false,
  className = "",
  children,
}: {
  href: string;
  variante?: VarianteBotao;
  larguraTotal?: boolean;
  grande?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${classesBotao(variante, larguraTotal, grande)} ${className}`}>
      {children}
    </Link>
  );
}

export function Botao({
  variante = "primario",
  larguraTotal = false,
  grande = false,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: VarianteBotao;
  larguraTotal?: boolean;
  grande?: boolean;
}) {
  return (
    <button
      type="button"
      {...props}
      className={`${classesBotao(variante, larguraTotal, grande)} ${className}`}
    />
  );
}

export function LinkSeta({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline ${className}`}
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}

/* ---------- Painel de estado (confirmação, vazio, erro) ---------- */

export function PainelEstado({
  rotulo,
  icone,
  titulo,
  descricao,
  observacao,
  embutido = false,
  children,
}: {
  embutido?: boolean;
  rotulo?: string;
  icone: React.ReactNode;
  titulo: string;
  descricao: React.ReactNode;
  observacao?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={
        embutido ? "" : "rounded-2xl border border-gray-200 bg-white p-6 lg:p-7"
      }
    >
      {rotulo && (
        <h2 className="text-xl font-semibold text-dark">{rotulo}</h2>
      )}
      <div className="mt-5 flex flex-col items-center text-center">
        <span className="text-brand">{icone}</span>
        <p className="mt-4 text-2xl font-semibold text-dark lg:text-[28px]">
          {titulo}
        </p>
        <p className="mt-4 max-w-md text-sm text-gray-500 lg:text-base">
          {descricao}
        </p>
      </div>
      {observacao && (
        <p className="mt-6 text-xs text-gray-500 lg:text-sm">{observacao}</p>
      )}
      {children && <div className="mt-5 flex flex-col gap-4">{children}</div>}
    </div>
  );
}

/* ---------- Ícones ---------- */

const baseIcone = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconeCheck({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg {...baseIcone} className={className}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8 12.5 2.7 2.7L17 9" />
    </svg>
  );
}

export function IconeRelogio({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg {...baseIcone} className={className}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconeAlerta({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg {...baseIcone} className={className}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
  );
}

export function IconeEmail({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg {...baseIcone} className={className}>
      <path d="M20 12V6.5A1.5 1.5 0 0 0 18.5 5h-13A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19H13" />
      <path d="m4.5 6 7.5 6 7.5-6" />
      <path d="m15.5 18 2 2 3.5-3.5" />
    </svg>
  );
}

export function IconeBusca({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg {...baseIcone} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconeCarrinho({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg {...baseIcone} className={className}>
      <path d="M3 4h2l2.4 11h11L21 7.5H6.2" />
      <circle cx="9" cy="19.5" r="1" />
      <circle cx="17" cy="19.5" r="1" />
    </svg>
  );
}

export function IconeUsuario({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg {...baseIcone} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
    </svg>
  );
}
