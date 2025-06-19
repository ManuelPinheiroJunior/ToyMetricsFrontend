import axios from 'axios';
import type { Cliente, ClientesResponse, EstatisticasResponse, LoginCredentials } from '../types';

// Função para normalizar dados dos clientes
export const normalizarCliente = (clienteResponse: any): Cliente => {
  // Verificar se é o formato aninhado (do backend formatado)
  if (clienteResponse.info && clienteResponse.info.nomeCompleto) {
    const nomeCompleto = clienteResponse.info.nomeCompleto;
    const email = clienteResponse.info.detalhes.email;
    const nascimento = clienteResponse.info.detalhes.nascimento;
    const vendas = clienteResponse.estatisticas.vendas || [];

    // Calcular primeira letra faltante
    const primeiraLetraFaltante = calcularPrimeiraLetraFaltante(nomeCompleto);

    return {
      id: Math.random().toString(36).substr(2, 9), // Gerar ID único
      nomeCompleto,
      email,
      nascimento,
      vendas,
      primeiraLetraFaltante
    };
  }
  
  // Formato direto do backend (quando retorna customer direto)
  const nomeCompleto = clienteResponse.name || clienteResponse.nomeCompleto;
  const email = clienteResponse.email;
  const nascimento = clienteResponse.birthDate || clienteResponse.nascimento;
  const vendas = clienteResponse.sales?.map((sale: any) => ({
    data: sale.saleDate || sale.data,
    valor: sale.amount || sale.valor
  })) || [];

  // Calcular primeira letra faltante
  const primeiraLetraFaltante = calcularPrimeiraLetraFaltante(nomeCompleto);

  return {
    id: clienteResponse.id?.toString() || Math.random().toString(36).substr(2, 9),
    nomeCompleto,
    email,
    nascimento,
    vendas,
    primeiraLetraFaltante
  };
};

// Função para calcular a primeira letra faltante no alfabeto
export const calcularPrimeiraLetraFaltante = (nome: string): string => {
  const alfabeto = 'abcdefghijklmnopqrstuvwxyz';
  const nomeLower = nome.toLowerCase();
  
  for (let letra of alfabeto) {
    if (!nomeLower.includes(letra)) {
      return letra.toUpperCase();
    }
  }
  
  return '-'; // Todas as letras estão presentes
};

// Configuração do axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviços da API
export const apiService = {
  // Autenticação
  async login(credentials: LoginCredentials): Promise<{ token: string; user: any }> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  },

  // Registro de usuário
  async register(userData: {
    username: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    password: string;
  }): Promise<any> {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao criar conta');
    }
  },

  // Obter lista de clientes
  async getClientes(filtros?: { nome?: string; email?: string }): Promise<Cliente[]> {
    try {
      const params = new URLSearchParams();
      if (filtros?.nome) params.append('name', filtros.nome);
      if (filtros?.email) params.append('email', filtros.email);

      const response = await api.get(`/customers?${params.toString()}`);
      const clientesResponse: ClientesResponse = response.data;
      
      return clientesResponse.data.clientes.map(normalizarCliente);
    } catch (error) {
      throw new Error('Erro ao carregar clientes');
    }
  },

  // Criar novo cliente
  async createCliente(cliente: Omit<Cliente, 'id' | 'vendas' | 'primeiraLetraFaltante'>): Promise<Cliente> {
    try {
      const clienteData = {
        name: cliente.nomeCompleto,
        email: cliente.email,
        birthDate: cliente.nascimento
      };

      const response = await api.post('/customers', clienteData);
      
      // Criar objeto cliente normalizado
      return {
        id: response.data.id?.toString() || Math.random().toString(36).substr(2, 9),
        nomeCompleto: cliente.nomeCompleto,
        email: cliente.email,
        nascimento: cliente.nascimento,
        vendas: [],
        primeiraLetraFaltante: calcularPrimeiraLetraFaltante(cliente.nomeCompleto)
      };
    } catch (error) {
      throw new Error('Erro ao criar cliente');
    }
  },

  // Atualizar cliente
  async updateCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    try {
      const clienteData = {
        name: cliente.nomeCompleto,
        email: cliente.email,
        birthDate: cliente.nascimento
      };

      await api.patch(`/customers/${id}`, clienteData);
      
      // Criar objeto cliente normalizado
      return {
        id: id,
        nomeCompleto: cliente.nomeCompleto || '',
        email: cliente.email || '',
        nascimento: cliente.nascimento || '',
        vendas: cliente.vendas || [],
        primeiraLetraFaltante: cliente.nomeCompleto ? calcularPrimeiraLetraFaltante(cliente.nomeCompleto) : 'X'
      };
    } catch (error) {
      throw new Error('Erro ao atualizar cliente');
    }
  },

  // Deletar cliente
  async deleteCliente(id: string): Promise<void> {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error) {
      throw new Error('Erro ao deletar cliente');
    }
  },

  // Obter estatísticas
  async getEstatisticas(): Promise<EstatisticasResponse> {
    try {
      // Buscar estatísticas de vendas diárias
      const dailyStatsResponse = await api.get('/sales/stats/daily');
      const dailyStats = dailyStatsResponse.data;

      // Buscar estatísticas dos clientes
      const customerStatsResponse = await api.get('/sales/stats/customers');
      const customerStats = customerStatsResponse.data;

      // Buscar dados completos dos clientes para as estatísticas
      const clientesResponse = await api.get('/customers');
      const clientes = clientesResponse.data.data.clientes;

      // Encontrar os clientes específicos para as estatísticas
      const clienteMaiorVolume = clientes.find((c: any) => 
        c.info.nomeCompleto === customerStats.topVolumeCustomer?.name
      );
      
      const clienteMaiorMedia = clientes.find((c: any) => 
        c.info.nomeCompleto === customerStats.topAverageCustomer?.name
      );
      
      const clienteMaiorFrequencia = clientes.find((c: any) => 
        c.info.nomeCompleto === customerStats.topFrequencyCustomer?.name
      );

      const estatisticas = {
        totalVendasPorDia: dailyStats.map((item: any) => ({
          data: item.date,
          total: item.total
        })),
        clienteMaiorVolume: clienteMaiorVolume ? normalizarCliente(clienteMaiorVolume) : {
          id: "1",
          nomeCompleto: customerStats.topVolumeCustomer?.name || "N/A",
          email: "",
          nascimento: "",
          vendas: [],
          primeiraLetraFaltante: "X"
        },
        clienteMaiorMedia: clienteMaiorMedia ? normalizarCliente(clienteMaiorMedia) : {
          id: "2",
          nomeCompleto: customerStats.topAverageCustomer?.name || "N/A",
          email: "",
          nascimento: "",
          vendas: [],
          primeiraLetraFaltante: "X"
        },
        clienteMaiorFrequencia: clienteMaiorFrequencia ? normalizarCliente(clienteMaiorFrequencia) : {
          id: "3",
          nomeCompleto: customerStats.topFrequencyCustomer?.name || "N/A",
          email: "",
          nascimento: "",
          vendas: [],
          primeiraLetraFaltante: "X"
        }
      };

      return estatisticas;
    } catch (error) {
      throw new Error('Erro ao carregar estatísticas');
    }
  }
};

export default api; 