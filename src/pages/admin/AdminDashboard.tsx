import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  // Mock data - será substituído por dados reais do Firestore
  const stats = [
    {
      title: 'Barbeiros Ativos',
      value: '12',
      icon: UserCheck,
      trend: '+3 este mês',
      color: 'text-success'
    },
    {
      title: 'Pendentes',
      value: '5',
      icon: Clock,
      trend: 'Aguardando aprovação',
      color: 'text-warning'
    },
    {
      title: 'Total de Agendamentos',
      value: '1,234',
      icon: Calendar,
      trend: '+23% vs mês anterior',
      color: 'text-info'
    },
    {
      title: 'Suspensos',
      value: '2',
      icon: UserX,
      trend: 'Ação necessária',
      color: 'text-destructive'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral completa da plataforma Nexus
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
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Barbeiros por Plano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Basic</span>
                <span className="font-semibold">4 barbeiros</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Spark</span>
                <span className="font-semibold">6 barbeiros</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Blaze</span>
                <span className="font-semibold">2 barbeiros</span>
              </div>
            </div>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Barbearia Premium</span>
                <span className="text-muted-foreground">Hoje</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Cortes & Estilo</span>
                <span className="text-muted-foreground">Ontem</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>The Barber Shop</span>
                <span className="text-muted-foreground">2 dias atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
