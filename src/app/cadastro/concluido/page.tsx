"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { IconeCheck } from "@/components/PainelUI";
import {
  processarCheckoutAPI,
  criarAssinaturaAPI,
  obterPlanosAPI,
  type CheckoutPayload,
  type AssinaturaDetalhes,
} from "@/services/api";
import { salvarSessao } from "@/lib/sessao";

interface InfoPlano {
  id: number | string;
  slug: string;
  nome: string;
  preco: number;
  precoFormatado: string;
  descricao: string;
}

const PLANOS_INFO: Record<string, InfoPlano> = {
  essencial: {
    id: 1,
    slug: "essencial",
    nome: "Essencial",
    preco: 99.9,
    precoFormatado: "R$ 99,90/mês",
    descricao: "O plano ideal para quem está começando e quer cuidar da saúde.",
  },
  personalizado: {
    id: 2,
    slug: "personalizado",
    nome: "Personalizado",
    preco: 139.9,
    precoFormatado: "R$ 139,90/mês",
    descricao: "Acompanhamento mensal com suporte completo para seu treino.",
  },
  premium: {
    id: 3,
    slug: "premium",
    nome: "Premium",
    preco: 159.9,
    precoFormatado: "R$ 159,90/mês",
    descricao: "A experiência completa para quem busca o máximo de resultado.",
  },
};

function CadastroConcluidoConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [plano] = useState<InfoPlano>(() => {
    if (typeof window === "undefined") return PLANOS_INFO.personalizado;

    try {
      const pendenteRaw = sessionStorage.getItem("risefit_cadastro_pendente");
      const planoQuery = searchParams.get("plano");
      const planoStorage = sessionStorage.getItem("risefit_plano_escolhido");

      if (pendenteRaw) {
        const pendente = JSON.parse(pendenteRaw);
        if (pendente.planoNome && pendente.planoPrecoFormatado) {
          return {
            id: pendente.planoId || 2,
            slug: pendente.planoSlug || "personalizado",
            nome: pendente.planoNome,
            preco: pendente.planoPreco || 139.9,
            precoFormatado: pendente.planoPrecoFormatado,
            descricao:
              pendente.planoDescricao ||
              "Acompanhamento mensal com suporte completo para seu treino.",
          };
        }
      }

      const chave = (
        planoQuery ||
        planoStorage ||
        "personalizado"
      ).toLowerCase();
      if (PLANOS_INFO[chave]) {
        return PLANOS_INFO[chave];
      }
    } catch {}

    return PLANOS_INFO.personalizado;
  });

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const concluirCadastro = async (destino: string) => {
    if (salvando) return;
    setSalvando(true);
    setErro(null);

    try {
      const pendenteRaw = sessionStorage.getItem("risefit_cadastro_pendente");

      if (!pendenteRaw) {
        const usuarioSessao =
          localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
        if (usuarioSessao) {
          router.push(destino);
          return;
        }
        throw new Error(
          "Dados do cadastro não encontrados. Por favor, volte para a etapa anterior para preencher seus dados.",
        );
      }

      const pendente = JSON.parse(pendenteRaw);

      // 1. Processa checkout e cadastro atômico no backend
      const payloadCheckout: CheckoutPayload = {
        usuario: {
          nome: pendente.usuario?.nome || "",
          email: pendente.usuario?.email || "",
          senha: pendente.usuario?.senha || "RiseFit@123",
          dataNascimento: pendente.usuario?.dataNascimento || "2000-01-01",
          telefone: pendente.usuario?.telefone || "",
          cpf: pendente.usuario?.cpf || "",
          sexo: pendente.usuario?.sexo || "Não informado",
        },
        endereco: {
          cep: pendente.endereco?.cep || "",
          estado: pendente.endereco?.estado || "",
          cidade: pendente.endereco?.cidade || "",
          bairro: pendente.endereco?.bairro || "",
          rua: pendente.endereco?.rua || "",
          numero: pendente.endereco?.numero || "",
          complemento: pendente.endereco?.complemento || undefined,
        },
        formaPagamento: pendente.formaPagamento || "credito",
        pagamento: pendente.pagamento || {
          token: `tok_mock_${Date.now()}`,
          bandeira: "VISA",
          ultimosDigitos: "1234",
        },
      };

      const respostaCheckout = await processarCheckoutAPI(payloadCheckout);
      const resObj = (
        respostaCheckout && typeof respostaCheckout === "object"
          ? respostaCheckout
          : {}
      ) as Record<string, unknown>;

      const usuarioId =
        (resObj.usuarioId as number | string | undefined) ||
        pendente.usuario?.id;

      // 2. Registra a assinatura ativa do plano
      const idPlanoParaAssinar = pendente.planoId || plano.id;
      let planoIdFinal = Number(idPlanoParaAssinar);

      try {
        const planosApi = await obterPlanosAPI();
        if (Array.isArray(planosApi) && planosApi.length > 0) {
          const slug = (pendente.planoSlug || plano.slug || "").toLowerCase();
          const nome = (pendente.planoNome || plano.nome || "").toLowerCase();
          const encontrado =
            planosApi.find((p) => p.id === planoIdFinal) ||
            planosApi.find(
              (p) =>
                p.nome.toLowerCase().includes(slug) ||
                p.nome.toLowerCase().includes(nome),
            );
          if (encontrado) {
            planoIdFinal = encontrado.id;
          } else {
            const idx =
              slug === "essencial" ? 0 : slug === "personalizado" ? 1 : 2;
            planoIdFinal = (planosApi[idx] || planosApi[0]).id;
          }
        }
      } catch {
        // Usa planoIdFinal direto se a listagem falhar
      }

      let assinaturaCriada: AssinaturaDetalhes | null = null;
      if (usuarioId && planoIdFinal) {
        try {
          assinaturaCriada = await criarAssinaturaAPI({
            usuarioId: Number(usuarioId),
            planoId: Number(planoIdFinal),
            status: "ATIVA",
          });
        } catch (errAssinatura) {
          console.warn("Aviso ao vincular assinatura ativa:", errAssinatura);
        }
      }

      // 3. Salva sessão autenticada no navegador com os dados do plano e assinatura
      const dadosPlano = {
        id: planoIdFinal,
        nome: pendente.planoNome || plano.nome,
        descricao: pendente.planoDescricao || plano.descricao,
        preco: pendente.planoPreco || plano.preco,
        duracaoMeses: 1,
      };

      const dadosAssinatura = {
        id: assinaturaCriada?.id || 1,
        usuarioId: Number(usuarioId),
        planoId: planoIdFinal,
        dataInicio: new Date().toISOString(),
        dataFim: null,
        status: "ATIVA",
        plano: dadosPlano,
      };

      salvarSessao(
        {
          id: usuarioId,
          nome: pendente.usuario?.nome || "",
          email: pendente.usuario?.email || "",
          cpf: pendente.usuario?.cpf || "",
          cargo: "ALUNO",
          assinaturas: [dadosAssinatura],
          plano: dadosPlano,
        },
        undefined,
        true,
      );

      // 4. Limpa dados temporários de rascunho do sessionStorage
      try {
        sessionStorage.removeItem("risefit_cadastro_pendente");
        sessionStorage.removeItem("risefit_cadastro_step1");
        sessionStorage.removeItem("risefit_cadastro_completo");
        sessionStorage.removeItem("risefit_cadastro_final");
        sessionStorage.removeItem("risefit_plano_escolhido");
      } catch {}

      // 5. Redireciona para o destino solicitado
      router.push(destino);
    } catch (err: unknown) {
      const mensagem =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao concluir o seu cadastro. Tente novamente.";
      setErro(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f8f8f9] px-4 pt-8 pb-16 sm:px-6 lg:pt-12 lg:pb-24">
      <div className="mx-auto max-w-xl">
        {/* Link de retorno no topo esquerdo do container central */}
        <div className="text-left mb-6">
          <Link
            href={`/cadastro/endereco?plano=${encodeURIComponent(plano.slug)}`}
            className="inline-flex items-center text-sm font-semibold text-brand hover:underline transition-colors"
          >
            ← Assinatura
          </Link>
        </div>

        {/* Cabeçalho centralizado */}
        <header className="flex flex-col items-center text-center">
          <div className="mb-4 text-brand">
            <IconeCheck className="h-10 w-10 text-brand" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl lg:text-[32px]">
            Tudo certo com seu cadastro!
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base max-w-md">
            Seu pagamento foi aprovado e seu plano está ativo. Clique abaixo
            para concluir e acessar a Área do Aluno.
          </p>
        </header>

        {/* Card branco centralizado (Resumo do plano) */}
        <div className="mt-8 rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs text-left">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] mb-5">
            Resumo do plano
          </h2>

          <dl className="space-y-3.5">
            <div className="flex items-center justify-between text-sm sm:text-base">
              <dt className="text-gray-500">Plano</dt>
              <dd className="font-bold text-[#0f172a]">{plano.nome}</dd>
            </div>

            <div className="flex items-center justify-between text-sm sm:text-base">
              <dt className="text-gray-500">Mensalidade</dt>
              <dd className="font-bold text-[#0f172a]">
                {plano.precoFormatado}
              </dd>
            </div>

            <div className="flex items-center justify-between text-sm sm:text-base">
              <dt className="text-gray-500">Situação</dt>
              <dd className="font-bold text-[#0f172a]">Ativo</dd>
            </div>
          </dl>

          <div className="my-5 border-t border-gray-100" />

          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            {plano.descricao}
          </p>

          <dl className="mt-4">
            <div className="flex items-center justify-between text-sm sm:text-base">
              <dt className="text-gray-500">Próxima cobrança</dt>
              <dd className="font-bold text-[#0f172a]">A confirmar</dd>
            </div>
          </dl>
        </div>

        {/* Mensagem de erro amigável se a API falhar */}
        {erro && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        {/* Ações abaixo do card */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => concluirCadastro("/area-aluno")}
            disabled={salvando}
            className="w-full cursor-pointer rounded-lg bg-brand py-3.5 px-6 text-center text-base font-bold text-white shadow-sm transition-all duration-150 hover:bg-[#6d28d9] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {salvando ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Concluindo cadastro...
              </span>
            ) : (
              "Acessar Área do Aluno"
            )}
          </button>

          <div className="text-left pt-1">
            <button
              type="button"
              onClick={() => concluirCadastro("/minha-conta")}
              disabled={salvando}
              className="inline-block cursor-pointer text-sm font-semibold text-brand hover:underline disabled:opacity-50 transition-colors"
            >
              Ver minha conta
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CadastroConcluidoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f8f9]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      }
    >
      <CadastroConcluidoConteudo />
    </Suspense>
  );
}
