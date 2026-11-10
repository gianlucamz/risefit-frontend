import PaginaPolitica from "@/components/PaginaPolitica";

export const metadata = {
  title: "Termos de uso e adesão | RiseFit",
};

// TEXTO-BASE: revise com um profissional jurídico antes de publicar.
// Confira principalmente prazos, regras de cancelamento e de troca/devolução.
export default function TermosDeUso() {
  return (
    <PaginaPolitica
      titulo="Termos de uso e adesão"
      descricao="Orientações de uso do site e da adesão aos nossos planos."
      secoes={[
        {
          titulo: "1. Uso do site e cadastro",
          paragrafos: [
            "O site da RiseFit apresenta informações sobre a academia, os profissionais, os planos e os produtos da loja. Para acessar áreas restritas, como a Área do Aluno, é preciso criar uma conta.",
            "Você se compromete a informar dados verdadeiros e atualizados, e a manter seu login e sua senha em sigilo. Você é responsável pelas atividades feitas com a sua conta.",
          ],
        },
        {
          titulo: "2. Planos e adesão",
          paragrafos: [
            "Oferecemos os planos Essencial, Personalizado e Premium. Preços, benefícios e condições de cada um são exibidos na página de Planos e devem ser conferidos no momento da contratação.",
            "A adesão só é concluída depois da confirmação do pagamento. Algumas funcionalidades, como o acompanhamento de profissionais, dependem do plano escolhido.",
          ],
        },
        {
          titulo: "3. Pagamentos e mudanças",
          paragrafos: [
            "A cobrança segue as condições apresentadas na contratação, incluindo a forma de pagamento escolhida (crédito ou débito).",
            "Mudanças de plano podem ser solicitadas pela nossa equipe e valem a partir da confirmação. Em caso de falha no pagamento, o acesso aos benefícios do plano pode ser suspenso até a regularização.",
          ],
        },
        {
          titulo: "4. Treinos e atendimento",
          paragrafos: [
            "A Área do Aluno permite consultar treinos e acompanhar seu progresso. As orientações dos treinos devem ser seguidas com o apoio dos profissionais da unidade, respeitando suas condições de saúde e limitações individuais.",
            "O atendimento com profissionais depende de agendamento e da disponibilidade. Em caso de dúvida ou desconforto durante o treino, interrompa a atividade e procure um profissional.",
          ],
        },
        {
          titulo: "5. Produtos da loja",
          paragrafos: [
            "Os produtos da loja são exibidos com preço e descrição. Valores, estoque e prazos de entrega podem mudar e devem ser conferidos antes de finalizar a compra.",
            "Trocas, devoluções e o direito de arrependimento seguem o Código de Defesa do Consumidor. Para pedir qualquer um deles, entre em contato com a nossa equipe.",
          ],
        },
        {
          titulo: "6. Cancelamento e contato",
          paragrafos: [
            "Consulte as condições do seu plano antes de solicitar o cancelamento. O pedido deve ser feito pela nossa equipe, e o encerramento passa a valer após a confirmação.",
            "Para dúvidas sobre estes termos, ou para solicitar cancelamento, fale com a gente pela página de contato.",
          ],
        },
      ]}
    />
  );
}
