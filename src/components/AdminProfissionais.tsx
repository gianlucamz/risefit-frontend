"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  atualizarProfissionalAPI,
  criarProfissionalAPI,
  excluirProfissionalAPI,
  obterProfissionaisAPI,
  type ProfissionalAPI,
} from "@/services/api";

interface AdminProfissionaisProps {
  onTotalChange?: (total: number) => void;
}

const inputClasse =
  "w-full border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-dark placeholder:text-gray-400 focus:border-brand focus:outline-none";

const ESPECIALIDADES_PADRAO = [
  "Musculação",
  "Hipertrofia",
  "Emagrecimento",
  "Condicionamento físico",
  "Treino funcional",
  "Avaliação física",
  "Reabilitação e lesões",
  "Nutrição esportiva",
];

function lerArquivoComoDataUrl(
  arquivo: File,
  maxDimensao = 600,
  qualidade = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onload = () => {
      if (typeof leitor.result !== "string") {
        reject(new Error("Não foi possível ler a imagem selecionada."));
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimensao || height > maxDimensao) {
          if (width >= height) {
            height = Math.round((height * maxDimensao) / width);
            width = maxDimensao;
          } else {
            width = Math.round((width * maxDimensao) / height);
            height = maxDimensao;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível processar a imagem."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", qualidade));
      };

      img.onerror = () =>
        reject(new Error("Erro ao decodificar o arquivo de imagem."));
      img.src = leitor.result;
    };

    leitor.onerror = () =>
      reject(new Error("Erro ao carregar o arquivo de imagem."));
    leitor.readAsDataURL(arquivo);
  });
}

