import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { agendamentoService } from '@/services/agendamentoService';
import { vendaService } from '@/services/vendaService';
import { Agendamento } from '@/types';
import { toast } from 'sonner';
import {
  addDays,
  endOfDay,
  endOfMonth,
  format,
  isWithinInterval,
  startOfDay,
  startOfMonth
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ServicoResumo {
  nome: string;
  quantidade: number;
}

const statusBadgeStyles: Record<Agendamento['status'], string> = {
  pendente: 'bg-warning/20 text-warning',
  confirmado: 'bg-info/20 text-info',
  concluido: 'bg-success/20 text-success',
  cancelado: 'bg-destructive/20 text-destructive'
};

export const BarbeiroDashboard = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [faturamentoMes, setFaturamentoMes] = useState(0);
  const [clientesUnicos, setClientesUnicos] = useState(0);
  const [proximosAgendamentos, setProximosAgendamentos] = useState<Agendamento[]>([]);
  const [servicosMaisSolicitados, setServicosMaisSolicitados] = useState<ServicoResumo[]>([]);

  useEffect(() => {
    const carregarDashboard = async () => {
      if (!userData?.barbeiroId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const agora = new Date();
        const inicioMes = startOfMonth(agora);
        const fimMes = endOfMonth(agora);

        const [listaAgendamentos, vendasMes] = await Promise.all([
          agendamentoService.listarPorBarbeiro(userData.barbeiroId),
          vendaService.listarPorPeriodo(userData.barbeiroId, inicioMes, fimMes)
        ]);

        setAgendamentos(listaAgendamentos);

        const totalFaturamento = vendasMes.reduce((total, venda) => total + (venda.valorTotal || 0), 0);
        setFaturamentoMes(totalFaturamento);

        const clientes = new Set(
          listaAgendamentos
            .map(item => item.clienteNome?.trim().toLowerCase())
            .filter(Boolean) as string[]
        );
        setClientesUnicos(clientes.size);

        const proximos = listaAgendamentos
          .filter(item => item.data.getTime() >= agora.getTime())
          .sort((a, b) => a.data.getTime() - b.data.getTime())
          .slice(0, 5);
        setProximosAgendamentos(proximos);

        const servicos = listaAgendamentos.reduce((acc, item) => {
          if (!item.servico) return acc;
          const chave = item.servico;
          acc[chave] = (acc[chave] ?? 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const rankingServicos = Object.entries(servicos)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([nome, quantidade]) => ({ nome, quantidade }));

        setServicosMaisSolicitados(rankingServicos);
      } catch (error) {
        console.error('Erro ao carregar informações do dashboard do barbeiro:', error);
        toast.error('Não foi possível carregar os dados do painel.');
      } finally {
        setLoading(false);
      }
    };

    carregarDashboard();
  }, [userData?.barbeiroId]);

  const agendamentosHoje = useMemo(() => {
    const inicio = startOfDay(new Date());
    const fim = endOfDay(new Date());
    return agendamentos.filter(item =>
      isWithinInterval(item.data, { start: inicio, end: fim })
    );
  }, [agendamentos]);

  const agendamentosSeteDias = useMemo(() => {
    const inicio = startOfDay(new Date());
    const fim = endOfDay(addDays(new Date(), 7));
    return agendamentos.filter(item =>
      isWithinInterval(item.data, { start: inicio, end: fim })
    );
  }, [agendamentos]);

  const totalServicos = agendamentos.filter(item => item.servico).length || 1;

  const estatisticas = useMemo(
    () => [
      {
        title: 'Agendamentos Hoje',
        value: agendamentosHoje.length.toLocaleString('pt-BR'),
        icon: Calendar,
        trend: `${agendamentosHoje.filter(item => item.status === 'confirmado').length} confirmados`,
        color: 'text-primary'
      },
      {
        title: 'Próximos 7 dias',
        value: agendamentosSeteDias.length.toLocaleString('pt-BR'),
        icon: Clock,
        trend: `${agendamentosSeteDias.filter(item => item.status === 'pendente').length} pendente(s)`,
        color: 'text-info'
      },
      {
        title: 'Faturamento do Mês',
        value: faturamentoMes.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        icon: DollarSign,
        trend: 'Baseado nas vendas registradas',
        color: 'text-success'
      },
      {
        title: 'Total de Clientes',
        value: clientesUnicos.toLocaleString('pt-BR'),
        icon: Users,
        trend: `${clientesUnicos} cliente(s) únicos atendidos`,
        color: 'text-warning'
      }
    ],
    [agendamentosHoje, agendamentosSeteDias, faturamentoMes, clientesUnicos]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meu Painel</h1>
        <p className="text-muted-foreground">
          Visão consolidada dos agendamentos, clientes e faturamento
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {estatisticas.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="border-border hover:shadow-gold transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.trend}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 rounded-lg" />
                ))}
              </div>
            ) : proximosAgendamentos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum agendamento futuro encontrado.</p>
            ) : (
              <div className="space-y-4">
                {proximosAgendamentos.map(agendamento => (
                  <div
                    key={agendamento.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-secondary"
                  >
                    <div>
                      <p className="font-semibold">{agendamento.clienteNome}</p>
                      <p className="text-sm text-muted-foreground">{agendamento.servico}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(agendamento.data, "dd/MM 'às' HH:mm", { locale: ptBR })}
                        {agendamento.hora ? ` • ${agendamento.hora}` : ''}
                        {agendamento.duracao ? ` • ${agendamento.duracao}min` : ''}
                      </p>
                    </div>
                    <Badge className={statusBadgeStyles[agendamento.status]}>
                      {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Serviços Mais Solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : servicosMaisSolicitados.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem histórico suficiente para exibir.</p>
            ) : (
              <div className="space-y-4">
                {servicosMaisSolicitados.map(servico => {
                  const percentual = Math.round((servico.quantidade / totalServicos) * 100);
                  return (
                    <div className="flex items-center justify-between" key={servico.nome}>
                      <span className="text-sm font-medium">{servico.nome}</span>
                      <span className="font-semibold text-primary">
                        {servico.quantidade} agendamento(s) • {percentual}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
