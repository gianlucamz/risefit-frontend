import PaginaPolitica from "@/components/PaginaPolitica";

export const metadata = {
  title: "Política de Privacidade | RiseFit",
};

// Texto preliminar (igual ao design): revise com um profissional jurídico (LGPD) antes de publicar.
export default function PoliticaPrivacidade() {
  return (
    <PaginaPolitica
      titulo="Política de Privacidade"
      descricao="Informações sobre o uso dos dados e os caminhos para solicitar orientação."
      introducao="Sua privacidade merece atenção. O conteúdo abaixo organiza os temas que devem ser revisados antes da publicação da política da RiseFit; não representa uma política aprovada."
      secoes={[
        {
          titulo: "1. Sobre esta política",
          paragrafos: [
            "Esta página apresenta, para revisão, como as informações de quem usa o site e a Área do Aluno devem ser tratadas. Identificação do responsável pelo tratamento, razão social e demais dados institucionais: a validar antes da publicação.",
          ],
        },
        {
          titulo: "2. Informações do cadastro",
          paragrafos: [
            "O cadastro pode incluir nome, CPF, e-mail, telefone e endereço informado no fluxo de adesão. Registros de treino e solicitações de atendimento também podem fazer parte da experiência. O inventário de dados efetivamente utilizados deve ser validado.",
          ],
        },
        {
          titulo: "3. Uso das informações",
          paragrafos: [
            "As informações do cadastro servem à identificação, à administração da conta e à comunicação sobre os serviços solicitados. As finalidades detalhadas e os fundamentos aplicáveis a cada tratamento precisam de revisão jurídica. Comunicações de marketing devem ser tratadas separadamente das comunicações de serviço.",
          ],
        },
        {
          titulo: "4. Compartilhamento e proteção",
          paragrafos: [
            "A lista de destinatários, prestadores envolvidos e as responsabilidades de cada parte ainda devem ser confirmadas. Não informe senhas ou dados de cartão em mensagens de atendimento. Medidas técnicas e administrativas de proteção: a validar com os responsáveis pelo serviço.",
          ],
        },
        {
          titulo: "5. Suas solicitações",
          paragrafos: [
            "Para orientação sobre acesso, correção ou outras solicitações relacionadas a seus dados, utilize a página de atendimento. O canal específico de privacidade e a identificação de eventual responsável devem ser validados antes da publicação. Não inclua dados sensíveis desnecessários na mensagem.",
          ],
        },
        {
          titulo: "6. Guarda e atualização",
          paragrafos: [
            "Os critérios de guarda, eliminação e revisão dos dados dependem das finalidades e das obrigações aplicáveis. Prazos e procedimentos: a validar. Alterações nesta política deverão ser identificadas por versão e data após aprovação do conteúdo.",
          ],
        },
      ]}
    />
  );
}
