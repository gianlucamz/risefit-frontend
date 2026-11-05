"use client";

import { useState } from "react";
import {
  CampoFormulario,
  CampoSelect,
} from "@/components/CadastroComplementoForm";

export const MOCK_DADOS_CARTAO = {
  nomeCartao: "GIANLUCA M ZOCARATO",
  banco: "nubank",
  numeroCartao: "4532 1123 9876 5432",
  validade: "11/28",
  cvv: "888",
  nomeTitular: "Gianluca Moreno Zocarato",
  tipoDocumento: "CPF",
  documento: "456.789.012-34",
};

export function formatarNumeroCartao(valor: string): string {
  const v = valor.replace(/\D/g, "").slice(0, 16);
  return v.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatarValidade(valor: string): string {
  const v = valor.replace(/\D/g, "").slice(0, 4);
  if (v.length <= 2) return v;
  return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
}

export function formatarCPF(valor: string): string {
  const v = valor.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 3) return v;
  if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
  if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
  return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9, 11)}`;
}

export function formatarCNPJ(valor: string): string {
  const v = valor.replace(/\D/g, "").slice(0, 14);
  if (v.length <= 2) return v;
  if (v.length <= 5) return `${v.slice(0, 2)}.${v.slice(2)}`;
  if (v.length <= 8) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5)}`;
  if (v.length <= 12)
    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8)}`;
  return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(
    8,
    12,
  )}-${v.slice(12, 14)}`;
}

