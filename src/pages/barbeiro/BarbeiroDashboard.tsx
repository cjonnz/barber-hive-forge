import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export const BarbeiroDashboard = () => {
  // Mock data - será substituído por dados reais do Firestore
  const stats = [
    {
      title: 'Agendamentos Hoje',
      value: '8',
      icon: Calendar,
      trend: '3 confirmados',
      color: 'text-primary'
    },
    {
      title: 'Próximos 7 dias',
      value: '24',
      icon: Clock,
      trend: '+15% vs semana anterior',
      color: 'text-info'
    },
    {
      title: 'Faturamento do Mês',
      value: 'R$ 3.450',
      icon: DollarSign,
      trend: '+28% vs mês anterior',
      color: 'text-success'
    },
    {
      title: 'Total de Clientes',
      value: '156',
      icon: Users,
      trend: '12 novos este mês',
      color: 'text-warning'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meu Painel</h1>
        <p className="text-muted-foreground">
          Gerencie seus agendamentos e serviços
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between p-3 rounded-lg bg-secondary">
                <div>
                  <p className="font-semibold">João Silva</p>
                  <p className="text-sm text-muted-foreground">Corte + Barba</p>
                  <p className="text-xs text-muted-foreground mt-1">14:30 - 60min</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">
                  Confirmado
                </span>
              </div>
              <div className="flex items-start justify-between p-3 rounded-lg bg-secondary">
                <div>
                  <p className="font-semibold">Carlos Santos</p>
                  <p className="text-sm text-muted-foreground">Corte Simples</p>
                  <p className="text-xs text-muted-foreground mt-1">16:00 - 30min</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning">
                  Pendente
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Serviços Mais Solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Corte + Barba</span>
                <span className="font-semibold text-primary">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Corte Simples</span>
                <span className="font-semibold text-primary">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Barba</span>
                <span className="font-semibold text-primary">25%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
