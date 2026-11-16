export type ObjetivoId =
  | "musculo"
  | "emagrecer"
  | "condicionamento"
  | "lesao"
  | "alimentacao";

export type Profissional = {
  id: string;
  nome: string;
  avaliacao: number;
  avaliacoes: number;
  descricao: string;
  especialidades: string[];
  objetivos: ObjetivoId[];
  foto: string;
  // Enquadramento da foto no cartão (CSS object-position), igual ao design
  fotoPosicao?: string;
  perfil: PerfilProfissional;
};

// Conteúdo da página de perfil (/profissionais/[id])
export type PerfilProfissional = {
  cargo: string;
  // Na página: "Sobre a profissional" / "Sobre o profissional"
  artigo: "a" | "o";
  avaliacoes: number;
  resumo: string;
  sobre: string;
  especialidades: string[];
  formacao: string[];
  local: string;
  online: boolean;
  horario: string;
  depoimentos: { nome: string; nota: number; texto: string }[];
};

export const objetivos: { id: ObjetivoId; rotulo: string[] }[] = [
  { id: "musculo", rotulo: ["Ganhar massa", "muscular"] },
  { id: "emagrecer", rotulo: ["Emagrecer"] },
  { id: "condicionamento", rotulo: ["Melhorar o", "condicionamento"] },
  { id: "lesao", rotulo: ["Recuperar de lesão"] },
  { id: "alimentacao", rotulo: ["Melhorar minha", "alimentação"] },
];

// Profissionais de DEMONSTRAÇÃO (não são cadastros reais), com os textos do design.
// Troque pelos dados reais quando houver.
const descricaoPadrao =
  "Especialista em hipertrofia e condicionamento físico. Foco em desenvolvimento real e consistente.";

export const profissionais: Profissional[] = [
  {
    id: "lucas-andrade",
    nome: "Lucas Andrade",
    avaliacao: 4.8,
    avaliacoes: 48,
    descricao: descricaoPadrao,
    especialidades: ["Hipertrofia", "Condicionamento", "Força"],
    objetivos: ["musculo", "condicionamento"],
    foto: "/design/prof-lucas.jpg",
    fotoPosicao: "50% 50%",
    perfil: {
      cargo: "Personal trainer",
      artigo: "o",
      avaliacoes: 48,
      resumo: "Hipertrofia e condicionamento físico",
      sobre:
        "Acredito que constância vale mais do que intensidade. Meu foco é montar treinos progressivos, com técnica segura e metas realistas, sempre com acompanhamento próximo e humanizado.",
      especialidades: ["Hipertrofia", "Condicionamento físico", "Treino de força"],
      formacao: ["Educação Física - CREF 123456-G/SP", "Pós-graduação em Fisiologia do Exercício"],
      local: "Atendimento no Brasil",
      online: true,
      horario: "Segunda a sexta • 7h às 20h",
      depoimentos: [
        {
          nome: "Bruno Lima",
          nota: 5,
          texto: "O Lucas ajustou meu treino à minha rotina e em poucos meses já senti a diferença. Muito atencioso!",
        },
      ],
    },
  },
  {
    id: "mariana-costa",
    nome: "Mariana Costa",
    avaliacao: 4.8,
    avaliacoes: 48,
    descricao: descricaoPadrao,
    especialidades: ["Nutrição esportiva", "Emagrecimento", "Saúde"],
    objetivos: ["emagrecer", "alimentacao"],
    foto: "/design/prof-mariana.jpg",
    fotoPosicao: "50% 26%",
    perfil: {
      cargo: "Nutricionista",
      artigo: "a",
      avaliacoes: 57,
      resumo: "Nutrição esportiva e comportamental",
      sobre:
        "Acredito que a alimentação é uma das principais aliadas para alcançar seus objetivos. Meu foco é criar planos personalizados, com base nas suas necessidades, rotina e preferências, sempre com acompanhamento próximo e humanizado.",
      especialidades: ["Nutrição esportiva", "Emagrecimento", "Saúde e bem-estar"],
      formacao: ["Nutricionista - CRN 12345", "Pós-graduação em Nutrição Esportiva"],
      local: "Atendimento no Brasil",
      online: true,
      horario: "Segunda a sexta • 7h às 20h",
      depoimentos: [
        {
          nome: "Camila Souza",
          nota: 5,
          texto: "A Mari é incrível! Me ajudou muito na reeducação alimentar e me sinto muito melhor. Super atenciosa e profissional!",
        },
      ],
    },
  },
  {
    id: "rafael-oliveira",
    nome: "Rafael Oliveira",
    avaliacao: 4.8,
    avaliacoes: 48,
    descricao: descricaoPadrao,
    especialidades: ["Reabilitação", "Dor muscular", "Mobilidade"],
    objetivos: ["lesao", "condicionamento"],
    foto: "/design/prof-rafael.jpg",
    fotoPosicao: "50% 0%",
    perfil: {
      cargo: "Fisioterapeuta",
      artigo: "o",
      avaliacoes: 48,
      resumo: "Reabilitação e mobilidade",
      sobre:
        "Acredito que se movimentar sem dor é o primeiro passo para qualquer objetivo. Meu foco é a recuperação de lesões e o ganho de mobilidade, com exercícios adaptados e acompanhamento próximo e humanizado.",
      especialidades: ["Reabilitação", "Dor muscular", "Mobilidade"],
      formacao: ["Fisioterapia - CREFITO 3/123456-F", "Especialização em Fisioterapia Esportiva"],
      local: "Atendimento no Brasil",
      online: false,
      horario: "Segunda a sexta • 7h às 20h",
      depoimentos: [
        {
          nome: "Patrícia Alves",
          nota: 5,
          texto: "Voltei a treinar sem dor no joelho graças ao Rafael. Explica tudo com paciência e cuidado.",
        },
      ],
    },
  },
];

export function profissionalPorId(id: string) {
  return profissionais.find((p) => p.id === id);
}
