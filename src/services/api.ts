const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface PedidoLojaItemPayload {
    produtoId: number;
    quantidade: number;
    precoUnitario?: number;
}

export interface PedidoLojaPayload {
    usuarioId: number;
    itens: PedidoLojaItemPayload[];
    status?: 'PENDENTE' | 'CONFIRMADO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
}

export async function processarCheckoutAPI(payload: PedidoLojaPayload) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || 'Ocorreu um erro ao processar o pedido na loja virtual.'
        );
    }

    return response.json();
}

interface LoginPayload {
    identificador: string;
    senha: string;
}

interface LoginResponse {
    usuario: Record<string, unknown>;
    token?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mensagemErroAPI(dados: unknown, status: number): string {
    if (isRecord(dados)) {
        const mensagem = dados.message ?? dados.error;
        if (typeof mensagem === 'string') return mensagem;
        if (Array.isArray(mensagem)) {
            const mensagens = mensagem.map((item) => {
                if (typeof item === 'string') return item;
                if (isRecord(item) && typeof item.message === 'string') return item.message;
                return '';
            }).filter(Boolean);
            if (mensagens.length > 0) return mensagens.join('. ');
        }
    }

    if (status === 409) return 'Este e-mail ou CPF já está cadastrado.';
    if (status === 400) return 'Dados inválidos. Verifique as informações preenchidas.';
    if (status === 401) return 'E-mail ou senha incorretos.';

    return `Não foi possível concluir a solicitação (HTTP ${status}).`;
}

export interface EnderecoPayload {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
}

export interface CadastroUsuarioPayload {
    nome: string;
    email: string;
    senha: string;
    dataNascimento: string;
    telefone: string;
    cpf?: string;
    sexo?: string;
    cargo?: 'ALUNO' | 'PROFISSIONAL' | 'ADMIN';
    endereco?: EnderecoPayload;
}

export async function cadastrarUsuarioAPI(payload: CadastroUsuarioPayload) {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const texto = await response.text();
    let dados: unknown;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            if (!response.ok) {
                throw new Error(mensagemErroAPI(undefined, response.status));
            }
            throw new Error('O servidor retornou uma resposta inválida.');
        }
    }

    if (!response.ok) {
        throw new Error(mensagemErroAPI(dados, response.status));
    }

    return isRecord(dados) ? dados : { ...payload };
}

async function solicitarAuthAPI(
    rota: string,
    payload: object,
): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}${rota}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const texto = await response.text();
    let dados: unknown;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            if (!response.ok) {
                throw new Error(mensagemErroAPI(undefined, response.status));
            }
            throw new Error('O servidor retornou uma resposta inválida.');
        }
    }

    if (!response.ok) {
        throw new Error(mensagemErroAPI(dados, response.status));
    }

    return dados;
}

export async function loginAPI(payload: LoginPayload): Promise<LoginResponse> {
    const dados = await solicitarAuthAPI('/auth/login', payload);
    if (!isRecord(dados) || !isRecord(dados.usuario)) {
        throw new Error('O servidor retornou dados de login inválidos.');
    }
    if (dados.token !== undefined && typeof dados.token !== 'string') {
        throw new Error('O servidor retornou um token de acesso inválido.');
    }

    return {
        usuario: dados.usuario,
        ...(typeof dados.token === 'string' ? { token: dados.token } : {}),
    };
}

export async function solicitarRecuperacaoSenhaAPI(email: string): Promise<void> {
    await solicitarAuthAPI('/auth/recuperar-senha', { email });
}

export async function redefinirSenhaAPI(payload: {
    token: string;
    senha: string;
}): Promise<void> {
    await solicitarAuthAPI('/auth/redefinir-senha', payload);
}

