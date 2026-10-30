import Image from "next/image";
import Link from "next/link";

// Colunas de links do rodapé. Para mudar links, é só editar aqui.
const colunas = [
  {
    titulo: "NAVEGAÇÃO",
    links: [
      { texto: "Home", href: "/" },
      { texto: "Planos", href: "/#planos" },
      { texto: "Profissionais", href: "/profissionais" },
      { texto: "Loja", href: "/loja" },
      { texto: "Sobre nós", href: "/sobre-nos" },
    ],
  },
  {
    titulo: "ATENDIMENTO",
    links: [
      { texto: "Central de ajuda", href: "#" },
      { texto: "Contato", href: "#" },
      { texto: "Trabalhe conosco", href: "#" },
      { texto: "Perguntas frequentes", href: "#" },
    ],
  },
  {
    titulo: "MINHA CONTA",
    links: [
      { texto: "Área do Aluno", href: "/area-aluno" },
      { texto: "Meus planos", href: "#" },
      { texto: "Meus treinos", href: "#" },
    ],
  },
  {
    titulo: "POLÍTICAS",
    links: [
      { texto: "Política de privacidade", href: "#" },
      { texto: "Termos de uso", href: "#" },
      { texto: "Política de cookies", href: "#" },
    ],
  },
];

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto max-w-360 px-6 py-12 lg:px-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* Logo + endereço */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Ícone RiseFit"
                width={64}
                height={36}
                className="h-auto w-16"
              />
              <span className="text-4xl font-extrabold italic">
                Rise<span className="text-brand">Fit</span>
              </span>
            </Link>

            <address className="mt-4 text-sm not-italic leading-relaxed tracking-tight text-white">
              Avenida Acre, 243 - Indaiá, Caraguatatuba - SP
              <br />
              06:00 às 22:00 - Segunda a Sábado, horário de Brasília
            </address>
          </div>

          {/* Colunas de links */}
          {colunas.map((coluna) => (
            <div key={coluna.titulo}>
              <h3 className="text-md font-semibold tracking-widest text-gray-400">
                {coluna.titulo}
              </h3>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
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

        {/* Linha de baixo: copyright + redes sociais */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">
            © {ano} RiseFit. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-5">
            {/* Instagram */}
            <a href="#" aria-label="Instagram">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <path d="M17.5 6.5h.01" />
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" aria-label="YouTube">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3z" />
              </svg>
            </a>

            {/* Facebook */}
            <a href="#" aria-label="Facebook">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
