import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { vendaService } from '@/services/vendaService';
import { produtoService } from '@/services/produtoService';
import { Venda } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, ShoppingBag, Package } from 'lucide-react';
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type PeriodoType = 'hoje' | 'semana' | 'mes';

export const RelatoriosPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<PeriodoType>('hoje');

  useEffect(() => {
    carregarDados();
  }, [userData, periodo]);

  const getDataRange = () => {
    const hoje = new Date();
    
    switch (periodo) {
      case 'hoje':
        return {
          inicio: startOfDay(hoje),
          fim: endOfDay(hoje)
        };
      case 'semana':
        return {
          inicio: startOfWeek(hoje, { weekStartsOn: 0 }),
          fim: endOfWeek(hoje, { weekStartsOn: 0 })
        };
      case 'mes':
        return {
          inicio: startOfMonth(hoje),
          fim: endOfMonth(hoje)
        };
      default:
        return {
          inicio: startOfDay(hoje),
          fim: endOfDay(hoje)
        };
    }
  };

  const carregarDados = async () => {
    if (!userData?.barbeiroId) return;
    
    try {
      setLoading(true);
      const { inicio, fim } = getDataRange();
      const listaVendas = await vendaService.listarPorPeriodo(
        userData.barbeiroId,
        inicio,
        fim
      );
      setVendas(listaVendas);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cálculos
  const totalVendas = vendas.length;
  const valorTotalVendas = vendas.reduce((acc, v) => acc + v.valorTotal, 0);
  const ticketMedio = totalVendas > 0 ? valorTotalVendas / totalVendas : 0;

  // Vendas por forma de pagamento
  const vendasPorPagamento = vendas.reduce((acc, venda) => {
    acc[venda.pagamento] = (acc[venda.pagamento] || 0) + venda.valorTotal;
    return acc;
  }, {} as Record<string, number>);

  // Produtos mais vendidos
  const produtosMaisVendidos = vendas.reduce((acc, venda) => {
    venda.itens.forEach(item => {
      if (!acc[item.nome]) {
        acc[item.nome] = {
          quantidade: 0,
          valor: 0
        };
      }
      acc[item.nome].quantidade += item.quantidade;
      acc[item.nome].valor += item.subtotal;
    });
    return acc;
  }, {} as Record<string, { quantidade: number; valor: number }>);

  const topProdutos = Object.entries(produtosMaisVendidos)
    .sort((a, b) => b[1].valor - a[1].valor)
    .slice(0, 5);

  const formasPagamentoLabels: Record<string, string> = {
    DINHEIRO: '💵 Dinheiro',
    PIX: '📱 PIX',
    CREDITO: '💳 Crédito',
    DEBITO: '💳 Débito',
    TRANSFERENCIA: '🏦 Transferência',
    FIADO: '💰 Fiado',
    BITCOIN: '₿ Bitcoin'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando relatórios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Estatísticas</h1>
          <p className="text-muted-foreground">Análise de vendas e desempenho</p>
        </div>

        <Select value={periodo} onValueChange={(v) => setPeriodo(v as PeriodoType)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="semana">Esta Semana</SelectItem>
            <SelectItem value="mes">Este Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Vendas</p>
              <p className="text-2xl font-bold">{totalVendas}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold">R$ {valorTotalVendas.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="text-2xl font-bold">R$ {ticketMedio.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Package className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Produtos Vendidos</p>
              <p className="text-2xl font-bold">
                {vendas.reduce((acc, v) => acc + v.itens.reduce((a, i) => a + i.quantidade, 0), 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Forma de Pagamento */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Vendas por Forma de Pagamento</h2>
          
          {Object.keys(vendasPorPagamento).length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma venda neste período</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(vendasPorPagamento)
                .sort((a, b) => b[1] - a[1])
                .map(([forma, valor]) => {
                  const percentual = (valor / valorTotalVendas) * 100;
                  return (
                    <div key={forma}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">
                          {formasPagamentoLabels[forma] || forma}
                        </span>
                        <span className="text-sm font-bold">
                          R$ {valor.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {percentual.toFixed(1)}% do total
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>

        {/* Top 5 Produtos */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top 5 Produtos Mais Vendidos</h2>
          
          {topProdutos.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum produto vendido neste período</p>
          ) : (
            <div className="space-y-4">
              {topProdutos.map(([nome, dados], index) => (
                <div key={nome} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {dados.quantidade} unidades vendidas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">R$ {dados.valor.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Lista de Vendas Recentes */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Vendas Recentes</h2>
        
        {vendas.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma venda neste período</p>
        ) : (
          <div className="space-y-3">
            {vendas.slice(0, 10).map((venda) => (
              <div 
                key={venda.id} 
                className="flex justify-between items-center p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {venda.clienteNome || 'Cliente não informado'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(venda.data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formasPagamentoLabels[venda.pagamento]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">R$ {venda.valorTotal.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {venda.itens.length} {venda.itens.length === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
