import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NexusLogo } from '@/components/NexusLogo';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  BarChart3,
  Clock,
  Shield,
  Zap,
  Users,
  Check,
  ArrowRight,
  Smartphone,
  TrendingUp,
  Bell,
  Lock,
  Sparkles,
  Target,
  LineChart
} from 'lucide-react';
import { PLANOS } from '@/types';

export const LandingPage = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Agenda Inteligente',
      description: 'Sistema completo de agendamentos em tempo real com confirmações automáticas'
    },
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'Mantenha histórico completo de atendimentos e informações importantes de cada cliente'
    },
    {
      icon: TrendingUp,
      title: 'Controle de Fiado',
      description: 'Gerencie contas a receber com facilidade. Registre vendas fiadas, acompanhe pagamentos parciais e totais com total transparência'
    },
    {
      icon: BarChart3,
      title: 'Controle de Estoque',
      description: 'Gerencie produtos, controle estoque e registre vendas. Ideal para barbearias que vendem produtos'
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Seus dados protegidos com segurança avançada e backups automáticos'
    },
    {
      icon: Smartphone,
      title: '100% Responsivo',
      description: 'Acesse de qualquer dispositivo - celular, tablet ou computador'
    }
  ];

  const benefits = [
    {
      icon: Calendar,
      title: 'Agendamentos Organizados',
      description: 'Tenha controle total da sua agenda, evite conflitos e reduza faltas'
    },
    {
      icon: TrendingUp,
      title: 'Gestão Financeira',
      description: 'Controle receitas, despesas, contas a receber e vendas de produtos em um só lugar'
    },
    {
      icon: BarChart3,
      title: 'Relatórios e Análises',
      description: 'Acompanhe o desempenho do seu negócio com relatórios detalhados e gráficos'
    }
  ];

  const workflow = [
    {
      icon: Sparkles,
      title: '1. Configuração guiada',
      description: 'Importe clientes e cadastre serviços em minutos com nosso assistente inteligente'
    },
    {
      icon: Target,
      title: '2. Engajamento automático',
      description: 'Ative lembretes personalizados, notificações em massa e campanhas segmentadas'
    },
    {
      icon: LineChart,
      title: '3. Resultados visíveis',
      description: 'Acompanhe métricas em tempo real e tome decisões baseadas em dados confiáveis'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NexusLogo size="sm" showTagline />
            <Link to="/login">
              <Button variant="outline" className="group">
                Acessar Sistema
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-secondary/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
              Sistema Profissional de Gestão
            </Badge>
            <h1 className="text-5xl md:text-7xl font-brand font-bold mb-6 text-foreground">
              Transforme sua{' '}
              <span className="text-transparent bg-clip-text bg-gradient-primary">
                Barbearia
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              O sistema completo que sua barbearia precisa para crescer.
              Agendamentos, gestão de clientes e controle financeiro em uma plataforma única.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Começar Agora
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                Ver Demonstração
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 grid gap-6 sm:grid-cols-3"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="rounded-3xl border border-border/80 bg-background/80 p-6 text-left shadow-[0_20px_80px_-40px_rgba(0,0,0,0.65)] backdrop-blur"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-xl font-bold text-foreground mb-2">{benefit.title}</p>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-muted-foreground">
              Recursos poderosos para levar sua barbearia ao próximo nível
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-border hover:shadow-gold transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Como o Nexus impulsiona sua barbearia</h2>
            <p className="text-xl text-muted-foreground">
              Uma jornada simples para dominar seus agendamentos, encantar clientes e aumentar a receita
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workflow.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-border bg-background/90 backdrop-blur">
                    <CardHeader>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Planos para todos os tamanhos
            </h2>
            <p className="text-xl text-muted-foreground">
              Escolha o plano ideal para o seu negócio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANOS.filter(p => p.nome !== 'teste').map((plano, index) => (
              <motion.div
                key={plano.nome}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={plano.nome === 'pro' ? 'lg:-mt-4' : ''}
              >
                <Card className={`border-border h-full flex flex-col ${
                  plano.nome === 'pro' 
                    ? 'border-primary shadow-gold ring-2 ring-primary/20' 
                    : ''
                }`}>
                  <CardHeader>
                    {plano.nome === 'pro' && (
                      <Badge className="w-fit mb-2 bg-primary text-primary-foreground">
                        ⭐ Recomendado
                      </Badge>
                    )}
                    <CardTitle className="text-2xl font-brand">
                      {plano.label}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        R$ {plano.preco.mensal.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                    <CardDescription className="mt-2 font-semibold">
                      {plano.agendamentosMensais === -1 
                        ? '∞ Agendamentos ilimitados' 
                        : `${plano.agendamentosMensais} agendamentos/mês`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {plano.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                          <span className="text-sm leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/cadastro" className="w-full">
                      <Button 
                        className="w-full"
                        variant={plano.nome === 'pro' ? 'default' : 'outline'}
                      >
                        Escolher {plano.label}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              Desconto especial para pagamento semestral e anual
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Badge variant="outline" className="px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Semestral: 10% de desconto
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Anual: 20% de desconto
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
              Pronto para modernizar sua barbearia?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Comece a usar o Nexus e tenha controle total do seu negócio
            </p>
            <Link to="/cadastro">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8"
              >
                Começar Gratuitamente
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <NexusLogo size="sm" showTagline />
              <p className="text-sm text-muted-foreground mt-2">
                Sistema profissional de gestão para barbearias
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Dados protegidos e criptografados</span>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2024 Nexus by Jon. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
