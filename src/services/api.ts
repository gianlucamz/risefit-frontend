const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface CheckoutPayload {
    usuario: {
        nome: string;
        email: string;
        senha?: string;
        dataNascimento: string;
        telefone: string;
        cpf: string;
        sexo: string;
    };
    endereco: {
        cep: string;
        estado: string;
        cidade: string;
        bairro: string;
        rua: string;
        numero: string;
        complemento?: string;
    };
    formaPagamento: 'credito' | 'debito';
    pagamento: {
        token: string;
        bandeira: string;
        ultimosDigitos: string;
    };
}

export async function processarCheckoutAPI(payload: CheckoutPayload) {
    const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || 'Ocorreu um erro ao processar o cadastro e pagamento.'
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

export interface CadastroUsuarioPayload {
    nome: string;
    email: string;
    senha: string;
    dataNascimento: string;
    telefone: string;
    cpf?: string;
    sexo?: string;
    cargo?: 'ALUNO' | 'PROFISSIONAL' | 'ADMIN';
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