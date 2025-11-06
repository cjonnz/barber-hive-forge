# 🔥 Nexus by Jon – Sistema de Gestão para Barbearias

Sistema SaaS completo e escalável para gestão de barbearias, desenvolvido com React + TypeScript + Firebase.

## 📋 Sobre o Projeto

O **Nexus by Jon** é uma plataforma industrial profissional que oferece:

- ✅ Gestão completa de agendamentos em tempo real
- ✅ Sistema de planos (Basic, Spark, Blaze)
- ✅ Painel administrativo para o proprietário da plataforma
- ✅ Painel individual para cada barbeiro
- ✅ Página pública de agendamento para clientes
- ✅ Autenticação e segurança Firebase
- ✅ Design dark industrial premium

## 🏗️ Arquitetura

### Stack Tecnológica

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS + shadcn/ui
- **Backend:** Firebase (Firestore + Authentication + Storage)
- **Animações:** Framer Motion
- **Roteamento:** React Router v6
- **Estado:** React Query (TanStack Query)

### Estrutura de Pastas

```
src/
├── components/         # Componentes reutilizáveis
│   ├── ui/            # Componentes shadcn/ui
│   ├── NexusLogo.tsx  # Logo da marca
│   └── LoadingScreen.tsx
├── config/            # Configurações
│   └── firebase.ts    # Firebase setup
├── hooks/             # Custom hooks
│   └── useAuth.tsx    # Hook de autenticação
├── layouts/           # Layouts da aplicação
│   └── DashboardLayout.tsx
├── pages/             # Páginas principais
│   ├── admin/         # Páginas do admin
│   ├── barbeiro/      # Páginas do barbeiro
│   └── Login.tsx
├── services/          # Serviços Firebase
│   ├── barbeiroService.ts
│   └── agendamentoService.ts
├── types/             # TypeScript types
│   └── index.ts
└── App.tsx            # App principal com rotas
```

## 🔐 Autenticação e Roles

O sistema possui dois tipos de usuário:

### 1. Admin (Jon - Proprietário)
- Email: `jon@nexus.com` ou `admin@nexus.com`
- Acesso total à plataforma
- Gerenciamento de barbeiros e planos

### 2. Barbeiro (Usuário autorizado)
- Cadastro vinculado ao Firestore
- Gestão de serviços e agendamentos próprios
- Dashboard personalizado

## 🗄️ Estrutura Firestore

### Collection: `barbeiros`

```typescript
{
  id: string,
  nomeCompleto: string,
  cpf: string,
  endereco: string,
  nomeEstabelecimento: string,
  fotoFachada?: string,
  telefone: string,
  email: string,
  servicos: [
    { nome: string, preco: number, duracao: number }
  ],
  plano: 'basic' | 'spark' | 'blaze',
  status: 'pendente' | 'aprovado' | 'ativo' | 'suspenso',
  dataCadastro: Timestamp,
  vencimentoPlano: Timestamp,
  pagamentoTipo: 'mensal' | 'semestral' | 'anual',
  modoTeste: boolean,
  linkPublico: string,
  linkPagamentoExterno?: string,
  totalAgendamentos: number
}
```

### Collection: `agendamentos`

```typescript
{
  id: string,
  barbeiroId: string,
  clienteNome: string,
  clienteWhatsapp: string,
  servico: string,
  data: Timestamp,
  hora: string,
  duracao: number,
  comentario?: string,
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado',
  criadoEm: Timestamp
}
```

## 🎨 Design System

O sistema utiliza um design system industrial dark com dourado:

### Cores Principais (HSL)

- **Background:** `0 0% 4%` (preto profundo)
- **Primary:** `45 79% 53%` (dourado vibrante)
- **Card:** `0 0% 8%` (cinza escuro)
- **Success:** `142 71% 45%`
- **Warning:** `38 92% 50%`
- **Info:** `204 70% 53%`

### Tipografia

- **UI:** Poppins (300, 400, 500, 600, 700)
- **Brand:** Playfair Display (400, 700)

