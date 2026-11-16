import Link from "next/link";

export type SecaoPolitica = {
  titulo: string;
  paragrafos: string[];
};

// "1. Sobre esta política" -> "sobre-esta-politica" (âncora do índice "Nesta página")
function ancora(titulo: string) {
  return titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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
    <main className="bg-[#f8f8f9] px-5 pt-7.5 pb-10 sm:px-6 lg:pt-[47px] lg:pb-[65px]">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Não existe uma página-índice de políticas: o atalho volta para a Página Inicial */}
        <Link
          href="/"
          className="text-sm leading-5 font-medium text-brand hover:underline"
        >
          ← Políticas
        </Link>

        <h1 className="mt-6 text-[28px] leading-[35px] font-semibold text-[#0a0c11] lg:mt-8 lg:text-[38px] lg:leading-[46px]">
          {titulo}
        </h1>
        <p className="mt-3 text-[15px] leading-[23px] text-[#6b7280] sm:text-base sm:leading-6 lg:mt-4">
          {descricao}
        </p>

        {/* Índice "Nesta página" (só no celular, como no layout mobile) */}
        <nav aria-labelledby="nesta-pagina" className="mt-7 border-b border-[#e4e6eb] pb-5 lg:hidden">
          <h2 id="nesta-pagina" className="text-base font-bold text-[#0a0c11]">
            Nesta página
          </h2>
          <ol className="mt-4 space-y-3 text-sm leading-[17px]">
            {secoes.map((secao) => (
              <li key={secao.titulo}>
                <a href={`#${ancora(secao.titulo)}`} className="text-brand hover:underline">
                  {secao.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="mt-7 rounded-xl border border-[#e4e6eb] lg:border-0 bg-white px-5 pt-6 pb-7 shadow-[0_1px_3px_rgba(10,12,17,0.04)] sm:px-8 sm:pt-8 sm:pb-8 lg:mt-[29px]">
          {introducao && (
            <p className="hidden text-base leading-6 text-[#0a0c11] lg:block">{introducao}</p>
          )}

          {secoes.map((secao) => (
            <section
              key={secao.titulo}
              id={ancora(secao.titulo)}
              className="scroll-mt-12 border-b lg:scroll-mt-28 border-[#e4e6eb] pt-6 pb-3 first:pt-0 sm:pt-[29px] sm:pb-3 sm:first:pt-px"
            >
              <h2 className="text-[19px] leading-[26px] font-bold text-[#0a0c11] sm:text-[22px] sm:leading-[30px] sm:font-semibold">
                {secao.titulo}
              </h2>
              <div className="mt-2 space-y-2 sm:mt-[13px]">
                {secao.paragrafos.map((texto, i) => (
                  <p key={i} className="text-sm leading-[21px] text-[#6b7280] sm:text-base sm:leading-6">
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
            <span className="lg:hidden">Ir para atendimento →</span>
            <span className="hidden lg:inline">Ir para contato →</span>
          </Link>
        </article>
      </div>
    </main>
  );
}
