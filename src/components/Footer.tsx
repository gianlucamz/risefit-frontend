import Image from "next/image";
import Link from "next/link";

// Colunas de links do rodapé (mesma ordem do layout). Para mudar links, é só editar aqui.
const colunas = [
  {
    titulo: "NAVEGAÇÃO",
    links: [
      { texto: "Home", href: "/" },
      { texto: "Planos", href: "/#planos" },
      { texto: "Profissionais", href: "/profissionais" },
      { texto: "Sobre nós", href: "/#sobre-nos" },
      { texto: "Loja", href: "/loja" },
    ],
  },
  {
    titulo: "ATENDIMENTO",
    links: [
      { texto: "Central de ajuda", href: "/contato#central-de-ajuda" },
      { texto: "Contato", href: "/contato#contato" },
      { texto: "Trabalhe conosco", href: "/contato#trabalhe-conosco" },
      { texto: "Perguntas frequentes", href: "/contato#faq" },
    ],
  },
  {
    titulo: "MINHA CONTA",
    links: [
      { texto: "Área do Aluno", href: "/area-aluno" },
      { texto: "Meus planos", href: "/minha-conta" },
      { texto: "Loja RiseFit", href: "/loja" },
      { texto: "Inscreva-se", href: "/cadastro" },
    ],
  },
  {
    titulo: "POLÍTICAS",
    links: [
      { texto: "Política de privacidade", href: "/politicas/privacidade" },
      { texto: "Termos de uso", href: "/politicas/termos-de-uso" },
      { texto: "Política de Cookies", href: "/politicas/cookies" },
    ],
  },
];

// Medidas tiradas do layout (1440px): altura 227px, colunas em x = 474 / 670 / 859 / 1047.
export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0c11] text-white">
      <div className="relative mx-auto max-w-360 px-6 pt-8 pb-8 lg:grid lg:min-h-44 lg:grid-cols-[423px_196px_189px_188px_1fr] lg:px-0 lg:pt-6 lg:pb-0 lg:pl-12.75">
        {/* Logo + endereço */}
        <div className="lg:pt-2.25">
          <Link href="/" aria-label="RiseFit - página inicial" className="inline-block">
            <Image
              src="/design/logo-risefit.png"
              alt="RiseFit"
              width={229}
              height={76}
              className="h-auto w-44 lg:w-57.25"
            />
          </Link>
          <address className="mt-2 text-xs leading-5 not-italic lg:text-[11px] lg:leading-4.25">
            <span className="flex items-center gap-1.5">
              <svg width="11" height="14" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true" className="shrink-0">
                <path d="M6 0a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6zm0 8.2A2.2 2.2 0 1 1 6 3.8a2.2 2.2 0 0 1 0 4.4z" />
              </svg>
              Avenida Acre, 243 – Indaiá, Caraguatatuba – SP
            </span>
            <span className="block">08:00 às 20:00 - Segunda a Sexta, horário de Brasília</span>
          </address>
        </div>

        {/* Colunas de links */}
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:contents">
          {colunas.map((coluna) => (
            <div key={coluna.titulo}>
              <h3 className="text-sm leading-5">{coluna.titulo}</h3>
              <ul className="mt-2.5 flex flex-col gap-3 text-[13px] leading-4 lg:gap-1.75 lg:text-[11px] lg:leading-3.5">
                {coluna.links.map((link) => (
                  <li key={link.texto}>
                    <Link href={link.href} className="hover:text-brand">
                      {link.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Redes sociais */}
        <div className="mt-8 flex items-center gap-4.5 lg:absolute lg:right-10.25 lg:bottom-4.5 lg:mt-0">
          <a href="#" aria-label="Instagram" className="hover:text-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z" />
            </svg>
          </a>
          <a href="#" aria-label="TikTok" className="hover:text-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16.6 0h-4v16.3a3.4 3.4 0 1 1-3.4-3.4c.3 0 .7 0 1 .1V8.9a7.5 7.5 0 1 0 6.4 7.4V8a9.5 9.5 0 0 0 5.6 1.8V5.8A5.6 5.6 0 0 1 16.6 0z" />
            </svg>
          </a>
          <a href="#" aria-label="YouTube" className="hover:text-brand">
            <svg width="24" height="17" viewBox="0 0 24 17" fill="currentColor" aria-hidden="true">
              <path d="M23.5 2.7A3 3 0 0 0 21.4.5C19.5 0 12 0 12 0S4.5 0 2.6.5A3 3 0 0 0 .5 2.7C0 4.5 0 8.5 0 8.5s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-4-.5-5.8zM9.6 12.1V4.9l6.2 3.6-6.2 3.6z" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Linha de baixo: copyright */}
      <div className="border-t border-white/40">
        <p className="flex h-12.75 items-center px-5 text-[11px]">
          © {ano} RiseFit. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
