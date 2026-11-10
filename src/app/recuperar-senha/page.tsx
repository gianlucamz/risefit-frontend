import { AcessoLayout } from "@/components/AcessoUI";
import RecuperarSenhaForm from "@/components/RecuperarSenhaForm";

export const metadata = {
  title: "Recuperar senha | RiseFit",
};

export default function RecuperarSenha() {
  return (
    <AcessoLayout>
      <RecuperarSenhaForm />
    </AcessoLayout>
  );
}
