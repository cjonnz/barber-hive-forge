import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { barbeiroService } from '@/services/barbeiroService';
import { Barbeiro, BarbeiroStatus } from '@/types';
import { Search, UserCheck, UserX, Clock, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const BarbeirosPage = () => {
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<BarbeiroStatus | 'todos'>('todos');

  useEffect(() => {
    carregarBarbeiros();
  }, []);

  const carregarBarbeiros = async () => {
    try {
      const data = await barbeiroService.listarTodos();
      setBarbeiros(data);
    } catch (error) {
      toast.error('Erro ao carregar barbeiros');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizarStatus = async (id: string, novoStatus: BarbeiroStatus) => {
    try {
      await barbeiroService.atualizarStatus(id, novoStatus);
      toast.success('Status atualizado com sucesso!');
      carregarBarbeiros();
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error(error);
    }
  };

  const barberosFiltrados = barbeiros.filter(barbeiro => {
    const matchSearch = barbeiro.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       barbeiro.nomeEstabelecimento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || barbeiro.status === filtroStatus;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<BarbeiroStatus, string> = {
    pendente: 'bg-warning/20 text-warning',
    aprovado: 'bg-info/20 text-info',
    ativo: 'bg-success/20 text-success',
    suspenso: 'bg-destructive/20 text-destructive'
  };

  const statusLabels: Record<BarbeiroStatus, string> = {
    pendente: 'Pendente',
    aprovado: 'Aprovado',
    ativo: 'Ativo',
    suspenso: 'Suspenso'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-muted-foreground">Carregando barbeiros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestão de Barbeiros</h1>
        <p className="text-muted-foreground">
          Gerencie todos os barbeiros cadastrados na plataforma
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou estabelecimento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filtroStatus === 'todos' ? 'default' : 'outline'}
            onClick={() => setFiltroStatus('todos')}
            size="sm"
          >
            Todos
          </Button>
          <Button
            variant={filtroStatus === 'pendente' ? 'default' : 'outline'}
            onClick={() => setFiltroStatus('pendente')}
            size="sm"
          >
            Pendentes
          </Button>
          <Button
            variant={filtroStatus === 'ativo' ? 'default' : 'outline'}
            onClick={() => setFiltroStatus('ativo')}
            size="sm"
          >
            Ativos
          </Button>
        </div>
      </div>

      {/* Lista de Barbeiros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {barberosFiltrados.map((barbeiro, index) => (
          <motion.div
            key={barbeiro.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-border hover:shadow-gold transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{barbeiro.nomeEstabelecimento}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{barbeiro.nomeCompleto}</p>
                  </div>
                  <Badge className={statusColors[barbeiro.status]}>
                    {statusLabels[barbeiro.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Plano</p>
                    <p className="font-semibold capitalize">{barbeiro.plano}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Agendamentos</p>
                    <p className="font-semibold">{barbeiro.totalAgendamentos}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-semibold text-xs">{barbeiro.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telefone</p>
                    <p className="font-semibold">{barbeiro.telefone}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  {barbeiro.status === 'pendente' && (
                    <Button
                      size="sm"
                      onClick={() => handleAtualizarStatus(barbeiro.id, 'aprovado')}
                      className="flex-1"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                  )}
                  {barbeiro.status === 'aprovado' && (
                    <Button
                      size="sm"
                      onClick={() => handleAtualizarStatus(barbeiro.id, 'ativo')}
                      className="flex-1"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Ativar
                    </Button>
                  )}
                  {barbeiro.status === 'ativo' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAtualizarStatus(barbeiro.id, 'suspenso')}
                      className="flex-1"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Suspender
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {barberosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum barbeiro encontrado</p>
        </div>
      )}
    </div>
  );
};
