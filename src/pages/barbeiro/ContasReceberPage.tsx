import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { contaReceberService } from '@/services/contaReceberService';
import { historicoService } from '@/services/historicoService';
import { ContaReceber } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ContasReceberPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [contas, setContas] = useState<ContaReceber[]>([]);
  const [loading, setLoading] = useState(true);
  const [contaSelecionada, setContaSelecionada] = useState<ContaReceber | null>(null);
  const [valorPagamento, setValorPagamento] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    carregarContas();
  }, [userData]);

  const carregarContas = async () => {
    if (!userData?.barbeiroId) return;
    
    try {
      setLoading(true);
      const listaContas = await contaReceberService.listar(userData.barbeiroId);
      setContas(listaContas);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as contas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirPagamento = (conta: ContaReceber) => {
    setContaSelecionada(conta);
    setValorPagamento(conta.valorRestante.toFixed(2));
    setDialogOpen(true);
  };

  const registrarPagamento = async () => {
    if (!userData?.barbeiroId || !contaSelecionada) return;

    const valor = parseFloat(valorPagamento);
    if (isNaN(valor) || valor <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Informe um valor válido para o pagamento',
        variant: 'destructive'
      });
      return;
    }

    if (valor > contaSelecionada.valorRestante) {
      toast({
        title: 'Valor excedente',
        description: `Valor restante: R$ ${contaSelecionada.valorRestante.toFixed(2)}`,
        variant: 'destructive'
      });
      return;
    }

    try {
      await contaReceberService.registrarPagamento(
        userData.barbeiroId,
        contaSelecionada.id,
        valor
      );

      await historicoService.criar(userData.barbeiroId, {
        tipo: 'pagamento',
        descricao: `Pagamento recebido de ${contaSelecionada.clienteNome}`,
        data: new Date(),
        valor
      });

      toast({
        title: 'Pagamento registrado!',
        description: `R$ ${valor.toFixed(2)} recebido`
      });

      setDialogOpen(false);
      setContaSelecionada(null);
      setValorPagamento('');
      carregarContas();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar o pagamento',
        variant: 'destructive'
      });
    }
  };

  const contasPendentes = contas.filter(c => c.status !== 'Pago');
  const contasPagas = contas.filter(c => c.status === 'Pago');
  const totalPendente = contasPendentes.reduce((acc, c) => acc + c.valorRestante, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando contas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contas a Receber</h1>
        <p className="text-muted-foreground">Controle de vendas fiadas e pagamentos</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pendente</p>
              <p className="text-2xl font-bold">R$ {totalPendente.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Calendar className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contas Pendentes</p>
              <p className="text-2xl font-bold">{contasPendentes.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contas Pagas</p>
              <p className="text-2xl font-bold">{contasPagas.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contas Pendentes */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pendentes</h2>
        {contasPendentes.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhuma conta pendente</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contasPendentes.map((conta, index) => (
              <motion.div
                key={conta.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{conta.clienteNome}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(conta.dataVenda, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant={conta.status === 'Pendente' ? 'destructive' : 'secondary'}>
                      {conta.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor Total:</span>
                      <span className="font-semibold">R$ {conta.valorTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor Pago:</span>
                      <span className="text-green-600 font-semibold">
                        R$ {conta.valorPago.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor Restante:</span>
                      <span className="text-red-600 font-bold">
                        R$ {conta.valorRestante.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => abrirPagamento(conta)}
                    className="w-full"
                  >
                    Registrar Pagamento
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Contas Pagas */}
      {contasPagas.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Pagas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contasPagas.map((conta, index) => (
              <motion.div
                key={conta.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{conta.clienteNome}</h4>
                      <p className="text-xs text-muted-foreground">
                        {format(conta.dataVenda, 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10">
                      Pago
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold mt-2">
                    R$ {conta.valorTotal.toFixed(2)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Dialog de Pagamento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>

          {contaSelecionada && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-semibold">{contaSelecionada.clienteNome}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Valor Total</p>
                  <p className="font-semibold">R$ {contaSelecionada.valorTotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Já Pago</p>
                  <p className="font-semibold text-green-600">
                    R$ {contaSelecionada.valorPago.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Valor Restante</p>
                <p className="text-xl font-bold text-red-600">
                  R$ {contaSelecionada.valorRestante.toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorPagamento">Valor do Pagamento *</Label>
                <Input
                  id="valorPagamento"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={contaSelecionada.valorRestante}
                  value={valorPagamento}
                  onChange={(e) => setValorPagamento(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={registrarPagamento}
                  className="flex-1"
                >
                  Confirmar Pagamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
