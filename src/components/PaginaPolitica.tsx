import Link from "next/link";

export type SecaoPolitica = {
  titulo: string;
  paragrafos: string[];
};

type Props = {
  titulo: string;
  descricao: string;
  // Texto em destaque no topo do cartão (opcional)
  introducao?: string;
  secoes: SecaoPolitica[];
};

// Layout compartilhado das páginas de Privacidade, Termos de uso e Cookies.
// O header e o footer já vêm do layout do site.
export default function PaginaPolitica({
  titulo,
  descricao,
  introducao,
  secoes,
}: Props) {
  return (
    <main className="bg-[#f8f9fa] px-6 py-10 lg:py-14">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          aria-label="Voltar para a página inicial"
          className="inline-flex text-brand transition-colors hover:text-[#6d28d9]"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 12H4" />
            <path d="M10 6l-6 6 6 6" />
          </svg>
        </Link>

        <h1 className="mt-6 text-3xl font-extrabold text-dark lg:text-4xl">
          {titulo}
        </h1>
        <p className="mt-3 text-sm text-gray-600">{descricao}</p>

        <article className="mt-8 rounded-2xl bg-white p-6 shadow-sm lg:p-8">
          {introducao && (
            <p className="border-b border-gray-100 pb-6 text-sm font-medium leading-relaxed text-dark">
              {introducao}
            </p>
          )}

          {secoes.map((secao) => (
            <section
              key={secao.titulo}
              className="border-b border-gray-100 py-6 last:border-b-0 last:pb-4"
            >
              <h2 className="text-base font-bold text-dark">{secao.titulo}</h2>
              <div className="mt-2 space-y-2">
                {secao.paragrafos.map((texto, i) => (
                  <p key={i} className="text-sm leading-relaxed text-gray-500">
                    {texto}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <Link
            href="/contato"
            className="mt-2 inline-block text-xs font-medium text-brand hover:underline"
          >
            Ir para contato →
          </Link>
        </article>
      </div>
    </main>
  );
}