export interface UsuarioDetalhes {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpf?: string | null;
    sexo?: string | null;
    dataNascimento?: string;
    cargo?: string;
    planoId?: number | null;
    plano?: {
        id: number;
        nome: string;
        descricao?: string | null;
        preco: string | number;
        duracaoMeses: number;
    } | null;
    criadoEm?: string;
    atualizadoEm?: string;
    assinaturas?: {
        id: number;
        planoId: number;
        dataInicio: string;
        dataFim?: string | null;
        status: string;
        plano?: {
            id: number;
            nome: string;
            descricao?: string | null;
            preco: string | number;
            duracaoMeses: number;
        };
    }[];
    enderecos?: {
        id: number;
        cep: string;
        estado: string;
        cidade: string;
        bairro: string;
        rua: string;
        numero: string;
        complemento?: string | null;
    }[];
}

export interface PlanoDetalhes {
    id: number;
    nome: string;
    descricao?: string | null;
    preco: string | number;
    duracaoMeses: number;
    ativo: boolean;
}

export interface AssinaturaDetalhes {
    id: number;
    usuarioId: number;
    planoId: number;
    dataInicio: string;
    dataFim?: string | null;
    status: string;
    plano?: PlanoDetalhes;
}

async function solicitarAPI<T = unknown>(
    rota: string,
    opcoes: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${rota}`;
    const headers = {
        'Content-Type': 'application/json',
        ...(opcoes.headers || {}),
    };

    const response = await fetch(url, {
        ...opcoes,
        headers,
    });

    const texto = await response.text();
    let dados: unknown;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            if (!response.ok) {
                throw new Error(mensagemErroAPI(undefined, response.status));
            }
            throw new Error('O servidor retornou uma resposta inválida.');
        }
    }

    if (!response.ok) {
        throw new Error(mensagemErroAPI(dados, response.status));
    }

    return dados as T;
}

export async function obterUsuarioAPI(id: number | string): Promise<UsuarioDetalhes> {
    return solicitarAPI<UsuarioDetalhes>(`/users/${id}`, { method: 'GET' });
}

export async function atualizarUsuarioAPI(
    id: number | string,
    dados: Record<string, unknown>
): Promise<UsuarioDetalhes> {
    return solicitarAPI<UsuarioDetalhes>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dados),
    });
}

export async function excluirUsuarioAPI(id: number | string): Promise<{ message: string }> {
    return solicitarAPI<{ message: string }>(`/users/${id}`, {
        method: 'DELETE',
    });
}

export async function obterPlanosAPI(): Promise<PlanoDetalhes[]> {
    return solicitarAPI<PlanoDetalhes[]>('/plans', { method: 'GET' });
}

export async function criarAssinaturaAPI(dados: {
    usuarioId: number;
    planoId: number;
    status?: string;
}): Promise<AssinaturaDetalhes> {
    return solicitarAPI<AssinaturaDetalhes>('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(dados),
    });
}

export async function obterAssinaturasAPI(usuarioId: number | string): Promise<AssinaturaDetalhes[]> {
    return solicitarAPI<AssinaturaDetalhes[]>(`/subscriptions?usuarioId=${usuarioId}`, { method: 'GET' });
}

export async function atualizarAssinaturaAPI(
    id: number,
    dados: { planoId?: number; status?: string }
): Promise<AssinaturaDetalhes> {
    return solicitarAPI<AssinaturaDetalhes>(`/subscriptions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(dados),
    });
}

export async function cancelarAssinaturaAPI(id: number): Promise<AssinaturaDetalhes> {
    return solicitarAPI<AssinaturaDetalhes>(`/subscriptions/${id}`, {
        method: 'DELETE',
    });
}

export async function alterarPlanoUsuarioAPI(
    usuarioId: number | string,
    planoId: number
): Promise<UsuarioDetalhes> {
    return atualizarUsuarioAPI(usuarioId, { planoId });
}

export interface CadastroAlunoComPlanoPayload {
    usuario: Omit<CadastroUsuarioPayload, 'endereco'>;
    endereco: EnderecoPayload;
    planoId: number;
}

export interface CadastroAlunoComPlanoResponse {
    usuario: Record<string, unknown>;
    usuarioId: number;
    assinatura: AssinaturaDetalhes;
}

