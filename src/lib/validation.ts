import { z } from 'zod';

// Validation schemas for input sanitization and security

export const vendaSchema = z.object({
  clienteNome: z.string().trim().max(100, 'Nome muito longo').optional(),
  observacao: z.string().trim().max(500, 'Observação muito longa').optional(),
  chavePix: z.string().trim().max(100, 'Chave PIX muito longa').optional(),
  nomeBanco: z.string().trim().max(100, 'Nome do banco muito longo').optional(),
  enderecoCarteira: z.string().trim().max(100, 'Endereço de carteira muito longo').optional(),
  valorTotal: z.number().positive('Valor deve ser positivo').max(1000000, 'Valor muito alto')
});

export const produtoSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatório').max(100, 'Nome muito longo'),
  descricao: z.string().trim().max(500, 'Descrição muito longa').optional(),
  precoCusto: z.number().min(0, 'Preço de custo inválido').max(1000000, 'Valor muito alto'),
  precoVenda: z.number().positive('Preço de venda deve ser positivo').max(1000000, 'Valor muito alto'),
  quantidade: z.number().int('Quantidade deve ser inteiro').min(0, 'Quantidade inválida').max(1000000, 'Quantidade muito alta'),
  estoqueMinimo: z.number().int('Estoque mínimo deve ser inteiro').min(0, 'Estoque mínimo inválido').max(10000, 'Estoque mínimo muito alto'),
  categoria: z.string().trim().max(50, 'Categoria muito longa').optional(),
  codigoBarras: z.string().trim().max(50, 'Código de barras muito longo').optional()
});

export const pagamentoSchema = z.object({
  valor: z.number().positive('Valor deve ser positivo').max(1000000, 'Valor muito alto'),
  observacao: z.string().trim().max(500, 'Observação muito longa').optional()
});

export const agendamentoSchema = z.object({
  clienteNome: z.string().trim().min(1, 'Nome obrigatório').max(100, 'Nome muito longo'),
  clienteTelefone: z.string().trim().min(10, 'Telefone inválido').max(20, 'Telefone muito longo'),
  servico: z.string().trim().min(1, 'Serviço obrigatório').max(100, 'Serviço muito longo'),
  observacoes: z.string().trim().max(500, 'Observações muito longas').optional(),
  duracao: z.number().int('Duração deve ser inteiro').min(15, 'Duração mínima 15min').max(480, 'Duração muito longa')
});

export type VendaInput = z.infer<typeof vendaSchema>;
export type ProdutoInput = z.infer<typeof produtoSchema>;
export type PagamentoInput = z.infer<typeof pagamentoSchema>;
export type AgendamentoInput = z.infer<typeof agendamentoSchema>;
