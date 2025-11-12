import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NexusLogo } from '@/components/NexusLogo';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  LineChart,
  Scissors
} from 'lucide-react';
import { PLANOS } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
};

export const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
          style={{ y, opacity }}
        >
          {/* Animated Scissors Background */}
          <motion.div
            className="absolute top-20 left-10 text-primary/5"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Scissors className="w-64 h-64" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-10 text-primary/5"
            animate={{ 
              rotate: [0, -15, 15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Scissors className="w-48 h-48" />
          </motion.div>
          
          {/* Glowing orbs */}
          <motion.div
            className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [-20, 20, -20]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-160px] right-[-120px] h-[420px] w-[420px] rounded-full bg-secondary/20 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1], 
              rotate: [0, 360]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Animated grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(224,167,48,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(224,167,48,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </motion.div>
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors">
                <Sparkles className="w-4 h-4 mr-2" />
                Sistema Profissional de Gestão
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-brand font-bold mb-6 text-foreground relative"
            >
              Transforme sua{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-primary animate-pulse">
                  Barbearia
                </span>
                <motion.span
                  className="absolute -inset-1 bg-primary/20 blur-xl -z-10"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [0.9, 1.1, 0.9]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
            >
              O sistema completo que sua barbearia precisa para crescer.
              Agendamentos, gestão de clientes e controle financeiro em uma plataforma única.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/cadastro">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Começar Agora
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 group">
                  Ver Demonstração
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎬
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-16 grid gap-6 sm:grid-cols-3"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8,
                    boxShadow: '0 20px 40px -20px rgba(224, 167, 48, 0.4)'
                  }}
                  className="group rounded-3xl border border-border/80 bg-background/80 p-6 text-left shadow-[0_20px_80px_-40px_rgba(0,0,0,0.65)] backdrop-blur cursor-pointer relative overflow-hidden"
                >
                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <motion.div 
                    className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors relative"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </motion.div>
                  <p className="text-xl font-bold text-foreground mb-2 relative z-10">{benefit.title}</p>
                  <p className="text-sm text-muted-foreground relative z-10">{benefit.description}</p>
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

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-border hover:shadow-gold transition-all duration-300 h-full group relative overflow-hidden">
                    {/* Animated border glow */}
                    <motion.div
                      className="absolute inset-0 border-2 border-primary/0 rounded-lg group-hover:border-primary/50 transition-all"
                      whileHover={{
                        boxShadow: '0 0 20px rgba(224, 167, 48, 0.3)'
                      }}
                    />
                    
                    <CardHeader className="relative z-10">
                      <motion.div 
                        className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                        whileHover={{ 
                          rotate: 360,
                          scale: 1.1
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-6 h-6 text-primary" />
                      </motion.div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
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

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Connection lines between steps */}
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            
            {workflow.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card className="h-full border-border bg-background/90 backdrop-blur group hover:border-primary/50 transition-all overflow-hidden">
                    {/* Number badge */}
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    
                    <CardHeader className="relative">
                      <motion.div 
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors relative z-10"
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 360
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>
                      
                      {/* Glow effect */}
                      <motion.div
                        className="absolute top-0 left-0 h-12 w-12 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      
                      <CardTitle className="text-xl mt-4 group-hover:text-primary transition-colors">{step.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
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

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {PLANOS.filter(p => p.nome !== 'teste').map((plano, index) => (
              <motion.div
                key={plano.nome}
                variants={itemVariants}
                whileHover={{ 
                  scale: plano.nome === 'pro' ? 1.08 : 1.05,
                  zIndex: 10
                }}
                viewport={{ once: true }}
                className={plano.nome === 'pro' ? 'lg:-mt-4' : ''}
              >
                <Card className={`border-border h-full flex flex-col group relative overflow-hidden ${
                  plano.nome === 'pro' 
                    ? 'border-primary shadow-gold ring-2 ring-primary/20' 
                    : ''
                }`}>
                  {/* Animated background for Pro plan */}
                  {plano.nome === 'pro' && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
                      animate={{
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ x: '100%', opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  <CardHeader className="relative z-10">
                    {plano.nome === 'pro' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                      >
                        <Badge className="w-fit mb-2 bg-primary text-primary-foreground animate-pulse">
                          ⭐ Recomendado
                        </Badge>
                      </motion.div>
                    )}
                    <CardTitle className="text-2xl font-brand group-hover:text-primary transition-colors">
                      {plano.label}
                    </CardTitle>
                    <div className="mt-4">
                      <motion.span 
                        className="text-4xl font-bold inline-block"
                        whileHover={{ scale: 1.1 }}
                      >
                        R$ {plano.preco.mensal.toFixed(2)}
                      </motion.span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                    <CardDescription className="mt-2 font-semibold">
                      {plano.agendamentosMensais === -1 
                        ? '∞ Agendamentos ilimitados' 
                        : `${plano.agendamentosMensais} agendamentos/mês`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col relative z-10">
                    <ul className="space-y-3 mb-6 flex-1">
                      {plano.features.map((feature, idx) => (
                        <motion.li 
                          key={feature} 
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                          <span className="text-sm leading-tight">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Link to="/cadastro" className="w-full">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className="w-full group/btn relative overflow-hidden"
                          variant={plano.nome === 'pro' ? 'default' : 'outline'}
                        >
                          <span className="relative z-10">Escolher {plano.label}</span>
                          {plano.nome === 'pro' && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </Button>
                      </motion.div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

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
      <section className="relative py-20 px-4 bg-gradient-primary overflow-hidden">
        {/* Animated scissors pattern */}
        <motion.div
          className="absolute top-10 left-10 text-primary-foreground/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Scissors className="w-32 h-32" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-primary-foreground/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          <Scissors className="w-24 h-24" />
        </motion.div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground"
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(0,0,0,0.3)',
                  '0 0 40px rgba(0,0,0,0.5)',
                  '0 0 20px rgba(0,0,0,0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Pronto para modernizar sua barbearia?
            </motion.h2>
            <motion.p 
              className="text-xl text-primary-foreground/90 mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Comece a usar o Nexus e tenha controle total do seu negócio
            </motion.p>
            <Link to="/cadastro">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8 group relative overflow-hidden shadow-2xl"
                >
                  <span className="relative z-10 flex items-center">
                    Começar Gratuitamente
                    <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </Button>
              </motion.div>
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