## 🚀 Como Executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Firebase

O Firebase já está configurado em `src/config/firebase.ts`. Se necessário, atualize as credenciais.

### 3. Executar em desenvolvimento

```bash
npm run dev
```

### 4. Build para produção

```bash
npm run build
```

### 5. Deploy (Firebase Hosting)

```bash
npm run build
firebase deploy
```

## 📦 Planos Disponíveis

### Basic
- **Preço:** R$ 49,90/mês
- 100 agendamentos/mês
- Página pública de agendamento
- Gerenciamento de serviços
- Suporte por email

### Spark
- **Preço:** R$ 89,90/mês
- 300 agendamentos/mês
- Notificações WhatsApp
- Relatórios avançados
- Dashboard completo
- Suporte prioritário

### Blaze
- **Preço:** R$ 149,90/mês
- Agendamentos ilimitados
- API personalizada
- Múltiplos barbeiros
- White label
- Suporte 24/7

## 🔧 Serviços Firebase

### barbeiroService

```typescript
- criar(data): Promise<string>
- buscarPorId(id): Promise<Barbeiro | null>
- listarTodos(): Promise<Barbeiro[]>
- listarPorStatus(status): Promise<Barbeiro[]>
- atualizar(id, data): Promise<void>
- atualizarStatus(id, status): Promise<void>
- deletar(id): Promise<void>
- gerarLinkPublico(nome): string
```

### agendamentoService

```typescript
- criar(data): Promise<string>
- buscarPorId(id): Promise<Agendamento | null>
- listarPorBarbeiro(barbeiroId): Promise<Agendamento[]>
- listarPorStatusEBarbeiro(barbeiroId, status): Promise<Agendamento[]>
- listarTodos(): Promise<Agendamento[]>
- atualizar(id, data): Promise<void>
- atualizarStatus(id, status): Promise<void>
- verificarDisponibilidade(...): Promise<boolean>
```

## 🛣️ Rotas Principais

### Públicas
- `/login` - Tela de login

### Admin (Protegidas)
- `/admin` - Dashboard administrativo
- `/admin/barbeiros` - Gestão de barbeiros
- `/admin/agendamentos` - Todos os agendamentos
- `/admin/configuracoes` - Configurações da plataforma

### Barbeiro (Protegidas)
- `/barbeiro` - Dashboard do barbeiro
- `/barbeiro/agenda` - Agenda de agendamentos
- `/barbeiro/servicos` - Gerenciar serviços
- `/barbeiro/perfil` - Dados do perfil

### Pública (Futura)
- `/:linkPublico` - Página de agendamento do barbeiro

## 🔒 Segurança

- ✅ Autenticação Firebase Authentication
- ✅ Rotas protegidas por role
- ✅ Verificação de permissões server-side
- ✅ Regras Firestore Security Rules (configurar no Firebase Console)
- ✅ Validação de dados client e server-side

## 📱 Responsividade

O sistema é 100% responsivo:
- Mobile First
- Sidebar colapsável em mobile
- Cards adaptáveis
- Touch-friendly

## 🎯 Próximos Passos

### Implementações Prioritárias

1. **Página Pública de Agendamento**
   - Formulário de agendamento
   - Seleção de serviço e horário
   - Integração WhatsApp

2. **Sistema de Notificações**
   - Email via Firebase Functions
   - WhatsApp via API externa
   - Notificações push

3. **Relatórios e Analytics**
   - Gráficos de faturamento
   - Métricas de agendamentos
   - Exportação de dados

4. **Gestão Financeira**
   - Controle de vencimentos
   - Histórico de pagamentos
   - Links de pagamento

5. **Modo Multi-barbeiro**
   - Gestão de equipe (plano Blaze)
   - Agenda compartilhada
   - Permissões granulares

## 📞 Suporte

Sistema desenvolvido por **Jon**

---

© 2024 Nexus by Jon - Gestão Profissional para Barbearias
