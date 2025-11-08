// Tipos do sistema Nexus

export type UserRole = 'admin' | 'barbeiro';
export type BarbeiroStatus = 'pendente' | 'aprovado' | 'recusado' | 'ativo' | 'suspenso';
export type PlanoTipo = 'basico' | 'sparkle' | 'blaze' | 'teste';
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
