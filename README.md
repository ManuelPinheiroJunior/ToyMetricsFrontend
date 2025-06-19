# ToyMetrics - Sistema de Gestão de Clientes

Sistema completo de gestão de clientes para uma loja de brinquedos, desenvolvido com React, TypeScript e Vite.

## 🚀 Funcionalidades

### Frontend
- ✅ **Autenticação simples** com credenciais mockadas
- ✅ **Dashboard com estatísticas** e gráficos interativos
- ✅ **Gestão completa de clientes** (CRUD)
- ✅ **Filtros por nome e email**
- ✅ **Interface responsiva** e moderna
- ✅ **Normalização de dados** da API
- ✅ **Cálculo da primeira letra faltante** no alfabeto para cada cliente

### Estatísticas e Gráficos
- 📊 **Gráfico de vendas por dia** usando Recharts
- 🏆 **Destaque dos melhores clientes**:
  - Cliente com maior volume de vendas
  - Cliente com maior média de valor por venda
  - Cliente com maior frequência de compras

## 🛠️ Tecnologias Utilizadas

- **React 19** com TypeScript
- **Vite** para build e desenvolvimento
- **React Router** para navegação
- **Bootstrap 5** para estilização
- **Recharts** para gráficos
- **Lucide React** para ícones
- **Axios** para requisições HTTP

## 📸 Imagens do Projeto

### Login
![Login](https://images-pinheiro.s3.us-east-2.amazonaws.com/Login.png)

### Dashboard
![Dashboard](https://images-pinheiro.s3.us-east-2.amazonaws.com/Dashboard.png)

### Cadastro (Signup)
![Cadastro](https://images-pinheiro.s3.us-east-2.amazonaws.com/Singup.png)

### Tabela de Clientes
![Tabela de Clientes](https://images-pinheiro.s3.us-east-2.amazonaws.com/TabelaClientes.png)

### Cadastro de Cliente
![Cadastro de Cliente](https://images-pinheiro.s3.us-east-2.amazonaws.com/CadastroCliente.png)

## 📦 Instalação e Execução

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd ToyMetrics
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npm run dev
```

4. **Acesse a aplicação**
```
http://localhost:5173
```

## 🔐 Credenciais de Acesso

Para acessar o sistema, use as seguintes credenciais:
- **Email:** `admin@toymetrics.com`
- **Senha:** `admin123`

## 📊 Estrutura de Dados

O sistema trabalha com dados mockados que simulam a estrutura da API:

```json
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
  }
}
```

## 🎯 Funcionalidades Implementadas

### Normalização de Dados
- Extração correta dos dados da estrutura aninhada da API
- Ignora campos duplicados e redundantes
- Calcula automaticamente a primeira letra faltante no alfabeto

### Interface do Usuário
- **Login responsivo** com validação
- **Dashboard** com cards de estatísticas e gráficos
- **Lista de clientes** com filtros e ações
- **Formulário** para adicionar/editar clientes
- **Layout responsivo** com sidebar

### Autenticação
- Sistema de login simples com localStorage
- Rotas protegidas
- Redirecionamento automático

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ClienteForm.tsx
│   ├── ClientesList.tsx
│   ├── Dashboard.tsx
│   ├── Layout.tsx
│   └── Login.tsx
├── contexts/           # Contextos React
│   └── AuthContext.tsx
├── services/           # Serviços e APIs
│   └── api.ts
├── types/              # Definições TypeScript
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 Design System

O projeto utiliza Bootstrap 5 com:
- Componentes nativos do Bootstrap
- Sistema de grid responsivo
- Classes utilitárias
- Ícones do Lucide React
- Cores e estilos customizados

## 🚀 Próximos Passos

Para integrar com uma API real:
1. Atualizar a URL base no arquivo `src/services/api.ts`
2. Implementar endpoints reais no backend
3. Configurar autenticação JWT real
4. Adicionar tratamento de erros mais robusto

## 📄 Licença

Este projeto foi desenvolvido como parte de um teste técnico para avaliação de domínio de stack, boas práticas, raciocínio lógico e estruturação.
