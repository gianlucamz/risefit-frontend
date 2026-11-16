// Perfil de TESTE para navegar logado enquanto o backend não está pronto.
// Funciona só no ambiente de desenvolvimento (npm run dev) ou quando a variável
// NEXT_PUBLIC_PERFIL_TESTE=true estiver definida. Em produção o login vai direto para a API.
//
//   E-mail: ana.silva@exemplo.com
//   Senha:  RiseFit123

export const perfilTeste = {
  email: "ana.silva@exemplo.com",
  senha: "RiseFit123",
  usuario: {
    id: "teste-ana-beatriz",
    nome: "Ana Beatriz Silva",
    email: "ana.silva@exemplo.com",
    perfilDeTeste: true,
  },
};

export const perfilTesteAtivo =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_PERFIL_TESTE === "true";
