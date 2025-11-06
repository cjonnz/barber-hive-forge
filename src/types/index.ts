// Tipos do sistema Nexus

export type UserRole = 'admin' | 'barbeiro';
export type BarbeiroStatus = 'pendente' | 'aprovado' | 'ativo' | 'suspenso';
export type PlanoTipo = 'basic' | 'spark' | 'blaze';
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
  endereco: string;
  nomeEstabelecimento: string;
  fotoFachada?: string;
  telefone: string;
  email: string;
  servicos: Servico[];
  plano: PlanoTipo;
  status: BarbeiroStatus;
  dataCadastro: Date;
  vencimentoPlano: Date;
  pagamentoTipo: PagamentoTipo;
  modoTeste: boolean;
  linkPublico: string;
  linkPagamentoExterno?: string;
  totalAgendamentos: number;
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
    nome: 'basic',
    label: 'Basic',
    agendamentosMensais: 100,
    preco: {
      mensal: 49.90,
      semestral: 269.40,
      anual: 479.04
    },
    features: [
      'Até 100 agendamentos/mês',
      'Página pública de agendamento',
      'Gerenciamento de serviços',
      'Suporte por email'
    ]
  },
  {
    nome: 'spark',
    label: 'Spark',
    agendamentosMensais: 300,
    preco: {
      mensal: 89.90,
      semestral: 485.46,
      anual: 863.04
    },
    features: [
      'Até 300 agendamentos/mês',
      'Notificações WhatsApp',
      'Relatórios avançados',
      'Dashboard completo',
      'Suporte prioritário'
    ]
  },
  {
    nome: 'blaze',
    label: 'Blaze',
    agendamentosMensais: -1, // ilimitado
    preco: {
      mensal: 149.90,
      semestral: 809.46,
      anual: 1439.04
    },
    features: [
      'Agendamentos ilimitados',
      'API personalizada',
      'Múltiplos barbeiros',
      'White label',
      'Suporte 24/7'
    ]
  }
];
