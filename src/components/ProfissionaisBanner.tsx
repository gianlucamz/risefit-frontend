import Image from "next/image";
import Link from "next/link";

// O banner é uma imagem pronta (public/banner.png, 1600x800).
// Os textos já fazem parte da imagem, então o título abaixo é só para leitores de tela.
export default function ProfissionaisBanner() {
  return (
    <section className="bg-dark text-white">
      {/* Ocupa a largura toda da tela. Em telas muito largas, corta só a parte de baixo
          (object-top) para o banner não ficar mais alto que a janela. */}
      <div className="relative aspect-[2/1] w-full min-[1700px]:aspect-[2.2/1]">
        <h1 className="sr-only">Encontre seu personal</h1>

        <Image
          src="/banner.png"
          alt="Personal trainer auxiliando uma aluna em exercício com barra. Encontre seu personal: profissionais que te acompanham durante toda sua jornada. @risefitacademy"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />

        {/* Botão sobre a imagem (a partir de telas médias), alinhado à direita,
            no espaço livre entre o subtítulo e o @RISEFITACADEMY */}
        <Link
          href="#profissionais"
          className="absolute right-[4.5%] top-[72%] hidden whitespace-nowrap rounded-full bg-brand px-[2.2vw] py-[0.65vw] text-[clamp(11px,1.15vw,20px)] font-semibold uppercase min-[1700px]:top-[79%] min-[1700px]:px-10 min-[1700px]:py-3 md:inline-block"
        >
          Agende sua consulta
        </Link>
      </div>

      {/* No celular o botão fica logo abaixo da imagem, para não ficar minúsculo */}
      <div className="flex justify-center px-6 py-6 md:hidden">
        <Link
          href="#profissionais"
          className="rounded-full bg-brand px-10 py-3 text-base font-semibold uppercase"
        >
          Agende sua consulta
        </Link>
      </div>
    </section>
  );
}