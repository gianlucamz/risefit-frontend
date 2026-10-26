import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-dark text-white">
      {/* ---------- Decoração: lado esquerdo (só no desktop) ---------- */}
      <svg
        className="absolute -bottom-[114px] -left-[172px] hidden lg:block"
        width="292"
        height="253"
        viewBox="0 0 292 253"
      >
        <polygon
          points="73,7 219,7 285,126 219,246 73,246 7,126"
          fill="none"
          stroke="#7456B8"
          strokeWidth="14"
        />
      </svg>

      <div className="absolute left-[14px] top-[60%] hidden grid-cols-2 gap-4 lg:grid">
        <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
        <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
        <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
        <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
      </div>

      {/* ---------- Conteúdo centralizado ---------- */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-14">
        {/* Mobile: uma coluna (texto em cima, imagens embaixo). Desktop: duas colunas */}
        <div className="grid items-center lg:grid-cols-[minmax(0,524fr)_minmax(0,804fr)]">
          {/* ===== COLUNA DA ESQUERDA: textos ===== */}
          <div className="relative z-10 py-12 lg:py-0 lg:pl-12">
            {/* Mini logo */}
            <div className="flex items-center gap-3">
              {/* Troque pelo ícone do bracinho quando exportar do Figma */}
              <Image src="/logo.png" alt="" width={55} height={38} />
              <span className="text-2xl font-extrabold tracking-tight lg:text-3xl">
                RISEFIT
              </span>
            </div>

            {/* Título grande (o tamanho acompanha a largura da tela) */}
            <h1 className="mt-8 -skew-x-12 font-display uppercase leading-[0.95] tracking-tight">
              <span className="block text-[clamp(56px,6.67vw,96px)] text-brand">
                Academia
              </span>
              <span className="block text-[clamp(88px,10.4vw,150px)] text-white">
                RiseFit
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="mt-8 text-lg leading-snug">
              Uma equipe pronta para ajudar
              <br />
              você a alcançar seus objetivos.
            </p>

            {/* Botão + telefone */}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/#planos"
                className="rounded-full bg-brand px-10 py-3 text-xl font-medium"
              >
                Comece já
              </Link>

              <div className="flex items-center gap-2 text-lg">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-brand"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span>(12) 99731-4825</span>
              </div>
            </div>
          </div>

          {/* ===== COLUNA DA DIREITA: hexágonos e fotos =====
              Tudo aqui usa porcentagem, então a composição inteira
              encolhe e cresce junto com a tela. */}
          <div className="relative -mx-6 aspect-[860/720] lg:ml-0 lg:-mr-14">
            {/* Brilho roxo */}
            <div className="absolute left-[11%] top-0 h-[25%] w-[49%] bg-brand/25 blur-3xl" />

            {/* Hexágonos roxos */}
            <div className="hexagono absolute left-[71.74%] top-[-9.31%] h-[46.67%] w-[45.12%] bg-brand" />
            <div className="hexagono absolute left-[35.7%] top-[63.75%] h-[46.67%] w-[45.12%] bg-brand" />

            {/* Hexágono só com borda (atrás da cabeça) */}
            <svg
              className="absolute left-[13.84%] top-[5.56%] h-[25.83%] w-[25%]"
              viewBox="0 0 215 186"
            >
              <polygon
                points="54,7 161,7 208,93 161,179 54,179 7,93"
                fill="none"
                stroke="#7456B8"
                strokeWidth="14"
              />
            </svg>

            {/* Hexágono com foto 1 (borda branca) */}
            <div className="hexagono absolute left-[38.02%] top-[16.53%] h-[44.44%] w-[43.02%] bg-white">
              <div className="hexagono absolute inset-0 scale-[0.94]">
                <Image
                  src="https://images.unsplash.com/photo-1603077492579-39ff927823db?auto=format&fit=crop&w=1200&q=80"
                  alt="Halteres no chão da academia"
                  fill
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Hexágono com foto 2 (borda branca) */}
            <div className="hexagono absolute left-[72.09%] top-[40%] h-[44.44%] w-[43.02%] bg-white">
              <div className="hexagono absolute inset-0 scale-[0.94]">
                <Image
                  src="https://images.unsplash.com/photo-1609674248079-e9242e48c06b?auto=format&fit=crop&w=1200&q=80"
                  alt="Prateleira de halteres"
                  fill
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Homem com halteres (por cima de tudo) */}
            <div className="absolute left-0 top-[17.5%] h-[82.36%] w-[60.47%]">

            </div>

            {/* Bolinhas decorativas */}
            <div className="absolute left-[15%] top-[25.83%] grid grid-cols-2 gap-4">
              <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
              <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
              <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
              <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
              <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
              <span className="h-[5px] w-[5px] rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}