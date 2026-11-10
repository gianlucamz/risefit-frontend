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
        if (Array.isArray(mensagem) && mensagem.every((item) => typeof item === 'string')) {
            return mensagem.join(' ');
        }
    }

    return `Não foi possível concluir a solicitação (HTTP ${status}).`;
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