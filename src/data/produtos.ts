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
  // Caminho da imagem em /public (ex.: "/design/produto-whey.png").
  // Sem imagem, o card mostra um ícone no lugar.
  imagem?: string;
  // Variação exibida no carrinho (ex.: "600 ml • Preta").
  detalhe?: string;
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
    detalhe: "600 ml • Preta",
    imagem: "/design/produto-coqueteleira.png",
  },
  {
    id: 2,
    nome: "Camiseta Masculina Dry Fit Camisa Ultra Leve Manga Curta",
    preco: 29.9,
    categoria: "roupas",
    detalhe: "Tamanho M • Preta",
    imagem: "/design/produto-camiseta.png",
  },
  {
    id: 3,
    nome: "Kit 2x Whey Pro 1kg (2kg Total) — Whey Protein Concentrado Max Titanium",
    preco: 192.06,
    categoria: "suplementos",
    detalhe: "2 potes de 1kg • Chocolate",
    imagem: "/design/produto-whey.png",
  },
  {
    id: 4,
    nome: "Creatina Em Gummies Growth Supplements 90 Gomas Gummy Melancia",
    preco: 109.9,
    categoria: "suplementos",
    detalhe: "90 gomas • Melancia",
    imagem: "/design/produto-creatina.png",
  },
];
 
// Ids exibidos em cada seção da página
export const maisVendidosIds = [1, 2, 3, 4];
export const novidadesIds = [1, 2, 3, 4];

export function produtoPorId(id: number) {
  return produtos.find((p) => p.id === id);
}
