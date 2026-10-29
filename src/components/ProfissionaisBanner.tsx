import Image from "next/image";
import Link from "next/link";

// O banner é uma imagem pronta (public/banner2.png, 2243x701).
// Os textos sobre a imagem são HTML; o título sr-only é para leitores de tela.
export default function ProfissionaisBanner() {
  return (
    <section className="bg-dark text-white">
      {/* Largura total da tela, sem bordas laterais.
          [container-type:inline-size] faz o texto escalar pela largura do banner (cqw). */}
      <div className="relative w-full [container-type:inline-size]">
        <h1 className="sr-only">Encontre seu personal</h1>

        {/* Mesma proporção da imagem: nada é cortado em nenhuma tela */}
        <div className="relative aspect-[2243/701] w-full">
          <Image
            src="/banner2.png"
            alt="Personal trainer auxiliando uma aluna em exercício com barra. Encontre seu personal: profissionais que te acompanham durante toda sua jornada. @risefitacademy"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Texto: no desktop fica sobre a parte escura da direita, centralizado na vertical.
            No celular fica abaixo da imagem, para não ficar minúsculo. */}
        <div className="px-5 py-6 md:absolute md:inset-y-0 md:left-[55%] md:right-[4%] md:flex md:flex-col md:justify-center md:p-0">
          <p
            aria-hidden="true"
            className="whitespace-nowrap text-left text-4xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-[4.6cqw]"
          >
            Encontre
            <br />
            seu personal
          </p>

          <p
            aria-hidden="true"
            className="ml-auto mt-3 text-right text-lg font-extrabold uppercase leading-none text-[#FFF8DC] md:mt-[1.6cqw] md:text-[2.2cqw]"
          >
            Profissionais que te
            <br />
            acompanham
            <br />
            durante toda sua
            <br />
            jornada.
          </p>
        </div>
      </div>
    </section>
  );
}