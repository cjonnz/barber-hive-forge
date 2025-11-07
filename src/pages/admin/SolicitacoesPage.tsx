import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { barbeiroService } from '@/services/barbeiroService';
import { Barbeiro } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const SolicitacoesPage = () => {
  const [solicitacoes, setSolicitacoes] = useState<Barbeiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<Barbeiro | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRecusaDialog, setShowRecusaDialog] = useState(false);
  const [motivoRecusa, setMotivoRecusa] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    try {
      const lista = await barbeiroService.listarPorStatus('pendente');
      setSolicitacoes(lista);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (barbeiro: Barbeiro) => {
    setActionLoading(true);
    try {
      await barbeiroService.atualizar(barbeiro.id, {
        status: 'ativo',
        dataAprovacao: new Date(),
        modoTeste: barbeiro.plano === 'teste',
        dataInicioTeste: barbeiro.plano === 'teste' ? new Date() : undefined,
        vencimentoPlano: barbeiro.plano === 'teste' 
          ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 dias
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
      });
      
      toast.success(`Barbearia "${barbeiro.nomeEstabelecimento}" aprovada com sucesso!`);
      carregarSolicitacoes();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      toast.error('Erro ao aprovar solicitação');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecusar = async () => {
    if (!selectedBarbeiro || !motivoRecusa.trim()) {
      toast.error('Informe o motivo da recusa');
      return;
    }

    setActionLoading(true);
    try {
      await barbeiroService.atualizar(selectedBarbeiro.id, {
        status: 'recusado',
        motivoRecusa: motivoRecusa
      });
      
      toast.success('Solicitação recusada');
      setShowRecusaDialog(false);
      setMotivoRecusa('');
      setSelectedBarbeiro(null);
      carregarSolicitacoes();
    } catch (error) {
      console.error('Erro ao recusar:', error);
      toast.error('Erro ao recusar solicitação');
    } finally {
      setActionLoading(false);
    }
  };

  const solicitacoesFiltradas = solicitacoes.filter(s => 
    s.nomeEstabelecimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cnpj.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  Solicitações de Cadastro
                </CardTitle>
                <CardDescription>
                  Gerencie as solicitações de novas barbearias
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {solicitacoes.length} pendente{solicitacoes.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome, e-mail ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tabela */}
            {solicitacoesFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  {searchTerm ? 'Nenhuma solicitação encontrada' : 'Nenhuma solicitação pendente'}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Barbearia</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoesFiltradas.map((solicitacao) => (
                      <TableRow key={solicitacao.id}>
                        <TableCell className="font-medium">
                          {solicitacao.nomeCompleto}
                        </TableCell>
                        <TableCell>{solicitacao.nomeEstabelecimento}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {solicitacao.cnpj}
                        </TableCell>
                        <TableCell>{solicitacao.email}</TableCell>
                        <TableCell>
                          <Badge variant={solicitacao.plano === 'blaze' ? 'default' : 'secondary'}>
                            {solicitacao.plano}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(solicitacao.dataCadastro, 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedBarbeiro(solicitacao);
                                setShowDetailsDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleAprovar(solicitacao)}
                              disabled={actionLoading}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedBarbeiro(solicitacao);
                                setShowRecusaDialog(true);
                              }}
                              disabled={actionLoading}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Recusar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog de Detalhes */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações completas do cadastro
            </DialogDescription>
          </DialogHeader>
          {selectedBarbeiro && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome Completo</Label>
                  <p className="font-medium">{selectedBarbeiro.nomeCompleto}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CPF</Label>
                  <p className="font-medium font-mono">{selectedBarbeiro.cpf}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Endereço Completo</Label>
                <p className="font-medium">
                  {selectedBarbeiro.endereco.rua}, {selectedBarbeiro.endereco.numero} - {selectedBarbeiro.endereco.bairro}
                  <br />
                  {selectedBarbeiro.endereco.cidade}/{selectedBarbeiro.endereco.estado} - CEP: {selectedBarbeiro.endereco.cep}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome do Estabelecimento</Label>
                  <p className="font-medium">{selectedBarbeiro.nomeEstabelecimento}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CNPJ</Label>
                  <p className="font-medium font-mono">{selectedBarbeiro.cnpj}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Quantidade de Funcionários</Label>
                  <p className="font-medium">{selectedBarbeiro.quantidadeFuncionarios}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{selectedBarbeiro.telefone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">E-mail</Label>
                  <p className="font-medium">{selectedBarbeiro.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Plano Selecionado</Label>
                  <Badge variant={selectedBarbeiro.plano === 'blaze' ? 'default' : 'secondary'}>
                    {selectedBarbeiro.plano}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Data da Solicitação</Label>
                <p className="font-medium">
                  {format(selectedBarbeiro.dataCadastro, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Recusa */}
      <Dialog open={showRecusaDialog} onOpenChange={setShowRecusaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recusar Solicitação</DialogTitle>
            <DialogDescription>
              Informe o motivo da recusa. O solicitante receberá esta informação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="motivo">Motivo da Recusa *</Label>
              <Textarea
                id="motivo"
                placeholder="Descreva o motivo da recusa..."
                value={motivoRecusa}
                onChange={(e) => setMotivoRecusa(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecusaDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRecusar}
              disabled={actionLoading || !motivoRecusa.trim()}
            >
              Confirmar Recusa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
