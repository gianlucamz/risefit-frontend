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
  },
];
