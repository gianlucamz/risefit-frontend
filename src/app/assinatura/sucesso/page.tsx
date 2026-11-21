import { redirect } from "next/navigation";

export const metadata = { title: "Cadastro concluído | RiseFit" };

export default async function AssinaturaSucessoPage({
  searchParams,
}: {
  searchParams?: Promise<{ plano?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const planoQuery = params?.plano
    ? `?plano=${encodeURIComponent(params.plano)}`
    : "";
  redirect(`/cadastro/concluido${planoQuery}`);
}
