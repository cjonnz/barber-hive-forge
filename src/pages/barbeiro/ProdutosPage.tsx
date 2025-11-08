import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { produtoService } from '@/services/produtoService';
import { historicoService } from '@/services/historicoService';
import { Produto } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProdutosPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    fornecedor: '',
    precoCompra: 0,
    precoVenda: 0,
    quantidade: 0,
    estoqueMinimo: 5,
    validade: '',
    ativo: true
  });

  useEffect(() => {
    carregarProdutos();
  }, [userData]);

  const carregarProdutos = async () => {
    if (!userData?.barbeiroId) return;
    
    try {
      setLoading(true);
      const { produtos: listaProdutos } = await produtoService.listar(userData.barbeiroId);
      setProdutos(listaProdutos);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.barbeiroId) return;

    try {
      if (editando) {
        await produtoService.atualizar(userData.barbeiroId, editando.id, formData);
        toast({ title: 'Produto atualizado com sucesso!' });
      } else {
        await produtoService.criar(userData.barbeiroId, formData);
        toast({ title: 'Produto cadastrado com sucesso!' });
        
        await historicoService.criar(userData.barbeiroId, {
          tipo: 'estoque',
          descricao: `Produto "${formData.nome}" cadastrado no estoque`,
          data: new Date(),
          produto: formData.nome
        });
      }
      
      setDialogOpen(false);
      resetForm();
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o produto',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (produtoId: string) => {
    if (!userData?.barbeiroId) return;
    if (!confirm('Deseja realmente excluir este produto?')) return;

    try {
      await produtoService.deletar(userData.barbeiroId, produtoId);
      toast({ title: 'Produto excluído com sucesso!' });
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o produto',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditando(produto);
    setFormData({
      nome: produto.nome,
      categoria: produto.categoria,
      fornecedor: produto.fornecedor || '',
      precoCompra: produto.precoCompra,
      precoVenda: produto.precoVenda,
      quantidade: produto.quantidade,
      estoqueMinimo: produto.estoqueMinimo,
      validade: produto.validade || '',
      ativo: produto.ativo
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditando(null);
    setFormData({
      nome: '',
      categoria: '',
      fornecedor: '',
      precoCompra: 0,
      precoVenda: 0,
      quantidade: 0,
      estoqueMinimo: 5,
      validade: '',
      ativo: true
    });
  };

  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Controle de Estoque</h1>
          <p className="text-muted-foreground">Gerencie seus produtos e estoque</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editando ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Produto *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    placeholder="Ex: Finalização, Hidratação"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  value={formData.fornecedor}
                  onChange={(e) => setFormData({...formData, fornecedor: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precoCompra">Preço de Compra *</Label>
                  <Input
                    id="precoCompra"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precoCompra}
                    onChange={(e) => setFormData({...formData, precoCompra: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="precoVenda">Preço de Venda *</Label>
                  <Input
                    id="precoVenda"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precoVenda}
                    onChange={(e) => setFormData({...formData, precoVenda: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade em Estoque *</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="0"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({...formData, quantidade: parseInt(e.target.value)})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estoqueMinimo">Estoque Mínimo *</Label>
                  <Input
                    id="estoqueMinimo"
                    type="number"
                    min="0"
                    value={formData.estoqueMinimo}
                    onChange={(e) => setFormData({...formData, estoqueMinimo: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validade">Data de Validade</Label>
                <Input
                  id="validade"
                  type="date"
                  value={formData.validade}
                  onChange={(e) => setFormData({...formData, validade: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="ativo">Produto ativo</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editando ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar produtos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
        />
      </div>

      {produtosFiltrados.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum produto encontrado</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtosFiltrados.map((produto, index) => (
            <motion.div
              key={produto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-4 ${
                produto.quantidade === 0 ? 'border-red-500' :
                produto.quantidade <= produto.estoqueMinimo ? 'border-yellow-500' : ''
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{produto.nome}</h3>
                    <p className="text-sm text-muted-foreground">{produto.categoria}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(produto)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(produto.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estoque:</span>
                    <span className="font-semibold">
                      {produto.quantidade} un.
                      {produto.quantidade <= produto.estoqueMinimo && (
                        <AlertTriangle className="inline ml-1 h-4 w-4 text-yellow-500" />
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço de Venda:</span>
                    <span className="font-semibold">
                      R$ {produto.precoVenda.toFixed(2)}
                    </span>
                  </div>

                  {produto.fornecedor && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fornecedor:</span>
                      <span>{produto.fornecedor}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <Badge variant={produto.ativo ? 'default' : 'secondary'}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {produto.quantidade === 0 && (
                      <Badge variant="destructive">SEM ESTOQUE</Badge>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
