import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

// A hero é a arte pronta do design (public/design/hero-home.jpg, proporção 2:1),
// desenhada em 1440x720. Os textos estão na própria imagem, por isso:
// - o título e o subtítulo existem em HTML só para leitores de tela (sr-only);
// - "Comece já" e o telefone são links transparentes posicionados sobre a arte.
const LARGURA = 1440;
const ALTURA = 720;

// Áreas clicáveis, em px da arte de 1440x720
const botao = { x: 106, y: 572, w: 199, h: 50 };
const telefone = { x: 326, y: 578, w: 190, h: 40 };

// Converte uma área em px para % de um recorte da arte
function area(
  a: { x: number; y: number; w: number; h: number },
  recorte = { x: 0, y: 0, w: LARGURA, h: ALTURA },
): CSSProperties {
  return {
    left: `${((a.x - recorte.x) / recorte.w) * 100}%`,
    top: `${((a.y - recorte.y) / recorte.h) * 100}%`,
    width: `${(a.w / recorte.w) * 100}%`,
    height: `${(a.h / recorte.h) * 100}%`,
  };
}

// Mostra só um pedaço da arte (usado no celular), mantendo a proporção do pedaço
function estiloRecorte(recorte: { x: number; y: number; w: number; h: number }): CSSProperties {
  return {
    width: `${(LARGURA / recorte.w) * 100}%`,
    height: "auto",
    maxWidth: "none",
    left: `${(-recorte.x / recorte.w) * 100}%`,
    top: `${(-recorte.y / recorte.h) * 100}%`,
  };
}

// Celular: bloco de textos (esquerda da arte) e, abaixo, a foto com os hexágonos (direita)
const recorteTexto = { x: 92, y: 84, w: 468, h: 546 };
const recorteFoto = { x: 560, y: 0, w: 880, h: 720 };

const classeLink =
  "absolute rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function Hero() {
  return (
    <section className="relative bg-[#101010]">
      <h1 className="sr-only">Academia RiseFit</h1>
      <p className="sr-only">Uma equipe pronta para ajudar você a alcançar seus objetivos.</p>

      {/* ---------- Desktop: arte inteira ---------- */}
      <div className="relative mx-auto hidden aspect-[2/1] w-full max-w-[1920px] lg:block">
        <Image
          src="/design/hero-home.jpg"
          alt="Homem segurando halteres ao lado de hexágonos com fotos de academia"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <Link href="/#planos" aria-label="Comece já" className={classeLink} style={area(botao)} />
        <a
          href="tel:+5512997314825"
          aria-label="Ligar para (12) 99731-4825"
          className={classeLink}
          style={area(telefone)}
        />
      </div>

      {/* ---------- Celular e tablet: a arte em dois pedaços empilhados ---------- */}
      <div className="lg:hidden">
        <div
          className="relative mx-auto w-full max-w-[520px] overflow-hidden"
          style={{ aspectRatio: `${recorteTexto.w} / ${recorteTexto.h}` }}
        >
          <Image
            src="/design/hero-home.jpg"
            alt=""
            width={2880}
            height={1440}
            priority
            sizes="(max-width: 520px) 310vw, 1600px"
            className="absolute"
            style={estiloRecorte(recorteTexto)}
          />
          <Link
            href="/#planos"
            aria-label="Comece já"
            className={classeLink}
            style={area(botao, recorteTexto)}
          />
          <a
            href="tel:+5512997314825"
            aria-label="Ligar para (12) 99731-4825"
            className={classeLink}
            style={area(telefone, recorteTexto)}
          />
        </div>

        <div
          className="relative mx-auto w-full max-w-[880px] overflow-hidden"
          style={{ aspectRatio: `${recorteFoto.w} / ${recorteFoto.h}` }}
        >
          <Image
            src="/design/hero-home.jpg"
            alt="Homem segurando halteres ao lado de hexágonos com fotos de academia"
            width={2880}
            height={1440}
            sizes="(max-width: 880px) 165vw, 1440px"
            className="absolute"
            style={estiloRecorte(recorteFoto)}
          />
        </div>
      </div>
    </section>
  );
}
