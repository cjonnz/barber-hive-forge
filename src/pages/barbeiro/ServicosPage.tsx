import { useState, useEffect } from 'react';
import { Scissors, Plus, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { barbeiroService } from '@/services/barbeiroService';
import { useAuth } from '@/hooks/useAuth';
import { Servico } from '@/types';
import { toast } from 'sonner';

export const ServicosPage = () => {
  const { userData } = useAuth();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [formData, setFormData] = useState<Servico>({
    nome: '',
    preco: 0,
    duracao: 30
  });

  useEffect(() => {
    if (userData?.barbeiroId) {
      loadServicos();
    }
  }, [userData]);

  const loadServicos = async () => {
    try {
      const barbeiro = await barbeiroService.buscarPorId(userData!.barbeiroId!);
      if (barbeiro) {
        setServicos(barbeiro.servicos || []);
      }
    } catch (error) {
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nome || formData.preco <= 0 || formData.duracao <= 0) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    try {
      let novosServicos: Servico[];
      
      if (editingServico) {
        novosServicos = servicos.map(s => 
          s.nome === editingServico.nome ? formData : s
        );
      } else {
        if (servicos.some(s => s.nome === formData.nome)) {
          toast.error('Já existe um serviço com este nome');
          return;
        }
        novosServicos = [...servicos, formData];
      }

      await barbeiroService.atualizar(userData!.barbeiroId!, {
        servicos: novosServicos
      });

      setServicos(novosServicos);
      setIsDialogOpen(false);
      setEditingServico(null);
      setFormData({ nome: '', preco: 0, duracao: 30 });
      toast.success(editingServico ? 'Serviço atualizado!' : 'Serviço adicionado!');
    } catch (error) {
      toast.error('Erro ao salvar serviço');
    }
  };

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico);
    setFormData(servico);
    setIsDialogOpen(true);
  };

  const handleDelete = async (servico: Servico) => {
    try {
      const novosServicos = servicos.filter(s => s.nome !== servico.nome);
      await barbeiroService.atualizar(userData!.barbeiroId!, {
        servicos: novosServicos
      });
      setServicos(novosServicos);
      toast.success('Serviço removido!');
    } catch (error) {
      toast.error('Erro ao remover serviço');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingServico(null);
    setFormData({ nome: '', preco: 0, duracao: 30 });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Meus Serviços</h1>
          <p className="text-muted-foreground">Gerencie os serviços oferecidos em sua barbearia</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do serviço oferecido
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Serviço</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Corte Masculino"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração (min)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duracao}
                    onChange={(e) => setFormData({ ...formData, duracao: parseInt(e.target.value) || 30 })}
                    placeholder="30"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingServico ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {servicos.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum serviço cadastrado</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Serviço
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicos.map((servico, index) => (
            <motion.div
              key={servico.nome}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50 hover:border-primary/50 transition-all group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-primary" />
                    {servico.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        Preço
                      </span>
                      <span className="font-semibold text-foreground">
                        R$ {servico.preco.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        Duração
                      </span>
                      <span className="font-semibold text-foreground">
                        {servico.duracao} min
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(servico)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(servico)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
