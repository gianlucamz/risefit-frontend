import PaginaPolitica from "@/components/PaginaPolitica";

export const metadata = {
  title: "Termos de uso e adesão | RiseFit",
};

// Texto preliminar (igual ao design): revise com um profissional jurídico antes de publicar.
export default function TermosDeUso() {
  return (
    <PaginaPolitica
      titulo="Termos de uso e adesão"
      descricao="Orientações de uso e pontos de atenção para a adesão aos serviços."
      secoes={[
        {
          titulo: "1. Uso do site e cadastro",
          paragrafos: [
            "O site reúne informações sobre a academia, profissionais, planos e produtos. Para acessar áreas reservadas, mantenha os dados do cadastro corretos e sua senha protegida. Identificação da parte responsável pelos serviços e requisitos de adesão: a validar.",
          ],
        },
        {
          titulo: "2. Planos e adesão",
          paragrafos: [
            "As opções apresentadas são Essencial, Personalizado e Premium. Preços, benefícios e condições devem ser conferidos no momento da escolha. O plano somente deve ser apresentado como ativo quando a confirmação aplicável estiver concluída. Regras contratuais específicas: a validar.",
          ],
        },
        {
          titulo: "3. Pagamentos e mudanças",
          paragrafos: [
            "Cobranças, renovação e alterações de plano devem seguir as condições informadas e aprovadas na adesão. Datas, meios de pagamento e eventuais ajustes precisam de confirmação. Esta versão não estabelece multa, carência, fidelidade ou regras de reembolso.",
          ],
        },
        {
          titulo: "4. Treinos e atendimento",
          paragrafos: [
            "A Área do Aluno permite consultar treinos e registros de acompanhamento. As orientações devem ser verificadas com o profissional responsável, considerando as necessidades individuais. Agendamentos dependem da confirmação da modalidade, da data e do horário, sem promessa de disponibilidade permanente.",
          ],
        },
        {
          titulo: "5. Produtos da loja",
          paragrafos: [
            "A compra de produtos é distinta da assinatura da academia. Confira itens, quantidades, endereço, frete e condições antes da conclusão. Prazos, entrega, troca e demais condições comerciais precisam de validação e apresentação clara no fluxo de compra.",
          ],
        },
        {
          titulo: "6. Cancelamento e contato",
          paragrafos: [
            "Consulte as condições do plano antes de solicitar cancelamento. O registro da solicitação não deve ser confundido com encerramento imediato. Datas, efeitos e procedimentos aplicáveis: a validar. Para orientações, acesse a página de atendimento e não compartilhe senhas ou dados bancários.",
          ],
        },
      ]}
    />
  );
}
