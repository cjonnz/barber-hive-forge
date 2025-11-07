import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Search, Filter, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { agendamentoService } from '@/services/agendamentoService';
import { barbeiroService } from '@/services/barbeiroService';
import { Agendamento, Barbeiro, AgendamentoStatus } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export const AgendamentosPage = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgendamentoStatus | 'todos'>('todos');
  const [barbeiroFilter, setBarbeiroFilter] = useState<string>('todos');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [agendamentosData, barbeirosData] = await Promise.all([
        agendamentoService.listarTodos(),
        barbeiroService.listarTodos()
      ]);
      setAgendamentos(agendamentosData);
      setBarbeiros(barbeirosData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: AgendamentoStatus) => {
    try {
      await agendamentoService.atualizarStatus(id, status);
      setAgendamentos(prev =>
        prev.map(agendamento =>
          agendamento.id === id ? { ...agendamento, status } : agendamento
        )
      );
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const getStatusBadge = (status: AgendamentoStatus) => {
    const variants = {
      pendente: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      confirmado: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      concluido: 'bg-green-500/10 text-green-500 border-green-500/20',
      cancelado: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    const labels = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      concluido: 'Concluído',
      cancelado: 'Cancelado'
    };

    return (
      <Badge className={variants[status]} variant="outline">
        {labels[status]}
      </Badge>
    );
  };

  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const matchSearch = agendamento.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.clienteWhatsapp.includes(searchTerm);
    const matchStatus = statusFilter === 'todos' || agendamento.status === statusFilter;
    const matchBarbeiro = barbeiroFilter === 'todos' || agendamento.barbeiroId === barbeiroFilter;
    return matchSearch && matchStatus && matchBarbeiro;
  });

  const stats = {
    pendentes: agendamentos.filter(a => a.status === 'pendente').length,
    confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
    concluidos: agendamentos.filter(a => a.status === 'concluido').length,
    cancelados: agendamentos.filter(a => a.status === 'cancelado').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Agendamentos</h1>
        <p className="text-muted-foreground">Gerencie todos os agendamentos do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pendentes', value: stats.pendentes, icon: Clock3, color: 'text-yellow-500' },
          { label: 'Confirmados', value: stats.confirmados, icon: CheckCircle, color: 'text-blue-500' },
          { label: 'Concluídos', value: stats.concluidos, icon: CheckCircle, color: 'text-green-500' },
          { label: 'Cancelados', value: stats.cancelados, icon: XCircle, color: 'text-red-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={barbeiroFilter} onValueChange={setBarbeiroFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Barbeiro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os barbeiros</SelectItem>
                {barbeiros.map(barbeiro => (
                  <SelectItem key={barbeiro.id} value={barbeiro.id}>
                    {barbeiro.nomeEstabelecimento}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {filteredAgendamentos.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredAgendamentos.map((agendamento, index) => {
            const barbeiro = barbeiros.find(b => b.id === agendamento.barbeiroId);
            return (
              <motion.div
                key={agendamento.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              {agendamento.clienteNome}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <Phone className="w-3 h-3" />
                              {agendamento.clienteWhatsapp}
                            </p>
                          </div>
                          {getStatusBadge(agendamento.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            {format(agendamento.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            {agendamento.hora} ({agendamento.duracao}min)
                          </div>
                          <div className="text-muted-foreground">
                            <strong className="text-foreground">Serviço:</strong> {agendamento.servico}
                          </div>
                        </div>
                        
                        {barbeiro && (
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Barbearia:</strong> {barbeiro.nomeEstabelecimento}
                          </p>
                        )}
                        
                        {agendamento.comentario && (
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Observação:</strong> {agendamento.comentario}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap lg:flex-col gap-2">
                        {agendamento.status === 'pendente' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(agendamento.id, 'confirmado')}
                              className="flex-1 lg:flex-none"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(agendamento.id, 'cancelado')}
                              className="flex-1 lg:flex-none"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar
                            </Button>
                          </>
                        )}
                        {agendamento.status === 'confirmado' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(agendamento.id, 'concluido')}
                            className="flex-1 lg:flex-none"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marcar como Concluído
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
