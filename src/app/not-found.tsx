import Link from "next/link";

const botao =
  "inline-flex h-12 items-center justify-center rounded-xl px-6 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

// Página 404 do Next.js (App Router)
export default function NotFound() {
  return (
    <main className="bg-[#f8f8f9] px-4 pt-8 pb-20 sm:px-6 lg:pt-[47px] lg:pb-36">
      <div className="mx-auto w-full max-w-230">
        <Link
          href="/contato#central-de-ajuda"
          className="text-sm leading-5 font-medium text-brand hover:underline"
        >
          ← Ajuda
        </Link>

        <div className="mt-16 flex flex-col items-center text-center lg:mt-[89px]">
          <p
            aria-hidden="true"
            className="text-[72px] leading-[72px] font-bold text-brand lg:text-[88px] lg:leading-[88px]"
          >
            404
          </p>
          <h1 className="mt-8 text-[30px] leading-[38px] font-semibold text-[#0a0c11] lg:mt-[43px] lg:text-[38px] lg:leading-[46px]">
            Página não encontrada
          </h1>
          <p className="mt-4 text-base leading-6 text-[#6b7280] lg:mt-[26px]">
            O endereço pode ter mudado ou não estar disponível. Volte para a
            Home ou procure ajuda para continuar.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-4 lg:mt-[21px]">
            <Link href="/" className={`${botao} bg-brand text-white hover:bg-[#6d28d9]`}>
              Voltar para Home
            </Link>
            <Link
              href="/contato#central-de-ajuda"
              className={`${botao} border border-[#d1d4db] bg-white text-[#0a0c11] hover:border-brand hover:text-brand`}
            >
              Procurar ajuda
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
