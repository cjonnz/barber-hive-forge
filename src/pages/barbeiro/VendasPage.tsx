import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { produtoService } from '@/services/produtoService';
import { vendaService } from '@/services/vendaService';
import { contaReceberService } from '@/services/contaReceberService';
import { historicoService } from '@/services/historicoService';
import { Produto, ItemVenda, FormaPagamentoVenda } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Plus, Trash2, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export const VendasPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<ItemVenda[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<string>('');
  const [quantidade, setQuantidade] = useState(1);
  const [busca, setBusca] = useState('');
  
  const [pagamento, setPagamento] = useState<FormaPagamentoVenda>('DINHEIRO');
  const [clienteNome, setClienteNome] = useState('');
  const [observacao, setObservacao] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [nomeBanco, setNomeBanco] = useState('');
  const [enderecoCarteira, setEnderecoCarteira] = useState('');

  useEffect(() => {
    carregarProdutos();
  }, [userData]);

  const carregarProdutos = async () => {
    if (!userData?.barbeiroId) return;
    
    try {
      const listaProdutos = await produtoService.listarAtivos(userData.barbeiroId);
      setProdutos(listaProdutos);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const adicionarAoCarrinho = () => {
    if (!produtoSelecionado) {
      toast({
        title: 'Atenção',
        description: 'Selecione um produto',
        variant: 'destructive'
      });
      return;
    }

    const produto = produtos.find(p => p.id === produtoSelecionado);
    if (!produto) return;

    if (quantidade > produto.quantidade) {
      toast({
        title: 'Quantidade insuficiente',
        description: `Estoque disponível: ${produto.quantidade} unidades`,
        variant: 'destructive'
      });
      return;
    }

    const itemExistente = carrinho.find(item => item.produtoId === produto.id);
    
    if (itemExistente) {
      const novaQuantidade = itemExistente.quantidade + quantidade;
      if (novaQuantidade > produto.quantidade) {
        toast({
          title: 'Quantidade insuficiente',
          description: `Estoque disponível: ${produto.quantidade} unidades`,
          variant: 'destructive'
        });
        return;
      }
      
      setCarrinho(carrinho.map(item =>
        item.produtoId === produto.id
          ? {
              ...item,
              quantidade: novaQuantidade,
              subtotal: novaQuantidade * produto.precoVenda
            }
          : item
      ));
    } else {
      const novoItem: ItemVenda = {
        produtoId: produto.id,
        nome: produto.nome,
        quantidade,
        valorUnitario: produto.precoVenda,
        subtotal: quantidade * produto.precoVenda
      };
      setCarrinho([...carrinho, novoItem]);
    }

    setProdutoSelecionado('');
    setQuantidade(1);
    setBusca('');
  };

  const removerDoCarrinho = (produtoId: string) => {
    setCarrinho(carrinho.filter(item => item.produtoId !== produtoId));
  };

  const valorTotal = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

  const concluirVenda = async () => {
    if (!userData?.barbeiroId) return;
    
    if (carrinho.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho',
        variant: 'destructive'
      });
      return;
    }

    if (pagamento === 'FIADO' && !clienteNome) {
      toast({
        title: 'Nome do cliente obrigatório',
        description: 'Informe o nome do cliente para venda fiada',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Criar venda
      const vendaData = {
        data: new Date(),
        itens: carrinho,
        valorTotal,
        pagamento,
        status: 'Concluído' as const,
        clienteNome: clienteNome || undefined,
        observacao: observacao || undefined,
        chavePix: pagamento === 'PIX' ? chavePix : undefined,
        nomeBanco: pagamento === 'TRANSFERENCIA' ? nomeBanco : undefined,
        enderecoCarteira: pagamento === 'BITCOIN' ? enderecoCarteira : undefined
      };

      const vendaId = await vendaService.criar(userData.barbeiroId, vendaData);

      // Atualizar estoque de cada produto
      for (const item of carrinho) {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (produto) {
          const novoEstoque = produto.quantidade - item.quantidade;
          await produtoService.atualizarEstoque(
            userData.barbeiroId,
            item.produtoId,
            novoEstoque
          );

          // Criar alerta se estoque mínimo atingido
          if (novoEstoque <= produto.estoqueMinimo) {
            await historicoService.criar(userData.barbeiroId, {
              tipo: 'estoque',
              descricao: `⚠ Produto "${produto.nome}" atingiu estoque mínimo`,
              data: new Date(),
              produto: produto.nome
            });
          }
        }
      }

      // Se for fiado, criar conta a receber
      if (pagamento === 'FIADO') {
        await contaReceberService.criar(userData.barbeiroId, {
          vendaId,
          clienteNome,
          valorTotal,
          valorPago: 0,
          valorRestante: valorTotal,
          status: 'Pendente',
          dataVenda: new Date(),
          observacao
        });
      }

      // Registrar no histórico
      await historicoService.criar(userData.barbeiroId, {
        tipo: 'venda',
        descricao: `Venda realizada - ${pagamento}`,
        data: new Date(),
        valor: valorTotal
      });

      toast({
        title: '✅ Venda registrada com sucesso!',
        description: `Total: R$ ${valorTotal.toFixed(2)}`
      });

      // Limpar formulário
      setCarrinho([]);
      setClienteNome('');
      setObservacao('');
      setChavePix('');
      setNomeBanco('');
      setEnderecoCarteira('');
      setPagamento('DINHEIRO');
      
      // Recarregar produtos para mostrar estoque atualizado
      carregarProdutos();
    } catch (error) {
      console.error('Erro ao concluir venda:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível concluir a venda',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nova Venda</h1>
        <p className="text-muted-foreground">Adicione produtos ao carrinho e finalize a venda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção de Produtos */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Adicionar Produtos</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Buscar Produto</Label>
              <Input
                placeholder="Digite o nome do produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            {busca && (
              <div className="max-h-40 overflow-y-auto border rounded-md">
                {produtosFiltrados.map(produto => (
                  <button
                    key={produto.id}
                    onClick={() => {
                      setProdutoSelecionado(produto.id);
                      setBusca(produto.nome);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-muted flex justify-between items-center"
                  >
                    <span>{produto.nome}</span>
                    <span className="text-sm text-muted-foreground">
                      Estoque: {produto.quantidade}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {produtoSelecionado && (
              <>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                  />
                </div>

                <Button onClick={adicionarAoCarrinho} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar ao Carrinho
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Carrinho */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Carrinho</h2>
          </div>

          {carrinho.length === 0 ? (
            <p className="text-muted-foreground text-sm">Carrinho vazio</p>
          ) : (
            <div className="space-y-3">
              {carrinho.map((item, index) => (
                <motion.div
                  key={item.produtoId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-start p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantidade}x R$ {item.valorUnitario.toFixed(2)}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      R$ {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removerDoCarrinho(item.produtoId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}

              <div className="pt-3 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>R$ {valorTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Forma de Pagamento */}
      {carrinho.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Forma de Pagamento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Método de Pagamento *</Label>
              <Select value={pagamento} onValueChange={(v) => setPagamento(v as FormaPagamentoVenda)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DINHEIRO">💵 Dinheiro</SelectItem>
                  <SelectItem value="PIX">📱 PIX</SelectItem>
                  <SelectItem value="CREDITO">💳 Cartão de Crédito</SelectItem>
                  <SelectItem value="DEBITO">💳 Cartão de Débito</SelectItem>
                  <SelectItem value="TRANSFERENCIA">🏦 Transferência Bancária</SelectItem>
                  <SelectItem value="FIADO">💰 Fiado</SelectItem>
                  <SelectItem value="BITCOIN">₿ Bitcoin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nome do Cliente {pagamento === 'FIADO' && '*'}</Label>
              <Input
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                placeholder="Opcional"
              />
            </div>

            {pagamento === 'PIX' && (
              <div className="space-y-2">
                <Label>Chave PIX</Label>
                <Input
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  placeholder="CPF, E-mail, Telefone ou Chave Aleatória"
                />
              </div>
            )}

            {pagamento === 'TRANSFERENCIA' && (
              <div className="space-y-2">
                <Label>Nome do Banco</Label>
                <Input
                  value={nomeBanco}
                  onChange={(e) => setNomeBanco(e.target.value)}
                  placeholder="Ex: Banco do Brasil"
                />
              </div>
            )}

            {pagamento === 'BITCOIN' && (
              <div className="space-y-2">
                <Label>Endereço da Carteira</Label>
                <Input
                  value={enderecoCarteira}
                  onChange={(e) => setEnderecoCarteira(e.target.value)}
                  placeholder="Endereço Bitcoin"
                />
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label>Observações</Label>
              <Textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Informações adicionais sobre a venda..."
                rows={3}
              />
            </div>
          </div>

          <Button onClick={concluirVenda} className="w-full mt-6" size="lg">
            Concluir Venda - R$ {valorTotal.toFixed(2)}
          </Button>
        </Card>
      )}
    </div>
  );
};
