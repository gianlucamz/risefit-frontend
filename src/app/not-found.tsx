import Link from "next/link";

const botao =
  "inline-flex h-12 items-center justify-center rounded-xl px-6 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

// Página 404 do Next.js (App Router)
export default function NotFound() {
  return (
    <main className="bg-[#f8f8f9] px-4 pt-8 pb-20 sm:px-6 lg:pt-11.75 lg:pb-36">
      <div className="mx-auto w-full max-w-230">
        <Link
          href="/contato#central-de-ajuda"
          className="text-sm leading-5 font-medium text-brand hover:underline"
        >
          ← Ajuda
        </Link>

        <div className="mt-16 flex flex-col items-center text-center lg:mt-22.25">
          <p
            aria-hidden="true"
            className="text-[72px] leading-18 font-bold text-brand lg:text-[88px] lg:leading-22"
          >
            404
          </p>
          <h1 className="mt-8 text-[30px] leading-9.5 font-semibold text-[#0a0c11] lg:mt-10.75 lg:text-[38px] lg:leading-11.5">
            Página não encontrada
          </h1>
          <p className="mt-4 text-base leading-6 text-[#6b7280] lg:mt-6.5">
            O endereço pode ter mudado ou não estar disponível. Volte para a
            Página Inicial ou procure ajuda para continuar.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-4 lg:mt-5.25">
            <Link href="/" className={`${botao} bg-brand text-white hover:bg-[#6d28d9]`}>
              Voltar para Página Inicial
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
