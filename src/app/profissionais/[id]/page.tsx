import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  mapearProfissionalAPI,
  obterProfissionalPorIdAPI,
} from "@/services/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/profissionais/[id]">): Promise<Metadata> {
  const { id } = await params;
  try {
    const dados = await obterProfissionalPorIdAPI(id);
    const profissional = dados ? mapearProfissionalAPI(dados) : null;
    return {
      title: profissional
        ? `${profissional.nome} | RiseFit`
        : "Profissional | RiseFit",
    };
  } catch {
    return { title: "Profissional | RiseFit" };
  }
}

// Página de perfil do profissional. Medidas do modelo (1440px): faixa escura de 188px,
// cartão de 1268px, foto 354x264, coluna lateral de 331px.
export default async function PerfilProfissionalPage({
  params,
}: PageProps<"/profissionais/[id]">) {
  const { id } = await params;
  const dados = await obterProfissionalPorIdAPI(id).catch(() => null);
  const profissional = dados ? mapearProfissionalAPI(dados) : null;
  if (!profissional) notFound();

  const { perfil } = profissional;
  const contato = "/contato#contato";
  const tratamento = perfil.artigo === "a" ? "a profissional" : "o profissional";
  const iniciais = profissional.nome
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("");

  return (
    <main className="relative bg-[#f7f8fa] pb-12 lg:pb-12.5">
      {/* Faixa escura atrás do topo do cartão */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-47 bg-[#26283c]" />

      <div className="relative mx-auto max-w-360 px-5 lg:px-0">
        <Link
          href="/profissionais"
          className="inline-flex items-center gap-4 pt-5 text-sm font-semibold text-white hover:text-[#c4b5fd] lg:ml-11.75 lg:gap-5 lg:pt-10.5 lg:text-[12.5px]"
        >
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 7H1M7 1 1 7l6 6" />
          </svg>
          Voltar para profissionais
        </Link>

        <article className="mx-auto mt-6 max-w-317 overflow-hidden rounded-xl border border-[#e3e7ec] bg-white lg:mt-10.5">
          {/* ---------- Topo: foto, dados e especialidades ---------- */}
          <div className="grid gap-6 p-5 lg:grid-cols-[354px_1fr_331px] lg:gap-0 lg:pt-11.5 lg:pr-11 lg:pb-10 lg:pl-16.25">
            <div className="relative aspect-[354/264] w-full overflow-hidden rounded-2xl bg-dark lg:h-66 lg:w-88.5">
              {profissional.foto ? (
                <Image
                  src={profissional.foto}
                  alt={`Foto de ${profissional.nome}`}
                  fill
                  priority
                  unoptimized={profissional.foto.startsWith("data:")}
                  sizes="(min-width: 1024px) 354px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: profissional.fotoPosicao ?? "50% 50%" }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-6xl text-brand">
                  {iniciais}
                </div>
              )}
            </div>

            <div className="lg:pt-6 lg:pl-9">
              <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
                <h1 className="text-[28px] leading-tight font-bold text-dark lg:text-[31px]">
                  {profissional.nome}
                </h1>
                <span className="rounded-full bg-[#efe9fe] px-3 py-1 text-xs font-semibold text-brand">
                  {perfil.cargo}
                </span>
              </div>

              <p className="mt-6 text-base text-gray-700">{perfil.resumo}</p>

              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-gray-600">
                <li className="flex items-center gap-2.5">
                  <svg width="12" height="15" viewBox="0 0 12 16" fill="currentColor" className="text-brand" aria-hidden="true">
                    <path d="M6 0a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6zm0 8.2A2.2 2.2 0 1 1 6 3.8a2.2 2.2 0 0 1 0 4.4z" />
                  </svg>
                  {perfil.local}
                </li>
                {perfil.online && (
                  <li className="flex items-center gap-2.5">
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand" aria-hidden="true">
                      <rect x="1" y="1" width="14" height="9" rx="1" />
                      <path d="M5 13h6M8 10v3M6 4.5l2 1.5-2 1.5" />
                    </svg>
                    Atendimento online
                  </li>
                )}
              </ul>

              <Link
                href={contato}
                className="mt-7 flex h-11 w-full items-center justify-center gap-3.5 rounded-md bg-brand text-[15px] font-semibold text-white transition-colors hover:bg-[#6d28d9] lg:w-72"
              >
                <IconeConversa />
                Entrar em contato
              </Link>
            </div>

            <aside className="rounded-xl border border-[#e3e7ec] py-5 pr-3 pl-4.5">
              <h2 className="flex items-center gap-3.5 text-[17px] font-bold text-dark">
                <svg width="23" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3.5 13.5a8.5 8.5 0 1 1 16.4 3.1M7 18.5a8.5 8.5 0 0 0 9.8.7" />
                  <path d="M8.5 13c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5M12 9.5V6.5M6.3 8.3l2 2M17.7 8.3l-2 2" />
                </svg>
                Especialidades
              </h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-10.5 text-[14px] tracking-[-0.01em] text-gray-700 marker:text-dark">
                {perfil.especialidades.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <hr className="my-5 border-[#e3e7ec]" />

              <h2 className="flex items-center gap-3.5 text-[17px] font-bold text-dark">
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m12 1.5 10.5 5L12 11.5 1.5 6.5z" />
                  <path d="M5.5 8.5v5c1.5 1.7 4 2.7 6.5 2.7s5-1 6.5-2.7v-5M22.5 6.5v6" />
                </svg>
                Formação
              </h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-10.5 text-[14px] tracking-[-0.01em] text-gray-700 marker:text-dark">
                {perfil.formacao.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>

          {/* ---------- Base: sobre e atendimento ---------- */}
          <div className="grid border-t border-[#e3e7ec] lg:grid-cols-[1fr_387px]">
            <section className="border-b border-[#e3e7ec] p-5 lg:border-r lg:border-b-0 lg:pt-9 lg:pr-8 lg:pb-9 lg:pl-8">
              <h2 className="text-[17px] font-bold text-dark">Sobre {tratamento}</h2>
              <p className="mt-5 text-sm leading-5 text-gray-700">{perfil.sobre}</p>
              <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-4 text-[11px] leading-3.5 font-semibold text-dark lg:mt-16 lg:flex-nowrap lg:gap-x-6">
                <li className="flex items-center gap-3.5">
                  <svg width="28" height="25" viewBox="0 0 28 25" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-brand" aria-hidden="true">
                    <path d="M14 23.5S1.5 16 1.5 7.8A6.3 6.3 0 0 1 14 5a6.3 6.3 0 0 1 12.5 2.8C26.5 16 14 23.5 14 23.5z" />
                  </svg>
                  <span>Atendimento<br />humanizado</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <svg width="24" height="28" viewBox="0 0 24 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="shrink-0 text-brand" aria-hidden="true">
                    <rect x="1.5" y="3" width="18" height="23.5" rx="2" />
                    <path d="M6 10h10M6 15h10M6 20h7M21 1.5v4M19 3.5h4" />
                  </svg>
                  <span>Planos<br />personalizados</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <svg width="30" height="26" viewBox="0 0 30 26" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-brand" aria-hidden="true">
                    <circle cx="7" cy="5.5" r="4" />
                    <circle cx="20" cy="5.5" r="4" />
                    <path d="M1 20c0-4 2.7-7 6-7s6 3 6 7" />
                    <rect x="15" y="13" width="14" height="10" rx="3" />
                    <path d="M18.5 18h7" />
                  </svg>
                  <span>Acompanhamento<br />contínuo</span>
                </li>
              </ul>
            </section>

            <section className="m-3 rounded-xl bg-[#f4effe] p-4 lg:m-3 lg:mt-3 lg:mb-3 lg:px-4 lg:pt-6 lg:pb-3">
              <div className="flex items-start gap-5">
                <svg width="30" height="32" viewBox="0 0 30 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 shrink-0 text-brand" aria-hidden="true">
                  <rect x="1.5" y="4.5" width="27" height="26" rx="3" />
                  <path d="M1.5 11.5h27M9 1.5v6M21 1.5v6" />
                  <path d="M8 17h2M14 17h2M20 17h2M8 23h2M14 23h2M20 23h2" strokeWidth="2.6" />
                </svg>
                <div>
                  <h2 className="text-[17px] font-bold text-dark">Atendimento</h2>
                  <p className="mt-1 text-[11px] text-gray-700">
                    Escolha a melhor forma de cuidar de você
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-1">
                <LinhaAtendimento
                  href={contato}
                  icone={
                    <svg width="14" height="18" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
                      <path d="M6 0a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6zm0 8.2A2.2 2.2 0 1 1 6 3.8a2.2 2.2 0 0 1 0 4.4z" />
                    </svg>
                  }
                  titulo="Presencial"
                  detalhe={perfil.local}
                />
                {perfil.online && (
                  <LinhaAtendimento
                    href={contato}
                    icone={
                      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                        <rect x="1" y="1.5" width="15" height="13" rx="2" />
                        <path d="m16 6.5 7-4v11l-7-4z" />
                      </svg>
                    }
                    titulo="Online"
                    detalhe="Consulta por videochamada"
                  />
                )}
                <LinhaAtendimento
                  href={contato}
                  icone={
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="9.5" />
                      <path d="M11 5.5V11l3.5 2" />
                    </svg>
                  }
                  titulo="Horários de atendimento"
                  detalhe={perfil.horario}
                />
              </ul>

              <Link
                href={contato}
                className="mt-4 flex h-10.5 items-center justify-center gap-3 rounded-md bg-brand text-[12.5px] font-semibold text-white transition-colors hover:bg-[#6d28d9]"
              >
                <IconeConversa />
                Falar com {tratamento}
              </Link>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}

function LinhaAtendimento({
  href,
  icone,
  titulo,
  detalhe,
}: {
  href: string;
  icone: React.ReactNode;
  titulo: string;
  detalhe: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-4 rounded-lg px-2.5 py-2.5 lg:gap-6 transition-colors hover:bg-[#fbf9ff]"
      >
        <span className="flex w-6 shrink-0 justify-center text-brand">{icone}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold text-dark">{titulo}</span>
          <span className="block text-[11px] text-gray-600">{detalhe}</span>
        </span>
        <svg width="7" height="11" viewBox="0 0 7 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-brand" aria-hidden="true">
          <path d="m1.5 1.5 4 4-4 4" />
        </svg>
      </Link>
    </li>
  );
}

function IconeConversa() {
  return (
    <svg width="20" height="19" viewBox="0 0 20 19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 1h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-5 4v-4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
      <path d="M6 6h8M6 9.5h5" />
    </svg>
  );
}
