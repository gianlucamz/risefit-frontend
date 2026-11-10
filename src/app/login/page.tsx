import { AcessoLayout } from "@/components/AcessoUI";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Entrar | RiseFit",
};

export default function Login() {
  return (
    <AcessoLayout alinhamento="centro">
      <LoginForm />
    </AcessoLayout>
  );
}
