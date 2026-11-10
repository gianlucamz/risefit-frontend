export type CategoriaId =
  | "roupas"
  | "suplementos"
  | "acessorios"
  | "calcados"
  | "bolsas";
 
export type Produto = {
  id: number;
  nome: string;
  preco: number;
  categoria: CategoriaId;
  // Caminho da imagem em /public (ex.: "/loja/coqueteleira.png").
  // Sem imagem, o card mostra um ícone no lugar.
  imagem?: string;
};
 
export const categorias: { id: CategoriaId; rotulo: string }[] = [
  { id: "roupas", rotulo: "Roupas" },
  { id: "suplementos", rotulo: "Suplementos" },
  { id: "acessorios", rotulo: "Acessórios" },
  { id: "calcados", rotulo: "Calçados" },
  { id: "bolsas", rotulo: "Bolsas e mochilas" },
];
 
// Produtos de DEMONSTRAÇÃO (iguais ao layout). Troque pelos dados reais da API (/products) quando houver.
export const produtos: Produto[] = [
  {
    id: 1,
    nome: "Coqueteleira 3 Whey Top Taste - 600Ml Preta - Body Action",
    preco: 21.07,
    categoria: "acessorios",
  },
  {
    id: 2,
    nome: "Camiseta Masculina Dry Fit Camisa Ultra Leve Manga Curta",
    preco: 29.9,
    categoria: "roupas",
  },
  {
    id: 3,
    nome: "Kit 2x Whey Pro 1kg (2kg Total) — Whey Protein Concentrado Max Titanium",
    preco: 192.06,
    categoria: "suplementos",
  },
  {
    id: 4,
    nome: "Creatina Em Gummies Growth Supplements 90 Gomas Gummy Melancia",
    preco: 109.9,
    categoria: "suplementos",
  },
];
 
// Ids exibidos em cada seção da página
export const maisVendidosIds = [1, 2, 3, 4];
export const novidadesIds = [1, 2, 3, 4];