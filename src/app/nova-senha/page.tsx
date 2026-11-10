import { AcessoLayout } from "@/components/AcessoUI";
import NovaSenhaForm from "@/components/NovaSenhaForm";

export const metadata = {
  title: "Nova senha | RiseFit",
};

export default async function NovaSenha({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  const tokenValor = Array.isArray(token) ? token[0] : token;

  return (
    <AcessoLayout>
      <NovaSenhaForm token={tokenValor} />
    </AcessoLayout>
  );
}