export default function AdminProfissionais({
  onTotalChange,
}: AdminProfissionaisProps) {
  const [profissionais, setProfissionais] = useState<ProfissionalAPI[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  // Formulário direto de criação
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [especializacao, setEspecializacao] = useState("");
  const [especialidadesSelecionadas, setEspecialidadesSelecionadas] =
    useState<string[]>([]);
  const [urlFoto, setUrlFoto] = useState("");
  const [nomeArquivoFoto, setNomeArquivoFoto] = useState("");
  const [biografia, setBiografia] = useState("");
  const [criando, setCriando] = useState(false);

  // Edição inline
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editEspecializacao, setEditEspecializacao] = useState("");
  const [editEspecialidadesSelecionadas, setEditEspecialidadesSelecionadas] =
    useState<string[]>([]);
  const [editUrlFoto, setEditUrlFoto] = useState("");
  const [editNomeArquivoFoto, setEditNomeArquivoFoto] = useState("");
  const [editBiografia, setEditBiografia] = useState("");
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  // Confirmação de exclusão e processamento
  const [confirmandoExclusaoId, setConfirmandoExclusaoId] = useState<
    number | null
  >(null);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  // Filtros
  const [filtroId, setFiltroId] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<
    "TODOS" | "ATIVOS" | "INATIVOS"
  >("TODOS");

  const carregarLista = useCallback(async () => {
    const dados = await obterProfissionaisAPI(true);
    setProfissionais(dados);
    onTotalChange?.(dados.length);
  }, [onTotalChange]);

  useEffect(() => {
    let ativo = true;

    obterProfissionaisAPI(true)
      .then((dados) => {
        if (!ativo) return;
        setProfissionais(dados);
        onTotalChange?.(dados.length);
      })
      .catch((e) => {
        if (!ativo) return;
        setMensagem({
          tipo: "erro",
          texto:
            e instanceof Error ? e.message : "Erro ao carregar profissionais.",
        });
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [onTotalChange]);

  const opcoesEspecialidades = useMemo(() => {
    const set = new Set<string>(ESPECIALIDADES_PADRAO);
    for (const p of profissionais) {
      for (const s of p.servicos ?? []) {
        if (s.servico?.nome?.trim()) set.add(s.servico.nome.trim());
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [profissionais]);

  async function handleSelecionarArquivoCriar(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      setMensagem({
        tipo: "erro",
        texto: "Selecione um arquivo de imagem válido (JPG, PNG, WEBP).",
      });
      return;
    }

    try {
      const dataUrl = await lerArquivoComoDataUrl(arquivo);
      setUrlFoto(dataUrl);
      setNomeArquivoFoto(arquivo.name);
      setMensagem(null);
    } catch (err) {
      setMensagem({
        tipo: "erro",
        texto:
          err instanceof Error
            ? err.message
            : "Erro ao ler a imagem selecionada.",
      });
    }
  }

  async function handleSelecionarArquivoEditar(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      setMensagem({
        tipo: "erro",
        texto: "Selecione um arquivo de imagem válido (JPG, PNG, WEBP).",
      });
      return;
    }

    try {
      const dataUrl = await lerArquivoComoDataUrl(arquivo);
      setEditUrlFoto(dataUrl);
      setEditNomeArquivoFoto(arquivo.name);
      setMensagem(null);
    } catch (err) {
      setMensagem({
        tipo: "erro",
        texto:
          err instanceof Error
            ? err.message
            : "Erro ao ler a imagem selecionada.",
      });
    }
  }

  async function handleAtualizar() {
    setAtualizando(true);
    setMensagem(null);
    try {
      await carregarLista();
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto:
          e instanceof Error ? e.message : "Erro ao atualizar profissionais.",
      });
    } finally {
      setAtualizando(false);
    }
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (criando) return;

    if (especialidadesSelecionadas.length === 0) {
      setMensagem({
        tipo: "erro",
        texto: "Selecione pelo menos uma especialidade na lista.",
      });
      return;
    }

    setCriando(true);
    setMensagem(null);

    try {
      const criado = await criarProfissionalAPI({
        nome: nome.trim(),
        email: email.trim(),
        especializacao: especializacao.trim(),
        servicos: especialidadesSelecionadas,
        urlFoto: urlFoto.trim() || undefined,
        biografia: biografia.trim() || undefined,
      });

      setNome("");
      setEmail("");
      setEspecializacao("");
      setEspecialidadesSelecionadas([]);
      setUrlFoto("");
      setNomeArquivoFoto("");
      setBiografia("");

      await carregarLista();
      setMensagem({
        tipo: "sucesso",
        texto: `Profissional "${criado.usuario?.nome || nome}" (#${criado.id}) cadastrado com sucesso!`,
      });
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto:
          e instanceof Error
            ? e.message
            : "Não foi possível cadastrar o profissional.",
      });
    } finally {
      setCriando(false);
    }
  }

  function iniciarEdicao(item: ProfissionalAPI) {
    const especialidadesAtuais = (item.servicos ?? [])
      .map((s) => s.servico?.nome)
      .filter((nomeSrv): nomeSrv is string => Boolean(nomeSrv));

    setEditandoId(item.id);
    setEditNome(item.usuario?.nome || "");
    setEditEmail(item.usuario?.email || "");
    setEditEspecializacao(item.especializacao || "");
    setEditEspecialidadesSelecionadas(especialidadesAtuais);
    setEditUrlFoto(item.urlFoto || "");
    setEditNomeArquivoFoto("");
    setEditBiografia(item.biografia || "");
    setConfirmandoExclusaoId(null);
    setMensagem(null);
  }

  async function handleSalvarEdicao(id: number) {
    if (salvandoEdicao) return;
    if (editEspecialidadesSelecionadas.length === 0) {
      setMensagem({
        tipo: "erro",
        texto: "Selecione pelo menos uma especialidade para o profissional.",
      });
      return;
    }

    setSalvandoEdicao(true);
    setMensagem(null);

    try {
      await atualizarProfissionalAPI(id, {
        nome: editNome.trim(),
        email: editEmail.trim(),
        especializacao: editEspecializacao.trim(),
        servicos: editEspecialidadesSelecionadas,
        urlFoto: editUrlFoto.trim() || null,
        biografia: editBiografia.trim() || null,
      });

      setEditandoId(null);
      await carregarLista();
      setMensagem({
        tipo: "sucesso",
        texto: `Profissional #${id} atualizado com sucesso!`,
      });
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto:
          e instanceof Error
            ? e.message
            : "Não foi possível atualizar o profissional.",
      });
    } finally {
      setSalvandoEdicao(false);
    }
  }

  async function handleExcluir(id: number) {
    setProcessandoId(id);
    setMensagem(null);
    try {
      await excluirProfissionalAPI(id);
      setConfirmandoExclusaoId(null);
      await carregarLista();
      setMensagem({
        tipo: "sucesso",
        texto: `Profissional #${id} inativado e removido da listagem pública.`,
      });
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto:
          e instanceof Error
            ? e.message
            : "Não foi possível remover o profissional.",
      });
    } finally {
      setProcessandoId(null);
    }
  }

  async function handleReativar(id: number) {
    setProcessandoId(id);
    setMensagem(null);
    try {
      await atualizarProfissionalAPI(id, { ativo: true });
      await carregarLista();
      setMensagem({
        tipo: "sucesso",
        texto: `Profissional #${id} reativado com sucesso!`,
      });
    } catch (e) {
      setMensagem({
        tipo: "erro",
        texto:
          e instanceof Error
            ? e.message
            : "Não foi possível reativar o profissional.",
      });
    } finally {
      setProcessandoId(null);
    }
  }

  const ativos = profissionais.filter((p) => p.ativo).length;
  const inativos = profissionais.length - ativos;

  const categoriasDisponiveis = useMemo(() => {
    const set = new Set<string>();
    for (const p of profissionais) {
      const cargo = p.especializacao?.split(/[•(]/)[0]?.trim();
      if (cargo) set.add(cargo);
      for (const s of p.servicos ?? []) {
        if (s.servico?.nome) set.add(s.servico.nome);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [profissionais]);

  const listaFiltrada = useMemo(() => {
    const idTermo = filtroId.trim();
    const nomeTermo = filtroNome.trim().toLowerCase();
    const catTermo = filtroCategoria.trim().toLowerCase();

    return profissionais.filter((item) => {
      const bateStatus =
        filtroStatus === "TODOS" ||
        (filtroStatus === "ATIVOS" && item.ativo) ||
        (filtroStatus === "INATIVOS" && !item.ativo);

      const bateId =
        !idTermo ||
        String(item.id) === idTermo ||
        String(item.id).includes(idTermo);

      const bateNome =
        !nomeTermo ||
        item.usuario?.nome?.toLowerCase().includes(nomeTermo) ||
        item.usuario?.email?.toLowerCase().includes(nomeTermo);

      const servicosNomes = (item.servicos ?? [])
        .map((s) => s.servico?.nome?.toLowerCase() || "")
        .join(" ");

      const bateCategoria =
        !catTermo ||
        item.especializacao.toLowerCase().includes(catTermo) ||
        servicosNomes.includes(catTermo);

      return bateStatus && bateId && bateNome && bateCategoria;
    });
  }, [profissionais, filtroId, filtroNome, filtroCategoria, filtroStatus]);

  const temFiltroAtivo = Boolean(
    filtroId.trim() ||
    filtroNome.trim() ||
    filtroCategoria.trim() ||
    filtroStatus !== "TODOS",
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-3 gap-4">
        <div className="border border-gray-200 p-4 sm:p-5">
          <p className="text-sm text-gray-500">Total</p>
          <p className="mt-2 text-3xl font-bold text-dark">
            {profissionais.length}
          </p>
        </div>
        <div className="border border-gray-200 p-4 sm:p-5">
          <p className="text-sm text-gray-500">Ativos no site</p>
          <p className="mt-2 text-3xl font-bold text-dark">{ativos}</p>
        </div>
        <div className="border border-gray-200 p-4 sm:p-5">
          <p className="text-sm text-gray-500">Inativos</p>
          <p className="mt-2 text-3xl font-bold text-dark">{inativos}</p>
        </div>
      </section>

      {mensagem && (
        <div
          role="status"
          className={`border-l-4 p-4 text-sm font-medium ${
            mensagem.tipo === "sucesso"
              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
              : "border-red-600 bg-red-50 text-red-700"
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      <section className="border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:px-5">
          <h2 className="text-base font-semibold text-dark">
            Adicionar profissional
          </h2>
          <span className="text-xs font-medium text-gray-500">
            Cadastro direto
          </span>
        </div>

        <form onSubmit={handleCriar} className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Nome completo *
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Profissional RiseFit"
                className={inputClasse}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                E-mail *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: profissional@risefit.com"
                className={inputClasse}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Especialização / Registro *
              </label>
              <input
                type="text"
                required
                value={especializacao}
                onChange={(e) => setEspecializacao(e.target.value)}
                placeholder="Ex: Personal Trainer • CREF 123456-G/SP"
                className={inputClasse}
              />
            </div>

            <SeletorEspecialidades
              rotulo="Especialidades *"
              opcoes={opcoesEspecialidades}
              selecionadas={especialidadesSelecionadas}
              aoMudar={setEspecialidadesSelecionadas}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              Foto do profissional (opcional)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                Escolher foto do computador
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelecionarArquivoCriar}
                  className="sr-only"
                />
              </label>

              {nomeArquivoFoto && (
                <span className="text-xs text-gray-600">{nomeArquivoFoto}</span>
              )}

              {urlFoto && (
                <button
                  type="button"
                  onClick={() => {
                    setUrlFoto("");
                    setNomeArquivoFoto("");
                  }}
                  className="cursor-pointer text-xs font-medium text-red-700 hover:underline"
                >
                  Remover foto
                </button>
              )}
            </div>

            {urlFoto && (
              <div className="mt-3 flex items-center gap-3">
                <Image
                  src={urlFoto}
                  alt="Prévia da foto do profissional"
                  width={64}
                  height={64}
                  unoptimized
                  className="h-16 w-16 rounded-full border border-gray-200 object-cover"
                />
                <span className="text-xs text-gray-500">
                  Pré-visualização da imagem selecionada
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              Biografia (opcional)
            </label>
            <textarea
              rows={3}
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              placeholder="Descreva a formação, abordagem e foco de atendimento..."
              className={inputClasse}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={criando}
              className="cursor-pointer bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {criando ? "Cadastrando..." : "Adicionar profissional"}
            </button>
            <Link
              href="/profissionais"
              className="text-sm font-medium text-brand hover:underline"
            >
              Ver catálogo público →
            </Link>
          </div>
        </form>
      </section>

      <section className="border border-gray-200 bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:px-5">
          <h2 className="text-base font-semibold text-dark">
            Profissionais cadastrados
          </h2>

          <button
            type="button"
            disabled={atualizando}
            onClick={handleAtualizar}
            className="cursor-pointer border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {atualizando ? "Atualizando..." : "Atualizar lista"}
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {(["TODOS", "ATIVOS", "INATIVOS"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFiltroStatus(st)}
                    aria-pressed={filtroStatus === st}
                    className={`cursor-pointer border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      filtroStatus === st
                        ? "border-gray-800 bg-gray-800 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {st === "TODOS"
                      ? "Todos"
                      : st === "ATIVOS"
                        ? "Ativos"
                        : "Inativos"}
                  </button>
                ))}
              </div>

              {temFiltroAtivo && (
                <button
                  type="button"
                  onClick={() => {
                    setFiltroId("");
                    setFiltroNome("");
                    setFiltroCategoria("");
                    setFiltroStatus("TODOS");
                  }}
                  className="cursor-pointer text-xs font-semibold text-brand hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                value={filtroId}
                onChange={(e) => setFiltroId(e.target.value)}
                placeholder="Filtrar por ID (ex: 1)"
                aria-label="Filtrar profissional por ID"
                className={inputClasse}
              />
              <input
                type="text"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                placeholder="Filtrar por nome ou e-mail..."
                aria-label="Filtrar profissional por nome"
                className={inputClasse}
              />
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                aria-label="Filtrar profissional por categoria ou especialidade"
                className={inputClasse}
              >
                <option value="">Todas as categorias / especialidades</option>
                {categoriasDisponiveis.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {carregando ? (
            <p className="py-6 text-sm text-gray-500">
              Carregando profissionais...
            </p>
          ) : listaFiltrada.length === 0 ? (
            <p className="py-6 text-sm text-gray-500">
              Nenhum profissional encontrado para os filtros informados.
            </p>
          ) : (
            <div className="divide-y divide-gray-200">
              {listaFiltrada.map((item) => {
                const estaEditando = editandoId === item.id;
                const confirmandoExclusao = confirmandoExclusaoId === item.id;
                const servicosLista = (item.servicos ?? [])
                  .map((s) => s.servico?.nome)
                  .filter(Boolean);

                return (
                  <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        {item.urlFoto ? (
                          <Image
                            src={item.urlFoto}
                            alt={`Foto de ${item.usuario?.nome || "Profissional"}`}
                            width={40}
                            height={40}
                            unoptimized
                            className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-bold text-gray-600">
                            {(item.usuario?.nome || "P")
                              .split(" ")
                              .map((p) => p[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-dark">
                            #{item.id} •{" "}
                            {item.usuario?.nome || `Usuário #${item.usuarioId}`}{" "}
                            <span className="font-normal text-gray-500">
                              ({item.usuario?.email || "Sem e-mail"})
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-gray-600">
                            {item.especializacao}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold ${
                          item.ativo ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        {item.ativo ? "ATIVO" : "INATIVO"}
                      </span>
                    </div>

                    {estaEditando ? (
                      <div className="mt-4 space-y-3 border border-gray-200 bg-gray-50 p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">
                              Nome
                            </label>
                            <input
                              type="text"
                              value={editNome}
                              onChange={(e) => setEditNome(e.target.value)}
                              className={inputClasse}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">
                              E-mail
                            </label>
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className={inputClasse}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-600">
                              Especialização
                            </label>
                            <input
                              type="text"
                              value={editEspecializacao}
                              onChange={(e) =>
                                setEditEspecializacao(e.target.value)
                              }
                              className={inputClasse}
                            />
                          </div>
                          <SeletorEspecialidades
                            rotulo="Especialidades *"
                            opcoes={opcoesEspecialidades}
                            selecionadas={editEspecialidadesSelecionadas}
                            aoMudar={setEditEspecialidadesSelecionadas}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-600">
                            Foto do profissional
                          </label>
                          <div className="flex flex-wrap items-center gap-3">
                            <label className="cursor-pointer border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                              Escolher foto do computador
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleSelecionarArquivoEditar}
                                className="sr-only"
                              />
                            </label>

                            {editNomeArquivoFoto && (
                              <span className="text-xs text-gray-600">
                                {editNomeArquivoFoto}
                              </span>
                            )}

                            {editUrlFoto && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditUrlFoto("");
                                  setEditNomeArquivoFoto("");
                                }}
                                className="cursor-pointer text-xs font-medium text-red-700 hover:underline"
                              >
                                Remover foto
                              </button>
                            )}
                          </div>

                          {editUrlFoto && (
                            <div className="mt-2.5 flex items-center gap-3">
                              <Image
                                src={editUrlFoto}
                                alt="Prévia da foto"
                                width={56}
                                height={56}
                                unoptimized
                                className="h-14 w-14 rounded-full border border-gray-200 object-cover"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-600">
                            Biografia
                          </label>
                          <textarea
                            rows={3}
                            value={editBiografia}
                            onChange={(e) => setEditBiografia(e.target.value)}
                            className={inputClasse}
                          />
                        </div>

                        <div className="flex flex-wrap gap-3 pt-1">
                          <button
                            type="button"
                            disabled={salvandoEdicao}
                            onClick={() => handleSalvarEdicao(item.id)}
                            className="cursor-pointer bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {salvandoEdicao
                              ? "Salvando..."
                              : "Salvar alterações"}
                          </button>
                          <button
                            type="button"
                            disabled={salvandoEdicao}
                            onClick={() => setEditandoId(null)}
                            className="cursor-pointer border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-1.5 text-xs leading-5 text-gray-500">
                          Especialidades:{" "}
                          {servicosLista.length > 0
                            ? servicosLista.join(" • ")
                            : "Nenhuma vinculada"}
                        </p>
                        {item.biografia && (
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {item.biografia}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            disabled={processandoId === item.id}
                            onClick={() => iniciarEdicao(item)}
                            className="cursor-pointer border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Editar
                          </button>

                          {item.ativo ? (
                            confirmandoExclusao ? (
                              <>
                                <button
                                  type="button"
                                  disabled={processandoId === item.id}
                                  onClick={() => handleExcluir(item.id)}
                                  className="cursor-pointer bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {processandoId === item.id
                                    ? "Removendo..."
                                    : "Confirmar exclusão"}
                                </button>
                                <button
                                  type="button"
                                  disabled={processandoId === item.id}
                                  onClick={() => setConfirmandoExclusaoId(null)}
                                  className="cursor-pointer border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                disabled={processandoId === item.id}
                                onClick={() =>
                                  setConfirmandoExclusaoId(item.id)
                                }
                                className="cursor-pointer border border-red-300 bg-white px-3.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Excluir
                              </button>
                            )
                          ) : (
                            <button
                              type="button"
                              disabled={processandoId === item.id}
                              onClick={() => handleReativar(item.id)}
                              className="cursor-pointer bg-brand px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processandoId === item.id
                                ? "Reativando..."
                                : "Reativar"}
                            </button>
                          )}

                          {item.ativo && (
                            <Link
                              href={`/profissionais/${item.id}`}
                              className="ml-auto text-xs font-medium text-brand hover:underline"
                            >
                              Ver perfil público →
                            </Link>
                          )}
                        </div>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SeletorEspecialidades({
  rotulo,
  opcoes,
  selecionadas,
  aoMudar,
}: {
  rotulo: string;
  opcoes: string[];
  selecionadas: string[];
  aoMudar: (novaLista: string[]) => void;
}) {
  const disponiveis = opcoes.filter((op) => !selecionadas.includes(op));

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
        {rotulo}
      </label>
      <select
        value=""
        onChange={(e) => {
          const valor = e.target.value;
          if (valor && !selecionadas.includes(valor)) {
            aoMudar([...selecionadas, valor]);
          }
        }}
        className={inputClasse}
      >
        <option value="">
          {disponiveis.length === 0
            ? "Todas as especialidades selecionadas"
            : selecionadas.length === 0
              ? "Selecione uma ou mais especialidades"
              : "Adicionar outra especialidade..."}
        </option>
        {disponiveis.map((esp) => (
          <option key={esp} value={esp}>
            {esp}
          </option>
        ))}
      </select>

      {selecionadas.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {selecionadas.map((esp) => (
            <span
              key={esp}
              className="inline-flex items-center gap-2 border border-brand/30 bg-[#f4effe] px-2.5 py-1 text-xs font-semibold text-brand"
            >
              {esp}
              <button
                type="button"
                onClick={() => aoMudar(selecionadas.filter((s) => s !== esp))}
                aria-label={`Remover especialidade ${esp}`}
                className="cursor-pointer text-sm leading-none text-brand hover:text-[#6d28d9]"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