export async function cadastrarAlunoComPlanoAPI(
    payload: CadastroAlunoComPlanoPayload
): Promise<CadastroAlunoComPlanoResponse> {
    const usuarioCriado = await cadastrarUsuarioAPI({
        ...payload.usuario,
        cargo: payload.usuario.cargo ?? 'ALUNO',
        endereco: payload.endereco,
    });

    const usuarioId = Number(usuarioCriado.id);
    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
        throw new Error('Não foi possível identificar o usuário criado.');
    }

    const assinatura = await criarAssinaturaAPI({
        usuarioId,
        planoId: payload.planoId,
        status: 'PENDENTE',
    });

    return {
        usuario: usuarioCriado,
        usuarioId,
        assinatura,
    };
}

export interface ServicoProfissionalAPI {
    profissionalId: number;
    servicoId: number;
    servico: {
        id: number;
        nome: string;
        descricao?: string | null;
        ativo: boolean;
    };
}

export interface ProfissionalAPI {
    id: number;
    usuarioId: number;
    especializacao: string;
    biografia?: string | null;
    urlFoto?: string | null;
    ativo: boolean;
    criadoEm?: string;
    atualizadoEm?: string;
    usuario?: {
        id: number;
        nome: string;
        email: string;
    };
    servicos?: ServicoProfissionalAPI[];
}

export type ObjetivoId =
    | 'musculo'
    | 'emagrecer'
    | 'condicionamento'
    | 'lesao'
    | 'alimentacao';

export interface PerfilProfissional {
    cargo: string;
    artigo: 'a' | 'o';
    resumo: string;
    sobre: string;
    especialidades: string[];
    formacao: string[];
    local: string;
    online: boolean;
    horario: string;
}

export interface Profissional {
    id: string;
    nome: string;
    descricao: string;
    especialidades: string[];
    objetivos: ObjetivoId[];
    foto: string;
    fotoPosicao?: string;
    perfil: PerfilProfissional;
}

export const OBJETIVOS_PROFISSIONAIS: { id: ObjetivoId; rotulo: string[] }[] = [
    { id: 'musculo', rotulo: ['Ganhar massa', 'muscular'] },
    { id: 'emagrecer', rotulo: ['Emagrecer'] },
    { id: 'condicionamento', rotulo: ['Melhorar o', 'condicionamento'] },
    { id: 'lesao', rotulo: ['Recuperar de lesão'] },
    { id: 'alimentacao', rotulo: ['Melhorar minha', 'alimentação'] },
];

function inferirObjetivosProfissional(texto: string): ObjetivoId[] {
    const t = texto.toLowerCase();
    const encontrados: ObjetivoId[] = [];

    if (t.includes('hipertrofia') || t.includes('força') || t.includes('muscul') || t.includes('personal')) {
        encontrados.push('musculo');
    }
    if (t.includes('emagrec') || t.includes('gordura') || t.includes('peso')) {
        encontrados.push('emagrecer');
    }
    if (t.includes('condicion') || t.includes('funcional') || t.includes('resist') || t.includes('mobilidade')) {
        encontrados.push('condicionamento');
    }
    if (t.includes('reabilit') || t.includes('les') || t.includes('dor') || t.includes('fisioter')) {
        encontrados.push('lesao');
    }
    if (t.includes('nutri') || t.includes('aliment') || t.includes('saúde')) {
        encontrados.push('alimentacao');
    }

    return encontrados.length > 0 ? encontrados : ['condicionamento'];
}

