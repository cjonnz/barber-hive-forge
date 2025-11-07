import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, CheckCircle, XCircle, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { agendamentoService } from '@/services/agendamentoService';
import { useAuth } from '@/hooks/useAuth';
import { Agendamento, AgendamentoStatus } from '@/types';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export const AgendaPage = () => {
  const { userData } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AgendamentoStatus | 'todos'>('todos');

  useEffect(() => {
    if (userData?.barbeiroId) {
      loadAgendamentos();
    }
  }, [userData]);

  const loadAgendamentos = async () => {
    try {
      const data = await agendamentoService.listarPorBarbeiro(userData!.barbeiroId!);
      setAgendamentos(data);
    } catch (error) {
      toast.error('Erro ao carregar agendamentos');
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

  const agendamentosDoDia = agendamentos
    .filter(a => isSameDay(a.data, selectedDate))
    .filter(a => statusFilter === 'todos' || a.status === statusFilter)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const datasComAgendamento = agendamentos.map(a => a.data);

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
        <h1 className="text-3xl font-bold text-foreground mb-2">Minha Agenda</h1>
        <p className="text-muted-foreground">Gerencie seus agendamentos e horários</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Calendário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={ptBR}
                className="rounded-md border border-border"
                modifiers={{
                  booked: datasComAgendamento
                }}
                modifiersStyles={{
                  booked: {
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    color: 'hsl(var(--primary))'
                  }
                }}
              />
              
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Filtrar por Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['todos', 'pendente', 'confirmado', 'concluido'] as const).map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={statusFilter === status ? 'default' : 'outline'}
                      onClick={() => setStatusFilter(status)}
                      className="text-xs"
                    >
                      {status === 'todos' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de Agendamentos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Agendamentos de {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </span>
                <Badge variant="secondary">{agendamentosDoDia.length} agendamentos</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agendamentosDoDia.length === 0 ? (
                <div className="py-12 text-center">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum agendamento para este dia</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agendamentosDoDia.map((agendamento, index) => (
                    <motion.div
                      key={agendamento.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border border-border/50 rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                {agendamento.hora}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Duração: {agendamento.duracao} minutos
                              </p>
                            </div>
                            {getStatusBadge(agendamento.status)}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              <strong>Cliente:</strong> {agendamento.clienteNome}
                            </p>
                            <p className="text-sm flex items-center gap-2">
                              <Phone className="w-4 h-4 text-primary" />
                              <strong>WhatsApp:</strong> {agendamento.clienteWhatsapp}
                            </p>
                            <p className="text-sm">
                              <strong>Serviço:</strong> {agendamento.servico}
                            </p>
                            {agendamento.comentario && (
                              <p className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Obs:</strong> {agendamento.comentario}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          {agendamento.status === 'pendente' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(agendamento.id, 'confirmado')}
                                className="flex-1 md:flex-none"
                              >
                                <CheckCircle className="w-4 h-4 md:mr-2" />
                                <span className="hidden md:inline">Confirmar</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusChange(agendamento.id, 'cancelado')}
                                className="flex-1 md:flex-none"
                              >
                                <XCircle className="w-4 h-4 md:mr-2" />
                                <span className="hidden md:inline">Cancelar</span>
                              </Button>
                            </>
                          )}
                          {agendamento.status === 'confirmado' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(agendamento.id, 'concluido')}
                            >
                              <CheckCircle className="w-4 h-4 md:mr-2" />
                              <span className="hidden md:inline">Concluir</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
