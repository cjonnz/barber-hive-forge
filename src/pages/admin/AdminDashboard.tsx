import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, UserX, Clock, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { barbeiroService } from '@/services/barbeiroService';
import { agendamentoService } from '@/services/agendamentoService';
import { PLANOS, Barbeiro, PlanoTipo } from '@/types';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardResumo {
  barbeirosAtivos: number;
  barbeirosPendentes: number;
  barbeirosSuspensos: number;
  totalAgendamentos: number;
  barbeirosPorPlano: Record<PlanoTipo, number>;
  ultimosCadastros: Barbeiro[];
}

const planoLabel: Record<PlanoTipo, string> = {
  agenda: 'Agenda Plan',
  basic: 'Basic',
  blaze: 'Blaze',
  pro: 'Pro',
  teste: 'Teste'
};

const inicialResumo: DashboardResumo = {
  barbeirosAtivos: 0,
  barbeirosPendentes: 0,
  barbeirosSuspensos: 0,
  totalAgendamentos: 0,
  barbeirosPorPlano: {
    agenda: 0,
    basic: 0,
    blaze: 0,
    pro: 0,
    teste: 0
  },
  ultimosCadastros: []
};

export const AdminDashboard = () => {
  const [resumo, setResumo] = useState<DashboardResumo>(inicialResumo);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        const [barbeiros, agendamentos] = await Promise.all([
          barbeiroService.listarTodos(),
          agendamentoService.listarTodos()
        ]);

        const ativos = barbeiros.filter(b => b.status === 'ativo').length;
        const pendentes = barbeiros.filter(b => b.status === 'pendente').length;
        const suspensos = barbeiros.filter(b => b.status === 'suspenso').length;

        const porPlano = barbeiros.reduce(
          (acc, barbeiro) => {
            const plano = barbeiro.plano as PlanoTipo;
            if (acc[plano] !== undefined) {
              acc[plano] += 1;
            }
            return acc;
          },
          { ...inicialResumo.barbeirosPorPlano }
        );

        const ultimosCadastros = [...barbeiros]
          .sort((a, b) => b.dataCadastro.getTime() - a.dataCadastro.getTime())
          .slice(0, 5);

        setResumo({
          barbeirosAtivos: ativos,
          barbeirosPendentes: pendentes,
          barbeirosSuspensos: suspensos,
          totalAgendamentos: agendamentos.length,
          barbeirosPorPlano: porPlano,
          ultimosCadastros
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        toast.error('Não foi possível carregar os dados do dashboard.');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const estatisticas = useMemo(
    () => [
      {
        title: 'Barbeiros Ativos',
        value: resumo.barbeirosAtivos.toLocaleString('pt-BR'),
        icon: UserCheck,
        trend: `${resumo.barbeirosAtivos} com acesso ao painel`,
        color: 'text-success'
      },
      {
        title: 'Pendentes',
        value: resumo.barbeirosPendentes.toLocaleString('pt-BR'),
        icon: Clock,
        trend: 'Aguardando aprovação',
        color: 'text-warning'
      },
      {
        title: 'Total de Agendamentos',
        value: resumo.totalAgendamentos.toLocaleString('pt-BR'),
        icon: Calendar,
        trend: 'Somatório geral da plataforma',
        color: 'text-info'
      },
      {
        title: 'Suspensos',
        value: resumo.barbeirosSuspensos.toLocaleString('pt-BR'),
        icon: UserX,
        trend: 'Requer revisão manual',
        color: 'text-destructive'
      }
    ],
    [resumo]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral completa da plataforma Nexus
        </p>
      </div>

      {carregando ? (
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
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Barbeiros por Plano
            </CardTitle>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="space-y-4">
                {PLANOS.map(plano => (
                  <div className="flex items-center justify-between" key={plano.nome}>
                    <span className="text-sm">{planoLabel[plano.nome]}</span>
                    <span className="font-semibold">
                      {resumo.barbeirosPorPlano[plano.nome].toLocaleString('pt-BR')} barbeiro(s)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Últimos Cadastros
            </CardTitle>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : resumo.ultimosCadastros.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum cadastro recente encontrado.</p>
            ) : (
              <div className="space-y-4">
                {resumo.ultimosCadastros.map(barbeiro => (
                  <div
                    key={barbeiro.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-semibold">{barbeiro.nomeEstabelecimento}</p>
                      <p className="text-xs text-muted-foreground">{barbeiro.nomeCompleto}</p>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(barbeiro.dataCadastro, {
                        locale: ptBR,
                        addSuffix: true
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!carregando && resumo.ultimosCadastros.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Resumo dos últimos cadastros</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumo.ultimosCadastros.map(barbeiro => (
              <div key={barbeiro.id} className="p-4 rounded-lg bg-muted/30">
                <p className="font-semibold mb-1">{barbeiro.nomeCompleto}</p>
                <p className="text-xs text-muted-foreground mb-2">{barbeiro.email}</p>
                <p className="text-xs text-muted-foreground">
                  Cadastro em {format(barbeiro.dataCadastro, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
