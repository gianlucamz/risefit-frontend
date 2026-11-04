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
};

