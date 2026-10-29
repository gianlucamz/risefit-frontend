import Link from "next/link";

// Página 404 do Next.js (App Router): salve como app/not-found.tsx
export default function NotFound() {
  return (
    <>
      {/* Esconde o footer do layout só enquanto a página 404 estiver na tela */}
      <style>{`body:has([data-not-found]) footer { display: none !important; }`}</style>

      {/* Ocupa exatamente o espaço abaixo do header (~84px) e centraliza o conteúdo
          na vertical e na horizontal. Se o seu header tiver altura diferente,
          ajuste o 5.25rem. */}
      <main
        data-not-found
        className="flex min-h-[calc(100vh-5.25rem)] flex-col items-center justify-center bg-[#0b0b0f] px-5 py-10 text-center text-white"
      >
        <h1 className="sr-only">Erro 404: página não encontrada</h1>

        <p
          aria-hidden="true"
          className="bg-gradient-to-b from-white to-[#cfcfd6] bg-clip-text pr-[0.08em] text-[clamp(6rem,20vw,12rem)] font-black italic leading-[0.9] tracking-tighter text-transparent"
        >
          404
        </p>

        <p
          aria-hidden="true"
          className="mt-4 text-[clamp(2rem,6vw,4rem)] font-extrabold uppercase leading-[1] tracking-tight"
        >
          Ops! Página não
          <br />
          <span className="text-[#7c3aed]">Encontrada</span>
        </p>

        <p className="mt-6 max-w-xl text-base text-white/80 sm:text-xl">
          A página que você procura não existe ou foi movida.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-xl bg-[#7c3aed] px-8 py-4 text-base font-medium text-white transition hover:bg-[#6d28d9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
          >
            Voltar ao início
            <Arrow />
          </Link>

          <Link
            href="/profissionais"
            className="inline-flex items-center gap-3 border-b-2 border-[#7c3aed] pb-1 text-base font-medium text-white transition hover:text-[#a78bfa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa]"
          >
            Explorar profissionais
            <Arrow />
          </Link>
        </div>
      </main>
    </>
  );
}

function Arrow() {
  return (
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
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </svg>
  );
}   