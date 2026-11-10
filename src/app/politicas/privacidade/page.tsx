import PaginaPolitica from "@/components/PaginaPolitica";

export const metadata = {
  title: "Política de Privacidade | RiseFit",
};

// TEXTO-BASE: revise com um profissional jurídico (LGPD) antes de publicar.
export default function PoliticaPrivacidade() {
  return (
    <PaginaPolitica
      titulo="Política de Privacidade"
      descricao="Informações sobre como tratamos os dados e as informações da sua conta."
      introducao="Sua privacidade merece atenção. Esta política explica quais dados a RiseFit coleta, para que usamos e como você pode exercer seus direitos."
      secoes={[
        {
          titulo: "1. Sobre esta política",
          paragrafos: [
            "Esta política descreve como a RiseFit trata os dados pessoais de quem navega no site, cria uma conta, contrata um plano ou compra na loja. Ela segue a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).",
            "Ao usar nossos serviços, você declara ter lido estas informações. Se algo não estiver claro, fale com a gente pela página de contato.",
          ],
        },
        {
          titulo: "2. Informações do cadastro",
          paragrafos: [
            "No cadastro, pedimos nome, e-mail, data de nascimento, telefone, CPF, sexo e endereço (CEP, estado, cidade, bairro, rua, número e complemento).",
            "Para o pagamento, guardamos apenas um token, a bandeira e os quatro últimos dígitos do cartão. Os dados completos do cartão não ficam armazenados pela RiseFit.",
            "Mantenha seus dados corretos e atualizados: eles são necessários para identificar você e para prestar o serviço contratado.",
          ],
        },
        {
          titulo: "3. Uso das informações",
          paragrafos: [
            "Usamos seus dados para criar e administrar sua conta, processar a adesão ao plano e os pagamentos, entregar pedidos da loja, liberar o acesso à Área do Aluno e responder aos seus contatos.",
            "Também podemos usar os dados para cumprir obrigações legais e fiscais. Comunicações de marketing só são enviadas se você concordar, e você pode deixar de recebê-las quando quiser.",
          ],
        },
        {
          titulo: "4. Compartilhamento e proteção",
          paragrafos: [
            "Compartilhamos dados apenas com quem precisa deles para prestar o serviço, como operadoras de pagamento e transportadoras, ou quando a lei exigir. Não vendemos seus dados.",
            "Adotamos medidas técnicas e administrativas para proteger suas informações contra acessos não autorizados, perda ou uso indevido. Nenhum sistema é totalmente imune a riscos, mas trabalhamos para reduzi-los.",
          ],
        },
        {
          titulo: "5. Suas solicitações",
          paragrafos: [
            "Você pode pedir a confirmação de que tratamos seus dados, o acesso a eles, a correção de informações incorretas, a anonimização ou eliminação de dados desnecessários e a revogação de consentimentos dados.",
            "Para fazer uma solicitação, use a página de contato. Podemos pedir informações para confirmar sua identidade antes de atender o pedido.",
          ],
        },
        {
          titulo: "6. Guarda e atualização",
          paragrafos: [
            "Guardamos os dados pelo tempo necessário para cumprir as finalidades descritas aqui e as obrigações legais aplicáveis. Depois disso, eles são eliminados ou anonimizados.",
            "Podemos atualizar esta política quando houver mudanças nos nossos serviços ou na legislação. Sempre que isso acontecer, a versão nova ficará disponível nesta página.",
          ],
        },
      ]}
    />
  );
}
