// Dados de DEMONSTRAÇÃO da Área do Aluno e de Minha conta (iguais ao layout).
// Troque pelos dados reais da API quando o backend estiver pronto.

export const alunoDemo = {
  nome: "Ana Beatriz Silva",
  cpfMascarado: "***.***.***-**",
  email: "ana.silva@exemplo.com",
  telefoneMascarado: "(11) 9****-****",
};

export type PlanoId = "essencial" | "personalizado" | "premium";

export const planosConta: {
  id: PlanoId;
  nome: string;
  preco: number;
  descricao: string;
}[] = [
  {
    id: "essencial",
    nome: "Essencial",
    preco: 99.9,
    descricao: "Orientação básica e acesso ao treino do dia.",
  },
  {
    id: "personalizado",
    nome: "Personalizado",
    preco: 139.9,
    descricao: "Acompanhamento mensal com suporte completo para seu treino.",
  },
  {
    id: "premium",
    nome: "Premium",
    preco: 159.9,
    descricao: "Mais apoio profissional e benefícios para acompanhamento contínuo.",
  },
];

export const assinaturaDemo = {
  planoId: "personalizado" as PlanoId,
  situacao: "Ativo",
  proximaCobranca: "12 de novembro de 2026",
  metodo: "Cartão de crédito",
};

export function planoPorId(id: PlanoId) {
  return planosConta.find((p) => p.id === id)!;
}

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarMoeda(valor: number) {
  return moeda.format(valor);
}

/* ---------- Treinos ---------- */

export type Exercicio = {
  nome: string;
  series: number;
  repeticoes: string;
  comoExecutar: string;
};

export type Treino = {
  id: string;
  titulo: string;
  grupo: string;
  foco: string;
  dataCurta: string;
  dataLonga: string;
  diaSemana: string;
  status: "nao-iniciado" | "concluido";
  duracaoMin?: number;
  exercicios: Exercicio[];
};

const exerciciosSuperior: Exercicio[] = [
  {
    nome: "Barra fixa",
    series: 3,
    repeticoes: "8 a 12",
    comoExecutar:
      "Segure a barra com as mãos afastadas na largura indicada pelo profissional. Mantenha o tronco estável e puxe o corpo de forma controlada. Retorne sem soltar o peso do corpo de uma vez.",
  },
  {
    nome: "Remada curvada",
    series: 3,
    repeticoes: "8 a 12",
    comoExecutar:
      "Incline o tronco à frente com a coluna neutra e os joelhos levemente flexionados. Puxe a barra em direção ao abdômen, aproximando as escápulas, e retorne devagar.",
  },
  {
    nome: "Puxada alta",
    series: 3,
    repeticoes: "8 a 12",
    comoExecutar:
      "Sente-se com as coxas apoiadas e segure a barra com pegada aberta. Puxe até a altura do peito, mantendo o tronco firme, e retorne controlando o movimento.",
  },
  {
    nome: "Rosca direta",
    series: 3,
    repeticoes: "8 a 12",
    comoExecutar:
      "Em pé, com os cotovelos junto ao corpo, flexione os braços levando a barra até a altura dos ombros. Desça de forma controlada, sem balançar o tronco.",
  },
  {
    nome: "Rosca alternada",
    series: 3,
    repeticoes: "8 a 12",
    comoExecutar:
      "Com um halter em cada mão, flexione um braço por vez girando o punho durante a subida. Mantenha os cotovelos fixos e alterne os lados a cada repetição.",
  },
];

const exerciciosInferior: Exercicio[] = [
  {
    nome: "Agachamento livre",
    series: 4,
    repeticoes: "8 a 10",
    comoExecutar:
      "Pés na largura dos ombros, desça como se fosse sentar mantendo o peito aberto e os joelhos alinhados com os pés. Suba empurrando o chão.",
  },
  {
    nome: "Leg press",
    series: 3,
    repeticoes: "10 a 12",
    comoExecutar:
      "Apoie os pés na plataforma e desça até formar cerca de 90° nos joelhos. Empurre sem travar totalmente as articulações.",
  },
  {
    nome: "Cadeira extensora",
    series: 3,
    repeticoes: "12 a 15",
    comoExecutar:
      "Ajuste o apoio na altura do tornozelo e estenda as pernas de forma controlada, segurando um instante no topo.",
  },
  {
    nome: "Mesa flexora",
    series: 3,
    repeticoes: "10 a 12",
    comoExecutar:
      "Deitado de bruços, flexione os joelhos trazendo o apoio em direção aos glúteos sem tirar o quadril do banco.",
  },
];

export const treinos: Treino[] = [
  {
    id: "hoje",
    titulo: "Treino de Superior",
    grupo: "Superior",
    foco: "Costas e Bíceps",
    dataCurta: "02/11/2026",
    dataLonga: "02 de novembro de 2026",
    diaSemana: "Segunda-feira",
    status: "nao-iniciado",
    exercicios: exerciciosSuperior,
  },
  {
    id: "2026-10-30",
    titulo: "Treino de Superior",
    grupo: "Superior",
    foco: "Costas e Bíceps",
    dataCurta: "30/10/2026",
    dataLonga: "30 de outubro de 2026",
    diaSemana: "Sexta-feira",
    status: "concluido",
    duracaoMin: 45,
    exercicios: exerciciosSuperior,
  },
  {
    id: "2026-10-28",
    titulo: "Treino de Inferior",
    grupo: "Inferior",
    foco: "Pernas e Glúteos",
    dataCurta: "28/10/2026",
    dataLonga: "28 de outubro de 2026",
    diaSemana: "Quarta-feira",
    status: "concluido",
    duracaoMin: 40,
    exercicios: exerciciosInferior,
  },
  {
    id: "2026-10-26",
    titulo: "Treino de Superior",
    grupo: "Superior",
    foco: "Costas e Bíceps",
    dataCurta: "26/10/2026",
    dataLonga: "26 de outubro de 2026",
    diaSemana: "Segunda-feira",
    status: "concluido",
    duracaoMin: 45,
    exercicios: exerciciosSuperior,
  },
];

export const treinoDoDia = treinos[0];
export const treinosAnteriores = treinos.filter((t) => t.status === "concluido");

export function treinoPorId(id: string) {
  return treinos.find((t) => t.id === id);
}

export function formatarDuracao(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${h}h ${String(m).padStart(2, "0")}min`;
}

export const resumoSemana = {
  concluidos: 0,
  meta: 5,
  periodo: "02 a 08 de novembro",
  tempoMin: 0,
  calorias: "0 kcal",
  peso: "Não informado",
};

export const evolucaoSemanal = [
  { rotulo: "26/10 a 01/11", treinos: 3 },
  { rotulo: "02/11 a 08/11", treinos: 0 },
];

/* ---------- Segurança ---------- */

export const sessaoAtual = {
  dispositivo: "Computador • Chrome",
  inicio: "02/11/2026 • 09:42",
};

export const historicoAcessos = [
  { data: "02/11/2026 • 09:42", dispositivo: "Computador • Chrome", status: "Sessão atual" },
  { data: "30/10/2026 • 18:10", dispositivo: "Computador • Chrome", status: "Encerrada" },
  { data: "28/10/2026 • 08:25", dispositivo: "Computador • Chrome", status: "Encerrada" },
];