export function mapearProfissionalAPI(item: ProfissionalAPI): Profissional {
    const nome = item.usuario?.nome?.trim() || 'Profissional RiseFit';
    const especializacao = item.especializacao?.trim() || 'Especialista RiseFit';
    const cargo = especializacao.split(/[•(]/)[0].trim() || especializacao;

    const servicosNomes = (item.servicos ?? [])
        .filter((s) => s.servico && s.servico.ativo !== false)
        .map((s) => s.servico.nome.trim())
        .filter(Boolean);

    const especialidades =
        servicosNomes.length > 0 ? servicosNomes : [cargo];

    const foto = item.urlFoto?.trim() || '';
    const fotoPosicao = foto.includes('prof-mariana')
        ? '50% 26%'
        : foto.includes('prof-rafael')
            ? '50% 0%'
            : '50% 50%';

    const primeiroNome = nome.split(/\s+/)[0]?.toLowerCase() ?? '';
    const artigo: 'a' | 'o' = primeiroNome.endsWith('a') ? 'a' : 'o';
    const biografia =
        item.biografia?.trim() ||
        'Especialista RiseFit com foco em acompanhamento próximo, evolução consistente e saúde.';

    return {
        id: String(item.id),
        nome,
        descricao: biografia,
        especialidades,
        objetivos: inferirObjetivosProfissional(`${especializacao} ${especialidades.join(' ')}`),
        foto,
        fotoPosicao,
        perfil: {
            cargo,
            artigo,
            resumo: especialidades.slice(0, 2).join(' e ') || cargo,
            sobre: biografia,
            especialidades,
            formacao: [especializacao],
            local: 'Atendimento em Caraguatatuba – SP',
            online: true,
            horario: 'Segunda a sexta • 7h às 20h',
        },
    };
}

function extrairListaProfissionais(dados: unknown): ProfissionalAPI[] {
    if (Array.isArray(dados)) return dados as ProfissionalAPI[];
    if (isRecord(dados) && Array.isArray(dados.data)) {
        return dados.data as ProfissionalAPI[];
    }
    return [];
}

function extrairProfissional(dados: unknown): ProfissionalAPI | null {
    if (!isRecord(dados)) return null;
    if (isRecord(dados.data)) return dados.data as unknown as ProfissionalAPI;
    if (dados.id !== undefined) return dados as unknown as ProfissionalAPI;
    return null;
}

export async function obterProfissionaisAPI(
    incluirInativos = false
): Promise<ProfissionalAPI[]> {
    const query = incluirInativos ? '?incluirInativos=true' : '';
    const dados = await solicitarAPI<unknown>(`/professionals${query}`, {
        method: 'GET',
        cache: 'no-store',
    });
    return extrairListaProfissionais(dados);
}

export interface CriarProfissionalPayload {
    nome: string;
    email: string;
    telefone?: string;
    especializacao: string;
    biografia?: string;
    urlFoto?: string;
    servicos?: string[];
    ativo?: boolean;
}

export interface AtualizarProfissionalPayload {
    nome?: string;
    email?: string;
    especializacao?: string;
    biografia?: string | null;
    urlFoto?: string | null;
    servicos?: string[];
    ativo?: boolean;
}

export async function criarProfissionalAPI(
    payload: CriarProfissionalPayload
): Promise<ProfissionalAPI> {
    return solicitarAPI<ProfissionalAPI>('/professionals', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function atualizarProfissionalAPI(
    id: number,
    payload: AtualizarProfissionalPayload
): Promise<ProfissionalAPI> {
    return solicitarAPI<ProfissionalAPI>(`/professionals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
}

export async function excluirProfissionalAPI(
    id: number
): Promise<ProfissionalAPI> {
    return solicitarAPI<ProfissionalAPI>(`/professionals/${id}`, {
        method: 'DELETE',
    });
}

export async function obterProfissionalPorIdAPI(
    id: number | string
): Promise<ProfissionalAPI | null> {
    const idNumerico = Number(id);
    if (!Number.isSafeInteger(idNumerico) || idNumerico <= 0) {
        return null;
    }

    const response = await fetch(`${API_BASE_URL}/professionals/${idNumerico}`, {
        method: 'GET',
        cache: 'no-store',
    });

    if (response.status === 404 || response.status === 400) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Não foi possível carregar o profissional (HTTP ${response.status}).`);
    }

    const dados: unknown = await response.json().catch(() => null);
    return extrairProfissional(dados);
}