function BandeirasCartao() {
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

const OPCOES_BANCOS = [
  { valor: "itau", rotulo: "Itaú Unibanco" },
  { valor: "bradesco", rotulo: "Bradesco" },
  { valor: "santander", rotulo: "Santander" },
  { valor: "bb", rotulo: "Banco do Brasil" },
  { valor: "caixa", rotulo: "Caixa Econômica" },
  { valor: "nubank", rotulo: "Nubank" },
  { valor: "inter", rotulo: "Banco Inter" },
];

const OPCOES_DOCUMENTO = [
  { valor: "CPF", rotulo: "CPF" },
  { valor: "CNPJ", rotulo: "CNPJ" },
];

export interface DadosCartao {
  nomeCartao: string;
  banco: string;
  numeroCartao: string;
  validade: string;
  cvv: string;
  nomeTitular: string;
  tipoDocumento: string;
  documento: string;
}

export interface PaymentCardModalProps {
  aberto: boolean;
  tipoCartao: "credito" | "debito";
  aoFechar: () => void;
  aoConfirmar: (dadosCartao: DadosCartao) => void;
  mostrarBotaoMock?: boolean;
}

export default function PaymentCardModal({
  aberto,
  tipoCartao,
  aoFechar,
  aoConfirmar,
  mostrarBotaoMock = true,
}: PaymentCardModalProps) {
  const [nomeCartao, setNomeCartao] = useState("");
  const [banco, setBanco] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("CPF");
  const [documento, setDocumento] = useState("");
  const [erros, setErros] = useState<Record<string, string>>({});

  if (!aberto) return null;

  const tituloModal =
    tipoCartao === "credito" ? "Cartão de Crédito" : "Cartão de Débito";

  const placeholderDocumento =
    tipoDocumento === "CPF" ? "000.000.000-00" : "00.000.000/0001-00";

  const preencherComMock = () => {
    setNomeCartao(MOCK_DADOS_CARTAO.nomeCartao);
    setBanco(MOCK_DADOS_CARTAO.banco);
    setNumeroCartao(MOCK_DADOS_CARTAO.numeroCartao);
    setValidade(MOCK_DADOS_CARTAO.validade);
    setCvv(MOCK_DADOS_CARTAO.cvv);
    setNomeTitular(MOCK_DADOS_CARTAO.nomeTitular);
    setTipoDocumento(MOCK_DADOS_CARTAO.tipoDocumento);
    setDocumento(MOCK_DADOS_CARTAO.documento);
    setErros({});
  };

  const limparCampos = () => {
    setNomeCartao("");
    setBanco("");
    setNumeroCartao("");
    setValidade("");
    setCvv("");
    setNomeTitular("");
    setTipoDocumento("CPF");
    setDocumento("");
    setErros({});
  };

  const validar = (): boolean => {
    const nErros: Record<string, string> = {};

    if (!nomeCartao.trim()) nErros.nomeCartao = "Informe o nome no cartão.";
    if (!banco) nErros.banco = "Selecione o banco.";
    if (numeroCartao.replace(/\s/g, "").length < 13)
      nErros.numeroCartao = "Número de cartão inválido.";
    if (validade.length < 5) nErros.validade = "Validade inválida (MM/YY).";
    if (cvv.length < 3) nErros.cvv = "CVV inválido.";
    if (!nomeTitular.trim()) nErros.nomeTitular = "Informe o nome do titular.";
    if (!documento.trim()) nErros.documento = "Informe o documento.";

    setErros(nErros);
    return Object.keys(nErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    aoConfirmar({
      nomeCartao,
      banco,
      numeroCartao,
      validade,
      cvv,
      nomeTitular,
      tipoDocumento,
      documento,
    });
  };

  const handleTipoDocumentoChange = (novoTipo: string) => {
    setTipoDocumento(novoTipo);
    setDocumento("");
    if (erros.documento) setErros((p) => ({ ...p, documento: "" }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl transition-all duration-200">
        {mostrarBotaoMock && (
          <div className="mb-3 flex items-center justify-end gap-2 text-xs">
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

        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{tituloModal}</h2>
            <div className="mt-2">
              <BandeirasCartao />
            </div>
          </div>

          <button
            type="button"
            onClick={aoFechar}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-brand hover:text-brand hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
          {/* Seção Informações do Cartão */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Informações do Cartão
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CampoFormulario
                  id="nomeCartao"
                  rotulo="Nome no cartão"
                  tipo="text"
                  valor={nomeCartao}
                  placeholder="Nome no cartão"
                  aoMudar={(v) => {
                    setNomeCartao(v);
                    if (erros.nomeCartao)
                      setErros((p) => ({ ...p, nomeCartao: "" }));
                  }}
                  erro={erros.nomeCartao}
                />
                <CampoSelect
                  id="banco"
                  rotulo="Selecione o Banco"
                  valor={banco}
                  placeholder="Selecione o banco"
                  opcoes={OPCOES_BANCOS}
                  aoMudar={(v) => {
                    setBanco(v);
                    if (erros.banco) setErros((p) => ({ ...p, banco: "" }));
                  }}
                  erro={erros.banco}
                />
              </div>

              <div>
                <CampoFormulario
                  id="numeroCartao"
                  rotulo="Número do Cartão"
                  tipo="text"
                  valor={numeroCartao}
                  placeholder="1234 1234 1234 1234"
                  inputMode="numeric"
                  aoMudar={(v) => {
                    setNumeroCartao(formatarNumeroCartao(v));
                    if (erros.numeroCartao)
                      setErros((p) => ({ ...p, numeroCartao: "" }));
                  }}
                  erro={erros.numeroCartao}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CampoFormulario
                  id="validade"
                  rotulo="Validade"
                  tipo="text"
                  valor={validade}
                  placeholder="MM / YY"
                  inputMode="numeric"
                  aoMudar={(v) => {
                    setValidade(formatarValidade(v));
                    if (erros.validade)
                      setErros((p) => ({ ...p, validade: "" }));
                  }}
                  erro={erros.validade}
                />
                <CampoFormulario
                  id="cvv"
                  rotulo="CVV"
                  tipo="text"
                  valor={cvv}
                  placeholder="CVV"
                  inputMode="numeric"
                  aoMudar={(v) => {
                    setCvv(v.replace(/\D/g, "").slice(0, 4));
                    if (erros.cvv) setErros((p) => ({ ...p, cvv: "" }));
                  }}
                  erro={erros.cvv}
                />
              </div>
            </div>
          </div>

          {/* Seção Informações de Cobrança */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Informações de Cobrança
            </h3>
            <div className="space-y-4">
              <CampoFormulario
                id="nomeTitular"
                rotulo="Nome do titular do cartão"
                tipo="text"
                valor={nomeTitular}
                placeholder="Nome do titular do cartão"
                aoMudar={(v) => {
                  setNomeTitular(v);
                  if (erros.nomeTitular)
                    setErros((p) => ({ ...p, nomeTitular: "" }));
                }}
                erro={erros.nomeTitular}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CampoSelect
                  id="tipoDocumento"
                  rotulo="Selecione o tipo de documento"
                  valor={tipoDocumento}
                  placeholder="CPF"
                  opcoes={OPCOES_DOCUMENTO}
                  aoMudar={handleTipoDocumentoChange}
                />
                <CampoFormulario
                  id="documento"
                  rotulo="Documento do titular do cartão"
                  tipo="text"
                  valor={documento}
                  placeholder={placeholderDocumento}
                  inputMode="numeric"
                  aoMudar={(v) => {
                    const docFormatado =
                      tipoDocumento === "CPF"
                        ? formatarCPF(v)
                        : formatarCNPJ(v);
                    setDocumento(docFormatado);
                    if (erros.documento)
                      setErros((p) => ({ ...p, documento: "" }));
                  }}
                  erro={erros.documento}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-full bg-brand py-3.5 px-6 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#6d28d9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
            >
              Confirmar Pagamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
