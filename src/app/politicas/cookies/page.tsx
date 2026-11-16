import PaginaPolitica from "@/components/PaginaPolitica";

export const metadata = {
  title: "Política de Cookies | RiseFit",
};

// Texto preliminar (igual ao design): confirme a lista de tecnologias com quem mantém o site.
export default function PoliticaCookies() {
  return (
    <PaginaPolitica
      titulo="Política de Cookies"
      descricao="Entenda o uso de registros de navegação e os temas em revisão."
      secoes={[
        {
          titulo: "1. O que são cookies",
          paragrafos: [
            "Cookies são pequenos registros que um site pode armazenar no navegador para reconhecer informações de navegação. Tecnologias semelhantes também devem ser consideradas na revisão desta página.",
          ],
        },
        {
          titulo: "2. Categorias de uso",
          paragrafos: [
            "As categorias a revisar incluem recursos necessários ao funcionamento, preferências, medição de uso e comunicações ou publicidade, quando existentes. A presença de uma categoria nesta estrutura não significa que ela já seja utilizada pela RiseFit.",
          ],
        },
        {
          titulo: "3. Inventário a validar",
          paragrafos: [
            "Antes da publicação, é necessário confirmar quais tecnologias são utilizadas, seus nomes, suas finalidades, responsáveis e duração. Fornecedores e eventuais destinatários: a validar. Nenhuma ferramenta específica é confirmada nesta versão.",
          ],
        },
        {
          titulo: "4. Preferências de navegação",
          paragrafos: [
            "Você pode consultar as configurações do navegador para gerenciar o armazenamento de cookies. A restrição de recursos necessários pode afetar partes da navegação. Os controles específicos do site e o tratamento das escolhas devem ser validados antes de sua apresentação como disponíveis.",
          ],
        },
        {
          titulo: "5. Revisão e atendimento",
          paragrafos: [
            "As informações desta página devem acompanhar o inventário real de tecnologias do site. Versão, data de atualização e procedimentos de revisão: a validar. Para dúvidas, utilize a página de atendimento. Consulte também a Política de Privacidade preliminar.",
          ],
        },
      ]}
    />
  );
}
