// Tipos do sistema Nexus

export type UserRole = 'admin' | 'barbeiro';
export type BarbeiroStatus = 'pendente' | 'aprovado' | 'recusado' | 'ativo' | 'suspenso';
export type PlanoTipo = 'agenda' | 'sparkle' | 'blaze' | 'pro' | 'teste';
export type PagamentoTipo = 'mensal' | 'semestral' | 'anual';
export type AgendamentoStatus = 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
export type FormaPagamentoVenda = 'DINHEIRO' | 'PIX' | 'CREDITO' | 'DEBITO' | 'TRANSFERENCIA' | 'FIADO' | 'BITCOIN';
export type StatusVenda = 'Concluído' | 'Pendente' | 'Cancelado';
export type StatusContaReceber = 'Pendente' | 'Pago Parcial' | 'Pago';
export type RegimeFiscal = 'autonomo' | 'mei' | 'simples';

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

export interface Produto {
  id: string;
  barbeiroId: string;
  nome: string;
  categoria: string;
  fornecedor?: string;
  precoCompra: number;
  precoVenda: number;
  quantidade: number;
  estoqueMinimo: number;
  validade?: string;
  ativo: boolean;
  criadoEm: Date;
}

export interface ItemVenda {
  produtoId: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
}

export interface Venda {
  id: string;
  barbeiroId: string;
  data: Date;
  itens: ItemVenda[];
  valorTotal: number;
  pagamento: FormaPagamentoVenda;
  status: StatusVenda;
  clienteId?: string;
  clienteNome?: string;
  barbeiro?: string;
  observacao?: string;
  chavePix?: string;
  nomeBanco?: string;
  enderecoCarteira?: string;
}

export interface ContaReceber {
  id: string;
  barbeiroId: string;
  vendaId: string;
  clienteId?: string;
  clienteNome: string;
  valorTotal: number;
  valorPago: number;
  valorRestante: number;
  status: StatusContaReceber;
  dataVenda: Date;
  dataPagamento?: Date;
  observacao?: string;
}

export interface HistoricoLog {
  id: string;
  barbeiroId: string;
  tipo: 'estoque' | 'venda' | 'pagamento' | 'configuracao';
  descricao: string;
  data: Date;
  produto?: string;
  valor?: number;
}

export interface AdminPerfil {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  whatsapp?: string;
  cargo?: string;
  bio?: string;
  fotoUrl?: string;
  notificacoesEmail: boolean;
  notificacoesWhatsapp: boolean;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

export interface SistemaConfiguracao {
  sistemaEmail: string;
  emailSMTP: string;
  whatsappAPI: string;
  backupAutomatico: boolean;
  notificacoesEmail: boolean;
  notificacoesWhatsApp: boolean;
  autenticacaoDoisFatores?: boolean;
  logsAtivos?: boolean;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

export interface ConfiguracaoBarbearia {
  barbeiroId: string;
  moduloLojaAtivo: boolean; // Habilita funcionalidades de loja (vendas, produtos, estoque)
  dadosGerais: {
    nomeBarbearia: string;
    cpfResponsavel: string;
    cnpj: string;
    endereco: string;
    whatsapp: string;
    email: string;
    qtdFuncionarios: number;
  };
  agenda: {
    diasAtivos: string[];
    horarioInicio: string;
    horarioFim: string;
    intervalo: number;
    almoco: string;
    bloqueios: string[];
  };
  servicos: Servico[];
  pagamentos: {
    aceitaPix: boolean;
    chavePix?: string;
    aceitaFiado: boolean;
    limiteFiado: number;
  };
  fiscal: {
    diaFechamento: number;
    regime: RegimeFiscal;
    aliquota: number;
  };
  preferencias: {
    tema: 'light' | 'dark';
    alertaEstoqueMinimo: number;
  };
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
    nome: 'agenda',
    label: 'Agenda Plan',
    agendamentosMensais: 250,
    preco: {
      mensal: 29.99,
      semestral: 161.94,
      anual: 287.88
    },
    features: [
      'Até 250 agendamentos/mês',
      'Compre agendamentos extras quando precisar',
      'Sistema de agenda completo',
      'Cadastro e gestão de serviços',
      'Link público personalizado',
      'Notificações automáticas',
      'Ideal para barbearias SEM loja',
      'Suporte por email'
    ]
  },
  {
    nome: 'sparkle',
    label: 'Sparkle',
    agendamentosMensais: 350,
    preco: {
      mensal: 38.90,
      semestral: 210.06,
      anual: 373.44
    },
    features: [
      'Até 350 agendamentos/mês',
      'Compre agendamentos extras',
      'Módulo de loja opcional',
      'Controle de clientes',
      'Cadastro de serviços',
      'Histórico de agendamentos',
      'Relatórios básicos',
      'Suporte prioritário'
    ]
  },
  {
    nome: 'blaze',
    label: 'Blaze',
    agendamentosMensais: 500,
    preco: {
      mensal: 69.00,
      semestral: 372.60,
      anual: 662.40
    },
    features: [
      'Até 500 agendamentos/mês',
      'Compre agendamentos extras',
      'Módulo de loja completo',
      'Controle de estoque',
      'Sistema de vendas completo',
      'Contas a receber (fiado)',
      'Relatórios avançados',
      'Estatísticas detalhadas',
      'Suporte prioritário'
    ]
  },
  {
    nome: 'pro',
    label: 'Pro',
    agendamentosMensais: -1,
    preco: {
      mensal: 97.50,
      semestral: 526.50,
      anual: 936.00
    },
    features: [
      '✨ Agendamentos ILIMITADOS',
      'Todas as funcionalidades',
      'Controle de múltiplos barbeiros',
      'Gestão financeira completa',
      'Relatórios e análises avançadas',
      'Personalização total do sistema',
      'Suporte técnico VIP',
      'Prioridade em novas funcionalidades'
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
