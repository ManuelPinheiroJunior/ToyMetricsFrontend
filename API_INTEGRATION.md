# Integração com API Real

Este documento explica como integrar o frontend com uma API real, substituindo os mocks atuais.

## 🔄 Substituindo os Mocks

### 1. Configuração da URL da API

No arquivo `src/services/api.ts`, atualize a URL base:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Altere para sua URL real
  timeout: 10000,
});
```

### 2. Endpoints Necessários

A API deve implementar os seguintes endpoints:

#### Autenticação
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@toymetrics.com",
  "password": "admin123"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "email": "admin@toymetrics.com",
    "role": "admin"
  }
}
```

#### Clientes
```http
GET /clientes?nome=Ana&email=ana@example.com
Authorization: Bearer <token>

Response:
{
  "data": {
    "clientes": [
      {
        "info": {
          "nomeCompleto": "Ana Beatriz",
          "detalhes": {
            "email": "ana.b@example.com",
            "nascimento": "1992-05-01"
          }
        },
        "estatisticas": {
          "vendas": [
            { "data": "2024-01-01", "valor": 150 },
            { "data": "2024-01-02", "valor": 50 }
          ]
        }
      }
    ]
  },
  "meta": {
    "registroTotal": 1,
    "pagina": 1
  }
}
```

```http
POST /clientes
Authorization: Bearer <token>
Content-Type: application/json

{
  "nomeCompleto": "Novo Cliente",
  "email": "novo@example.com",
  "nascimento": "1990-01-01"
}
```

```http
PUT /clientes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nomeCompleto": "Cliente Atualizado",
  "email": "atualizado@example.com",
  "nascimento": "1990-01-01"
}
```

```http
DELETE /clientes/:id
Authorization: Bearer <token>
```

#### Estatísticas
```http
GET /estatisticas
Authorization: Bearer <token>

Response:
{
  "totalVendasPorDia": [
    { "data": "2024-01-01", "total": 550 },
    { "data": "2024-01-02", "total": 375 }
  ],
  "clienteMaiorVolume": {
    "id": "1",
    "nomeCompleto": "Maria Silva",
    "email": "maria.s@example.com",
    "nascimento": "1995-03-20",
    "vendas": [
      { "data": "2024-01-02", "valor": 250 },
      { "data": "2024-01-03", "valor": 180 }
    ]
  },
  "clienteMaiorMedia": {
    "id": "2",
    "nomeCompleto": "Carlos Eduardo",
    "email": "cadu@example.com",
    "nascimento": "1987-08-15",
    "vendas": [
      { "data": "2024-01-01", "valor": 300 },
      { "data": "2024-01-04", "valor": 120 }
    ]
  },
  "clienteMaiorFrequencia": {
    "id": "3",
    "nomeCompleto": "Maria Silva",
    "email": "maria.s@example.com",
    "nascimento": "1995-03-20",
    "vendas": [
      { "data": "2024-01-02", "valor": 250 },
      { "data": "2024-01-03", "valor": 180 },
      { "data": "2024-01-04", "valor": 90 },
      { "data": "2024-01-05", "valor": 160 },
      { "data": "2024-01-06", "valor": 220 }
    ]
  }
}
```

### 3. Tratamento de Erros

Atualize o serviço de API para incluir tratamento de erros:

```typescript
// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4. Validação de Resposta

Adicione validação para garantir que a API retorna os dados no formato esperado:

```typescript
const validateClienteResponse = (data: any): Cliente => {
  if (!data.info?.nomeCompleto || !data.info?.detalhes?.email) {
    throw new Error('Dados do cliente inválidos');
  }
  
  return normalizarCliente(data);
};
```

## 🔧 Configuração de Ambiente

Crie um arquivo `.env` para configurações:

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=ToyMetrics
```

E atualize o serviço:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});
```

## 🧪 Testes

Para testar a integração:

1. **Teste de Conectividade**
```bash
curl -X GET http://localhost:3001/api/health
```

2. **Teste de Autenticação**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@toymetrics.com","password":"admin123"}'
```

3. **Teste de Clientes**
```bash
curl -X GET http://localhost:3001/api/clientes \
  -H "Authorization: Bearer <seu-token>"
```

## 📝 Notas Importantes

- **CORS**: Certifique-se de que o backend permite requisições do frontend
- **Autenticação**: Implemente JWT ou outro método de autenticação
- **Validação**: Valide dados tanto no frontend quanto no backend
- **Cache**: Considere implementar cache para melhorar performance
- **Loading States**: Mantenha os estados de loading para melhor UX

## 🚀 Deploy

Para fazer deploy:

1. **Build de Produção**
```bash
npm run build
```

2. **Configurar Variáveis de Ambiente**
```bash
VITE_API_URL=https://sua-api.com/api
```

3. **Servir Arquivos Estáticos**
```bash
npm run preview
```

O frontend está pronto para integração com qualquer API que siga o formato especificado! 