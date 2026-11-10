import PaginaPolitica from "@/components/PaginaPolitica";

export const metadata = {
  title: "Política de Cookies | RiseFit",
};

// TEXTO-BASE: confirme a lista de tecnologias com quem mantém o site
// (e atualize se forem adicionados analytics, anúncios ou outros serviços).
export default function PoliticaCookies() {
  return (
    <PaginaPolitica
      titulo="Política de Cookies"
      descricao="Entenda o uso de registros de navegação no nosso site."
      secoes={[
        {
          titulo: "1. O que são cookies",
          paragrafos: [
            "Cookies são pequenos arquivos que um site pode armazenar no seu navegador para lembrar informações da sua navegação. Tecnologias semelhantes, como o armazenamento local do navegador, também entram nesta política.",
          ],
        },
        {
          titulo: "2. Categorias de uso",
          paragrafos: [
            "Podemos usar registros necessários ao funcionamento do site, de preferências (para lembrar escolhas suas), de desempenho e, se forem adotados, de comunicação ou publicidade.",
            "Os registros necessários não dependem do seu consentimento, pois sem eles o site não funciona corretamente.",
          ],
        },
        {
          titulo: "3. Inventário a validar",
          paragrafos: [
            "Hoje o site usa o armazenamento do navegador para manter o seu nome na barra superior depois do login e para guardar temporariamente os dados do cadastro enquanto você o preenche.",
            "Se novas tecnologias forem adicionadas, como ferramentas de medição de audiência, esta lista será atualizada com a finalidade de cada uma.",
          ],
        },
        {
          titulo: "4. Preferências de navegação",
          paragrafos: [
            "Você pode consultar as configurações do seu navegador para gerenciar ou apagar cookies e dados de sites. Bloquear os registros necessários pode afetar partes do site, como o login e o cadastro.",
          ],
        },
        {
          titulo: "5. Revisão e atendimento",
          paragrafos: [
            "Esta política pode ser atualizada quando houver mudanças nas tecnologias usadas pelo site. Consulte também a Política de Privacidade para saber como tratamos seus dados.",
            "Se tiver dúvidas, fale com a gente pela página de contato.",
          ],
        },
      ]}
    />
  );
}
