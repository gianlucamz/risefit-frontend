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
    <main className="bg-[#f8f8f9] px-4 pt-8 pb-12 sm:px-6 lg:pt-[47px] lg:pb-[65px]">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Não existe uma página-índice de políticas: o atalho volta para a Home */}
        <Link
          href="/"
          className="text-sm leading-5 font-medium text-brand hover:underline"
        >
          ← Políticas
        </Link>

        <h1 className="mt-6 text-[30px] leading-[38px] font-semibold text-[#0a0c11] lg:mt-8 lg:text-[38px] lg:leading-[46px]">
          {titulo}
        </h1>
        <p className="mt-3 text-base leading-6 text-[#6b7280] lg:mt-4">
          {descricao}
        </p>

        <article className="mt-6 rounded-xl bg-white px-5 pt-6 pb-7 shadow-[0_1px_3px_rgba(10,12,17,0.04)] sm:px-8 sm:pt-8 sm:pb-8 lg:mt-[29px]">
          {introducao && (
            <p className="text-base leading-6 text-[#0a0c11]">{introducao}</p>
          )}

          {secoes.map((secao) => (
            <section
              key={secao.titulo}
              className="border-b border-[#e4e6eb] pt-6 pb-3 first:pt-0 sm:pt-[29px] sm:pb-3 sm:first:pt-px"
            >
              <h2 className="text-xl leading-[30px] font-semibold text-[#0a0c11] sm:text-[22px]">
                {secao.titulo}
              </h2>
              <div className="mt-2 space-y-2 sm:mt-[13px]">
                {secao.paragrafos.map((texto, i) => (
                  <p key={i} className="text-base leading-6 text-[#6b7280]">
                    {texto}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <Link
            href="/contato"
            className="mt-6 inline-block text-sm leading-5 font-medium text-brand hover:underline sm:mt-[27px]"
          >
            Ir para contato →
          </Link>
        </article>
      </div>
    </main>
  );
}
