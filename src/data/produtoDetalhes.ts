// Conteúdo da página de produto (/loja/[id]) — DEMONSTRAÇÃO.
// Os textos usam só o que está no nome e no rótulo de cada produto; confira os dados reais
// (tabela nutricional, composição, garantia) com o fornecedor antes de publicar.

export type AvaliacaoProduto = {
  nome: string;
  nota: number;
  texto: string;
  util: number;
};

export type DetalhesProduto = {
  avaliacao: number;
  totalAvaliacoes: number;
  emEstoque: boolean;
  descricao: string[];
  // "Ficha técnica": blocos com título e linhas
  ficha: { titulo: string; itens: string[] }[];
  avaliacoes: AvaliacaoProduto[];
};

const detalhes: Record<number, DetalhesProduto> = {
  1: {
    avaliacao: 4.7,
    totalAvaliacoes: 312,
    emEstoque: true,
    descricao: [
      "A Coqueteleira Top Taste da Body Action tem capacidade de 600 ml e é ideal para preparar seu whey, hipercalórico ou outros suplementos em pó antes ou depois do treino.",
      "A tampa com rosca e o bico com fechamento ajudam a evitar vazamentos na mochila, e o tamanho é prático para levar para a academia, o trabalho ou a faculdade.",
      "Indicada para quem quer misturar o suplemento de forma rápida, sem empelotar, e manter a hidratação ao longo do dia.",
    ],
    ficha: [
      { titulo: "Características", itens: ["Marca: Body Action", "Linha: Top Taste", "Cor: Preta"] },
      { titulo: "Especificações", itens: ["Capacidade: 600 ml", "Tampa com rosca e bico com fechamento", "Uso: preparo de suplementos em pó e bebidas frias"] },
      { titulo: "Cuidados", itens: ["Lave antes do primeiro uso", "Não utilize com líquidos quentes", "Não leve ao micro-ondas"] },
      { titulo: "Conteúdo da embalagem", itens: ["1 coqueteleira"] },
    ],
    avaliacoes: [
      { nome: "Juliana Ramos", nota: 5, texto: "Não vaza nada na mochila e mistura o whey sem deixar grumos. Tamanho perfeito para o treino.", util: 0 },
      { nome: "Diego Ferreira", nota: 5, texto: "Boa qualidade pelo preço. A tampa fecha bem e é fácil de lavar.", util: 0 },
      { nome: "Marcos Vieira", nota: 4, texto: "Cumpre o que promete. Só achei a marcação de medida um pouco difícil de ler.", util: 0 },
      { nome: "Aline Costa", nota: 5, texto: "Comprei duas, uma para casa e outra para a academia. Recomendo.", util: 0 },
    ],
  },
  2: {
    avaliacao: 4.6,
    totalAvaliacoes: 528,
    emEstoque: true,
    descricao: [
      "A Camiseta Masculina Dry Fit é ultra leve e foi pensada para treinos de musculação, corrida e atividades ao ar livre.",
      "O tecido dry fit seca rápido e ajuda a afastar o suor da pele, mantendo a sensação de conforto durante todo o treino. O corte de manga curta garante liberdade de movimento.",
      "Uma peça versátil para usar na academia ou no dia a dia, combinando com qualquer short ou calça de treino.",
    ],
    ficha: [
      { titulo: "Características", itens: ["Modelo: masculino", "Manga: curta", "Cor: Preta", "Tamanho: M"] },
      { titulo: "Especificações", itens: ["Tecido: dry fit (secagem rápida)", "Toque leve e respirável", "Indicada para: musculação, corrida e treinos funcionais"] },
      { titulo: "Cuidados", itens: ["Lavar com água fria", "Não usar alvejante", "Não passar a ferro quente", "Secar à sombra"] },
      { titulo: "Conteúdo da embalagem", itens: ["1 camiseta"] },
    ],
    avaliacoes: [
      { nome: "Lucas Almeida", nota: 5, texto: "Muito leve e seca rápido. Uso para treinar todos os dias e não esquenta.", util: 0 },
      { nome: "Rafael Costa", nota: 5, texto: "O tamanho M serviu certinho. Tecido confortável e não marca o suor.", util: 0 },
      { nome: "Bruno Martins", nota: 4, texto: "Ótima para correr. Depois de várias lavagens continua com a mesma cor.", util: 0 },
      { nome: "Thiago Souza", nota: 5, texto: "Custo-benefício excelente. Já comprei mais duas cores.", util: 0 },
    ],
  },
  3: {
    avaliacao: 4.8,
    totalAvaliacoes: 925,
    emEstoque: true,
    descricao: [
      "O Kit 2x Whey Pro da Max Titanium reúne dois potes de 1 kg (2 kg no total) de suplemento alimentar proteico em pó, sabor chocolate, à base de whey protein concentrado.",
      "Prático para complementar a ingestão diária de proteínas, pode ser preparado com água ou leite na coqueteleira e consumido nos horários indicados pelo seu nutricionista.",
      "Indicado para quem treina e busca apoio na recuperação e na manutenção da massa muscular, aliado a uma alimentação equilibrada e à rotina de treinos.",
    ],
    ficha: [
      { titulo: "Características", itens: ["Marca: Max Titanium", "Produto: Whey Pro", "Sabor: Chocolate"] },
      { titulo: "Especificações", itens: ["Tipo: suplemento alimentar proteico em pó", "Proteína: whey protein concentrado", "Peso: 1 kg por pote (2 kg no total)", "Informação nutricional: consulte o rótulo"] },
      { titulo: "Modo de uso", itens: ["Siga as instruções da embalagem ou a orientação do seu nutricionista ou médico."] },
      { titulo: "Conteúdo da embalagem", itens: ["2 potes de Whey Pro 1 kg"] },
      { titulo: "Observação", itens: ["Este produto não substitui uma alimentação equilibrada e seu consumo deve ser orientado por nutricionista ou médico."] },
    ],
    avaliacoes: [
      { nome: "Lucas Almeida", nota: 5, texto: "Dissolve fácil e o sabor chocolate é muito bom. O kit com dois potes compensa bastante.", util: 0 },
      { nome: "Rafael Costa", nota: 5, texto: "Uso depois do treino há alguns meses. Não pesa no estômago e rende bem.", util: 0 },
      { nome: "Bruno Martins", nota: 5, texto: "Chegou bem embalado e dentro do prazo. Ótimo custo-benefício para whey concentrado.", util: 0 },
      { nome: "Camila Souza", nota: 4, texto: "Gostei do sabor, mas prefiro bater com leite para ficar mais cremoso.", util: 0 },
    ],
  },
  4: {
    avaliacao: 4.7,
    totalAvaliacoes: 486,
    emEstoque: true,
    descricao: [
      "A Creatina em Gummies da Growth Supplements traz 90 gomas de creatina sabor melancia, uma forma prática de incluir a creatina na rotina sem precisar de coqueteleira.",
      "Segundo o rótulo, a dose diária é de 3 gomas, o que torna o consumo fácil de levar na bolsa e de lembrar no dia a dia.",
      "Indicada para quem treina e quer praticidade, sempre aliada a uma alimentação equilibrada e à orientação de um profissional de saúde.",
    ],
    ficha: [
      { titulo: "Características", itens: ["Marca: Growth Supplements", "Linha: G-Gummy", "Sabor: Melancia"] },
      { titulo: "Especificações", itens: ["Tipo: suplemento alimentar em pastilha de goma de creatina", "Quantidade: 90 gomas", "Dose diária: 3 gomas (conforme o rótulo)", "Informação nutricional: consulte o rótulo"] },
      { titulo: "Modo de uso", itens: ["Siga as instruções da embalagem ou a orientação do seu nutricionista ou médico."] },
      { titulo: "Conteúdo da embalagem", itens: ["1 pote com 90 gomas"] },
      { titulo: "Observação", itens: ["Este produto não substitui uma alimentação equilibrada e seu consumo deve ser orientado por nutricionista ou médico."] },
    ],
    avaliacoes: [
      { nome: "Patrícia Alves", nota: 5, texto: "Muito mais prático que a creatina em pó. O sabor de melancia é gostoso e não é enjoativo.", util: 0 },
      { nome: "Gabriel Rocha", nota: 5, texto: "Levo na mochila e tomo depois do almoço. Facilitou manter a constância.", util: 0 },
      { nome: "Fernanda Lima", nota: 4, texto: "Gostei bastante, só achei o pote um pouco grande para carregar.", util: 0 },
      { nome: "André Nunes", nota: 5, texto: "As gomas chegaram inteiras e bem fechadas. Vou comprar de novo.", util: 0 },
    ],
  },
};

export function detalhesProduto(id: number): DetalhesProduto | undefined {
  return detalhes[id];
}
