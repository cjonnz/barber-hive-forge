// Tipos do sistema Nexus

export type UserRole = 'admin' | 'barbeiro';
export type BarbeiroStatus = 'pendente' | 'aprovado' | 'recusado' | 'ativo' | 'suspenso';
export type PlanoTipo = 'basico' | 'sparkle' | 'blaze' | 'teste';
export type PagamentoTipo = 'mensal' | 'semestral' | 'anual';
export type AgendamentoStatus = 'pendente' | 'confirmado' | 'concluido' | 'cancelado';

export interface Servico {
  nome: string;
  preco: number;
  duracao: number; // em minutos
}

export interface Barbeiro {
  id: string;
  nomeCompleto: string;
  cpf: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  nomeEstabelecimento: string;
  cnpj: string;
  quantidadeFuncionarios: number;
  fotoFachada?: string;
  telefone: string;
  email: string;
  servicos: Servico[];
  plano: PlanoTipo;
  status: BarbeiroStatus;
  dataCadastro: Date;
  dataAprovacao?: Date;
  dataInicioTeste?: Date;
  vencimentoPlano: Date;
  pagamentoTipo: PagamentoTipo;
  modoTeste: boolean;
  linkPublico: string;
  linkPagamentoExterno?: string;
  totalAgendamentos: number;
  motivoRecusa?: string;
}

export interface Agendamento {
  id: string;
  barbeiroId: string;
  clienteNome: string;
  clienteWhatsapp: string;
  servico: string;
  data: Date;
  hora: string;
  duracao: number;
  comentario?: string;
  status: AgendamentoStatus;
  criadoEm: Date;
}

export interface PlanoConfig {
  nome: PlanoTipo;
  label: string;
  agendamentosMensais: number;
  preco: {
    mensal: number;
    semestral: number;
    anual: number;
  };
  features: string[];
}

export const PLANOS: PlanoConfig[] = [
  {
    nome: 'basico',
    label: 'Básico',
    agendamentosMensais: 150,
    preco: {
      mensal: 29.99,
      semestral: 161.94,
      anual: 287.88
    },
    features: [
      'Até 150 agendamentos/mês',
      'Acesso à tela de agendamentos',
      'Sem relatórios ou estatísticas',
      'Suporte por email'
    ]
  },
  {
    nome: 'sparkle',
    label: 'Sparkle',
    agendamentosMensais: 250,
    preco: {
      mensal: 48.99,
      semestral: 264.54,
      anual: 470.30
    },
    features: [
      'Até 250 agendamentos/mês',
      'Controle de clientes',
      'Relatórios básicos',
      'Histórico de agendamentos',
      'Suporte prioritário'
    ]
  },
  {
    nome: 'blaze',
    label: 'Blaze',
    agendamentosMensais: -1, // ilimitado
    preco: {
      mensal: 65.00,
      semestral: 351.00,
      anual: 624.00
    },
    features: [
      'Agendamentos ilimitados',
      'Todas as funcionalidades',
      'Relatórios completos',
      'Controle de barbeiros',
      'Estatísticas detalhadas',
      'Personalização completa',
      'Suporte técnico prioritário'
    ]
  },
  {
    nome: 'teste',
    label: 'Teste Grátis',
    agendamentosMensais: 50,
    preco: {
      mensal: 0,
      semestral: 0,
      anual: 0
    },
    features: [
      'Válido por 5 dias',
      'Funcionalidades básicas',
      'Até 50 agendamentos',
      'Acesso limitado'
    ]
  }
];
