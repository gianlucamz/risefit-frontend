"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BotaoVoltar,
  LogoRiseFit,
  CampoFormulario,
  CampoSelect,
} from "@/components/CadastroComplementoForm";
import PaymentCardModal, { DadosCartao } from "@/components/PaymentCardModal";

export const MOCK_ENDERECO = {
  cep: "12090-010",
  estado: "SP",
  cidade: "Taubaté",
  bairro: "Centro",
  rua: "Rua Quatro de Março",
  numero: "243",
  complemento: "Sala 12",
  formaPagamento: "credito" as const,
  aceitouTermos: true,
};

const ESTADOS_BR = [
  { valor: "AC", rotulo: "Acre" },
  { valor: "AL", rotulo: "Alagoas" },
  { valor: "AP", rotulo: "Amapá" },
  { valor: "AM", rotulo: "Amazonas" },
  { valor: "BA", rotulo: "Bahia" },
  { valor: "CE", rotulo: "Ceará" },
  { valor: "DF", rotulo: "Distrito Federal" },
  { valor: "ES", rotulo: "Espírito Santo" },
  { valor: "GO", rotulo: "Goiás" },
  { valor: "MA", rotulo: "Maranhão" },
  { valor: "MT", rotulo: "Mato Grosso" },
  { valor: "MS", rotulo: "Mato Grosso do Sul" },
  { valor: "MG", rotulo: "Minas Gerais" },
  { valor: "PA", rotulo: "Pará" },
  { valor: "PB", rotulo: "Paraíba" },
  { valor: "PR", rotulo: "Paraná" },
  { valor: "PE", rotulo: "Pernambuco" },
  { valor: "PI", rotulo: "Piauí" },
  { valor: "RJ", rotulo: "Rio de Janeiro" },
  { valor: "RN", rotulo: "Rio Grande do Norte" },
  { valor: "RS", rotulo: "Rio Grande do Sul" },
  { valor: "RO", rotulo: "Rondônia" },
  { valor: "RR", rotulo: "Roraima" },
  { valor: "SC", rotulo: "Santa Catarina" },
  { valor: "SP", rotulo: "São Paulo" },
  { valor: "SE", rotulo: "Sergipe" },
  { valor: "TO", rotulo: "Tocantins" },
];

const CIDADES_POR_ESTADO: Record<string, { valor: string; rotulo: string }[]> =
  {
    SP: [
      { valor: "São Paulo", rotulo: "São Paulo" },
      { valor: "Campinas", rotulo: "Campinas" },
      { valor: "Santos", rotulo: "Santos" },
      { valor: "Taubaté", rotulo: "Taubaté" },
      { valor: "Caraguatatuba", rotulo: "Caraguatatuba" },
      { valor: "São José dos Campos", rotulo: "São José dos Campos" },
    ],
    RJ: [
      { valor: "Rio de Janeiro", rotulo: "Rio de Janeiro" },
      { valor: "Niterói", rotulo: "Niterói" },
      { valor: "Petrópolis", rotulo: "Petrópolis" },
    ],
    MG: [
      { valor: "Belo Horizonte", rotulo: "Belo Horizonte" },
      { valor: "Uberlândia", rotulo: "Uberlândia" },
      { valor: "Juiz de Fora", rotulo: "Juiz de Fora" },
    ],
  };

