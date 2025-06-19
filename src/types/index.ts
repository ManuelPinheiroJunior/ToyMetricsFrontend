export interface Cliente {
  id?: string;
  nomeCompleto: string;
  email: string;
  nascimento: string;
  vendas: Venda[];
  primeiraLetraFaltante?: string;
}

export interface Venda {
  data: string;
  valor: number;
}

export interface ClienteResponse {
  info: {
    nomeCompleto: string;
    detalhes: {
      email: string;
      nascimento: string;
    };
  };
  estatisticas: {
    vendas: Venda[];
  };
  duplicado?: {
    nomeCompleto: string;
  };
}

export interface ClientesResponse {
  data: {
    clientes: ClienteResponse[];
  };
  meta: {
    registroTotal: number;
    pagina: number;
  };
  redundante: {
    status: string;
  };
}

export interface EstatisticasResponse {
  totalVendasPorDia: { data: string; total: number }[];
  clienteMaiorVolume: Cliente;
  clienteMaiorMedia: Cliente;
  clienteMaiorFrequencia: Cliente;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  user: any;
} 