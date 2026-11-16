"use client";

import Link from "next/link";
import { useUsuarioLogado } from "@/lib/sessao";

// Mostra o conteúdo só para quem NÃO está logado (ex.: "Faça seu login", "Inscreva-se").
export default function SomenteVisitante({ children }: { children: React.ReactNode }) {
  const usuario = useUsuarioLogado();
  return usuario ? null : <>{children}</>;
}

// Link de "Assinar plano": visitante vai para o cadastro; aluno logado vai para "Alterar meu plano".
export function LinkAssinarPlano({
  plano,
  className,
  children,
}: {
  plano: string;
  className?: string;
  children: React.ReactNode;
}) {
  const usuario = useUsuarioLogado();
  const href = usuario ? "/minha-conta/plano" : `/cadastro?plano=${plano}`;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