export function formatarCEP(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5, 8)}`;
}

function BandeirasCredito() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-6 w-9 rounded-sm bg-[#1a1f71] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white italic">VISA</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#eb001b] flex items-center justify-center">
        <div className="flex -space-x-1.5">
          <div className="h-3.5 w-3.5 rounded-full bg-[#eb001b] border border-white/30" />
          <div className="h-3.5 w-3.5 rounded-full bg-[#f79e1b] border border-white/30" />
        </div>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#f5a623] flex items-center justify-center">
        <span className="text-[7px] font-bold text-black">ELO</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#2e77bc] flex items-center justify-center">
        <span className="text-[6px] font-bold text-white">AMEX</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#822124] flex items-center justify-center">
        <span className="text-[6px] font-bold text-white">HIPER</span>
      </div>
    </div>
  );
}

function BandeirasDebito() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-6 w-9 rounded-sm bg-[#1a1f71] flex items-center justify-center">
        <span className="text-[8px] font-bold text-white italic">VISA</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#0099df] flex items-center justify-center">
        <span className="text-[6px] font-bold text-white">MAE</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#f5a623] flex items-center justify-center">
        <span className="text-[7px] font-bold text-black">ELO</span>
      </div>
      <div className="h-6 w-9 rounded-sm bg-[#eb001b] flex items-center justify-center">
        <div className="flex -space-x-1.5">
          <div className="h-3.5 w-3.5 rounded-full bg-[#eb001b] border border-white/30" />
          <div className="h-3.5 w-3.5 rounded-full bg-[#f79e1b] border border-white/30" />
        </div>
      </div>
    </div>
  );
}

function IconeShield() {
  return (
    <svg
      className="h-5 w-5 text-brand"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 15l-4-4 1.41-1.41L11 14.17l5.59-5.59L18 10l-7 7z" />
    </svg>
  );
}

interface CardPagamentoProps {
  tipo: "credito" | "debito";
  titulo: string;
  selecionado: boolean;
  aoSelecionar: () => void;
  children: React.ReactNode;
}

function CardPagamento({
  titulo,
  selecionado,
  aoSelecionar,
  children,
}: CardPagamentoProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selecionado}
      onClick={aoSelecionar}
      className={`w-full rounded-lg border-2 px-4 py-3.5 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        selecionado
          ? "border-brand bg-brand/5"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{titulo}</p>
          <div className="mt-1.5">{children}</div>
        </div>

        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selecionado ? "border-brand" : "border-gray-300"
          }`}
        >
          {selecionado && <div className="h-2.5 w-2.5 rounded-full bg-brand" />}
        </div>
      </div>
    </button>
  );
}

interface CheckboxTermosProps {
  marcado: boolean;
  aoMudar: (novo: boolean) => void;
  erro?: string;
}

function CheckboxTermos({ marcado, aoMudar, erro }: CheckboxTermosProps) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={marcado}
            onChange={(e) => aoMudar(e.target.checked)}
            className="peer sr-only"
            aria-describedby={erro ? "termos-erro" : undefined}
          />
          <div
            className={`flex h-4.5 w-4.5 items-center justify-center rounded border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 ${
              marcado
                ? "border-brand bg-brand"
                : erro
                  ? "border-red-500 bg-white"
                  : "border-gray-300 bg-white group-hover:border-gray-400"
            }`}
          >
            {marcado && (
              <svg
                className="h-3 w-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
        <span className="text-xs sm:text-[13px] leading-relaxed text-gray-600">
          Ao concluir o cadastro, você concorda com os nossos{" "}
          <Link
            href="/termos-de-adesao"
            className="font-semibold text-gray-900 underline underline-offset-2 hover:text-brand transition-colors"
          >
            termos de adesão
          </Link>
          , o que automaticamente ativará o seu plano e permitirá que você tenha
          acesso à plataforma RiseFit.
        </span>
      </label>
      {erro && (
        <p
          id="termos-erro"
          className="mt-1.5 ml-7.5 text-xs text-red-600 font-medium"
        >
          {erro}
        </p>
      )}
    </div>
  );
}

export interface CadastroEnderecoFormProps {
  mostrarBotaoMock?: boolean;
}

export default function CadastroEnderecoForm({
  mostrarBotaoMock = false,
}: CadastroEnderecoFormProps) {
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<
    "credito" | "debito" | ""
  >("");

  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const [dadosAnteriores] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const step1 = sessionStorage.getItem("risefit_cadastro_step1");
      const step2 = sessionStorage.getItem("risefit_cadastro_completo");
      return {
        ...(step1 ? JSON.parse(step1) : {}),
        ...(step2 ? JSON.parse(step2) : {}),
      };
    } catch {
      return {};
    }
  });

  const cidadesDoEstado = estado ? CIDADES_POR_ESTADO[estado] || [] : [];

  const handleEstadoChange = (novoEstado: string) => {
    setEstado(novoEstado);
    setCidade("");
    if (erros.estado) setErros((prev) => ({ ...prev, estado: "" }));
  };

  const preencherComMock = () => {
    setCep(MOCK_ENDERECO.cep);
    setEstado(MOCK_ENDERECO.estado);
    setCidade(MOCK_ENDERECO.cidade);
    setBairro(MOCK_ENDERECO.bairro);
    setRua(MOCK_ENDERECO.rua);
    setNumero(MOCK_ENDERECO.numero);
    setComplemento(MOCK_ENDERECO.complemento);
    setFormaPagamento(MOCK_ENDERECO.formaPagamento);
    setAceitouTermos(MOCK_ENDERECO.aceitouTermos);
    setErros({});
  };

  const limparCampos = () => {
    setCep("");
    setEstado("");
    setCidade("");
    setBairro("");
    setRua("");
    setNumero("");
    setComplemento("");
    setFormaPagamento("");
    setAceitouTermos(false);
    setErros({});
  };

  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};

    const cepLimpo = cep.replace(/\D/g, "");
    if (!cep.trim()) {
      novosErros.cep = "Por favor, informe seu CEP.";
    } else if (cepLimpo.length !== 8) {
      novosErros.cep = "Informe um CEP válido com 8 dígitos.";
    }

    if (!estado) {
      novosErros.estado = "Selecione seu estado.";
    }

    if (!cidade) {
      novosErros.cidade = "Selecione sua cidade.";
    }

    if (!bairro.trim()) {
      novosErros.bairro = "Por favor, informe seu bairro.";
    }

    if (!rua.trim()) {
      novosErros.rua = "Por favor, informe sua rua.";
    }

    if (!numero.trim()) {
      novosErros.numero = "Informe o número.";
    }

    if (!formaPagamento) {
      novosErros.formaPagamento = "Selecione uma forma de pagamento.";
    }

    if (!aceitouTermos) {
      novosErros.termos =
        "Você precisa aceitar os termos de adesão para continuar.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    setModalAberto(true);
  };

  const handleConfirmarModal = async (dadosCartao: DadosCartao) => {
    // <-- Tipado corretamente aqui
    setModalAberto(false);
    setCarregando(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const payloadFinal = {
        ...dadosAnteriores,
        cep: cep.trim(),
        estado,
        cidade,
        bairro: bairro.trim(),
        rua: rua.trim(),
        numero: numero.trim(),
        complemento: complemento.trim(),
        formaPagamento,
        dadosCartao,
      };

      try {
        sessionStorage.setItem(
          "risefit_cadastro_final",
          JSON.stringify(payloadFinal),
        );
      } catch {}
      console.log("Cadastro e pagamento finalizados:", payloadFinal);

      setSucesso(true);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full">
      {mostrarBotaoMock && (
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={preencherComMock}
            className="rounded border border-purple-200 bg-purple-50 px-2.5 py-1 font-medium text-brand hover:bg-purple-100 transition-colors cursor-pointer"
          >
            Preencher Mock
          </button>
          <button
            type="button"
            onClick={limparCampos}
            className="rounded border border-gray-200 bg-gray-50 px-2.5 py-1 font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Limpar
          </button>
        </div>
      )}

      <div className="relative mx-auto max-w-210">
        <div className="flex items-center justify-between sm:justify-center">
          <div className="sm:absolute sm:left-0 sm:top-0">
            <BotaoVoltar
              href="/cadastro/complemento"
              ariaLabel="Voltar para a etapa anterior"
            />
          </div>

          <h1 className="text-center text-xl font-bold tracking-tight text-[#0f172a] sm:text-2xl md:text-3xl lg:text-[32px] px-2 sm:px-14">
            Complete seu cadastro
          </h1>

          <div className="w-10 sm:hidden" aria-hidden="true" />
        </div>

        <div className="mt-5 sm:mt-6">
          <LogoRiseFit />
        </div>
      </div>

      <div className="mx-auto mt-5 sm:mt-6 max-w-160">
        {sucesso ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-green-900">
              Cadastro finalizado com sucesso!
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Parabéns{dadosAnteriores.nome ? `, ${dadosAnteriores.nome}` : ""}!
              Seu cadastro e pagamento foram efetuados. Seu plano será ativado
              em instantes.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#planos"
                className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#6d28d9] transition-colors"
              >
                Ver Planos
              </Link>
              <Link
                href="/area-aluno"
                className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Área do Aluno
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitForm} noValidate className="space-y-8">
            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Qual seu endereço de cobrança?
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <CampoFormulario
                    id="cep"
                    rotulo="CEP"
                    tipo="text"
                    valor={cep}
                    placeholder="00000-000"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    aoMudar={(v) => {
                      setCep(formatarCEP(v));
                      if (erros.cep) setErros((prev) => ({ ...prev, cep: "" }));
                    }}
                    erro={erros.cep}
                  />
                  <div className="mt-1.5 text-right">
                    <a
                      href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-medium text-[#6d28d9] hover:text-[#5b21b6] transition-colors hover:underline italic"
                    >
                      Não sei meu CEP
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <CampoSelect
                    id="estado"
                    rotulo="Estado"
                    valor={estado}
                    placeholder="Selecione seu estado"
                    opcoes={ESTADOS_BR}
                    aoMudar={handleEstadoChange}
                    erro={erros.estado}
                  />
                  <CampoSelect
                    id="cidade"
                    rotulo="Cidade"
                    valor={cidade}
                    placeholder="Selecione sua cidade"
                    opcoes={cidadesDoEstado}
                    aoMudar={(v) => {
                      setCidade(v);
                      if (erros.cidade)
                        setErros((prev) => ({ ...prev, cidade: "" }));
                    }}
                    erro={erros.cidade}
                  />
                </div>

                <CampoFormulario
                  id="bairro"
                  rotulo="Bairro"
                  tipo="text"
                  valor={bairro}
                  placeholder="Digite seu bairro"
                  autoComplete="address-level3"
                  aoMudar={(v) => {
                    setBairro(v);
                    if (erros.bairro)
                      setErros((prev) => ({ ...prev, bairro: "" }));
                  }}
                  erro={erros.bairro}
                />

                <CampoFormulario
                  id="rua"
                  rotulo="Rua"
                  tipo="text"
                  valor={rua}
                  placeholder="Digite seu endereço"
                  autoComplete="street-address"
                  aoMudar={(v) => {
                    setRua(v);
                    if (erros.rua) setErros((prev) => ({ ...prev, rua: "" }));
                  }}
                  erro={erros.rua}
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <CampoFormulario
                    id="numero"
                    rotulo="Número"
                    tipo="text"
                    valor={numero}
                    placeholder="Digite seu número"
                    autoComplete="address-line2"
                    inputMode="numeric"
                    aoMudar={(v) => {
                      setNumero(v);
                      if (erros.numero)
                        setErros((prev) => ({ ...prev, numero: "" }));
                    }}
                    erro={erros.numero}
                  />
                  <div className="w-full">
                    <label
                      htmlFor="complemento"
                      className="mb-1.5 block text-sm font-semibold text-gray-900"
                    >
                      Complemento{" "}
                      <span className="font-normal text-gray-400">
                        (opcional)
                      </span>
                    </label>
                    <input
                      id="complemento"
                      name="complemento"
                      type="text"
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                      placeholder="Digite seu complemento"
                      autoComplete="address-line3"
                      className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 placeholder:font-normal transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Qual sua forma de pagamento?
              </h2>

              <div className="mt-3 flex items-center gap-2">
                <IconeShield />
                <span className="text-sm font-semibold text-gray-900">
                  Compra 100% segura
                </span>
              </div>

              <div
                className="mt-4 space-y-3"
                role="radiogroup"
                aria-label="Forma de pagamento"
              >
                <CardPagamento
                  tipo="credito"
                  titulo="Cartão de Crédito"
                  selecionado={formaPagamento === "credito"}
                  aoSelecionar={() => {
                    setFormaPagamento("credito");
                    if (erros.formaPagamento)
                      setErros((prev) => ({ ...prev, formaPagamento: "" }));
                  }}
                >
                  <BandeirasCredito />
                </CardPagamento>

                <CardPagamento
                  tipo="debito"
                  titulo="Cartão de Débito"
                  selecionado={formaPagamento === "debito"}
                  aoSelecionar={() => {
                    setFormaPagamento("debito");
                    if (erros.formaPagamento)
                      setErros((prev) => ({ ...prev, formaPagamento: "" }));
                  }}
                >
                  <BandeirasDebito />
                </CardPagamento>
              </div>

              {erros.formaPagamento && (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  {erros.formaPagamento}
                </p>
              )}
            </section>

            <CheckboxTermos
              marcado={aceitouTermos}
              aoMudar={(v) => {
                setAceitouTermos(v);
                if (erros.termos) setErros((prev) => ({ ...prev, termos: "" }));
              }}
              erro={erros.termos}
            />

            <div className="pt-1">
              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-full bg-brand py-3.5 sm:py-4 px-6 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#6d28d9] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                {carregando ? (
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
                    Processando...
                  </span>
                ) : (
                  "Finalizar cadastro"
                )}
              </button>
            </div>
          </form>
        )}

        {formaPagamento && (
          <PaymentCardModal
            aberto={modalAberto}
            tipoCartao={formaPagamento}
            aoFechar={() => setModalAberto(false)}
            aoConfirmar={handleConfirmarModal}
          />
        )}
      </div>
    </div>
  );
}
