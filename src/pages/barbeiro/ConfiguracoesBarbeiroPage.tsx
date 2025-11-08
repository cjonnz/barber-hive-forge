import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { configuracaoService } from '@/services/configuracaoService';
import { barbeiroService } from '@/services/barbeiroService';
import { ConfiguracaoBarbearia, Servico, RegimeFiscal } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Calendar, 
  Scissors, 
  CreditCard, 
  FileText, 
  Palette,
  Trash2,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ConfiguracoesBarbeiroPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ConfiguracaoBarbearia | null>(null);

  useEffect(() => {
    carregarConfiguracoes();
  }, [userData]);

  const carregarConfiguracoes = async () => {
    if (!userData?.barbeiroId) return;

    try {
      setLoading(true);
      let configuracao = await configuracaoService.buscar(userData.barbeiroId);
      
      if (!configuracao) {
        // Buscar dados do barbeiro para inicializar
        const dadosBarbeiro = await barbeiroService.buscarPorId(userData.barbeiroId);
        configuracao = await configuracaoService.inicializarPadrao(
          userData.barbeiroId,
          dadosBarbeiro
        );
      }
      
      setConfig(configuracao);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const salvarSecao = async (secao: Partial<ConfiguracaoBarbearia>) => {
    if (!userData?.barbeiroId || !config) return;

    try {
      await configuracaoService.atualizar(userData.barbeiroId, secao);
      toast({ title: 'Configurações salvas com sucesso!' });
      carregarConfiguracoes();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações',
        variant: 'destructive'
      });
    }
  };

  const adicionarServico = () => {
    if (!config) return;
    const novosServicos = [
      ...config.servicos,
      { nome: '', preco: 0, duracao: 30 }
    ];
    setConfig({ ...config, servicos: novosServicos });
  };

  const removerServico = (index: number) => {
    if (!config) return;
    const novosServicos = config.servicos.filter((_, i) => i !== index);
    setConfig({ ...config, servicos: novosServicos });
  };

  const atualizarServico = (index: number, campo: keyof Servico, valor: any) => {
    if (!config) return;
    const novosServicos = [...config.servicos];
    novosServicos[index] = { ...novosServicos[index], [campo]: valor };
    setConfig({ ...config, servicos: novosServicos });
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Configure todos os aspectos da sua barbearia</p>
      </div>

      {/* Dados da Barbearia */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Dados da Barbearia</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome da Barbearia</Label>
              <Input
                value={config.dadosGerais.nomeBarbearia}
                onChange={(e) => setConfig({
                  ...config,
                  dadosGerais: { ...config.dadosGerais, nomeBarbearia: e.target.value }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input
                value={config.dadosGerais.cnpj}
                onChange={(e) => setConfig({
                  ...config,
                  dadosGerais: { ...config.dadosGerais, cnpj: e.target.value }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={config.dadosGerais.whatsapp}
                onChange={(e) => setConfig({
                  ...config,
                  dadosGerais: { ...config.dadosGerais, whatsapp: e.target.value }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={config.dadosGerais.email}
                onChange={(e) => setConfig({
                  ...config,
                  dadosGerais: { ...config.dadosGerais, email: e.target.value }
                })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Endereço Completo</Label>
              <Input
                value={config.dadosGerais.endereco}
                onChange={(e) => setConfig({
                  ...config,
                  dadosGerais: { ...config.dadosGerais, endereco: e.target.value }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Quantidade de Funcionários</Label>
              <Input
                type="number"
                min="1"
                value={config.dadosGerais.qtdFuncionarios}
                onChange={(e) => setConfig({
                  ...config,
                  dadosGerais: { ...config.dadosGerais, qtdFuncionarios: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>

          <Button 
            onClick={() => salvarSecao({ dadosGerais: config.dadosGerais })}
            className="mt-4"
          >
            Salvar Dados
          </Button>
        </Card>
      </motion.div>

      {/* Agenda e Horários */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Agenda e Horários</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-2">Dias Ativos</Label>
              <div className="flex flex-wrap gap-2">
                {['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].map(dia => (
                  <Button
                    key={dia}
                    variant={config.agenda.diasAtivos.includes(dia) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const novos = config.agenda.diasAtivos.includes(dia)
                        ? config.agenda.diasAtivos.filter(d => d !== dia)
                        : [...config.agenda.diasAtivos, dia];
                      setConfig({
                        ...config,
                        agenda: { ...config.agenda, diasAtivos: novos }
                      });
                    }}
                  >
                    {dia.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Horário de Abertura</Label>
                <Input
                  type="time"
                  value={config.agenda.horarioInicio}
                  onChange={(e) => setConfig({
                    ...config,
                    agenda: { ...config.agenda, horarioInicio: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Horário de Fechamento</Label>
                <Input
                  type="time"
                  value={config.agenda.horarioFim}
                  onChange={(e) => setConfig({
                    ...config,
                    agenda: { ...config.agenda, horarioFim: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Intervalo (minutos)</Label>
                <Input
                  type="number"
                  min="15"
                  step="15"
                  value={config.agenda.intervalo}
                  onChange={(e) => setConfig({
                    ...config,
                    agenda: { ...config.agenda, intervalo: parseInt(e.target.value) }
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Horário de Almoço</Label>
              <Input
                placeholder="Ex: 12:00-13:00"
                value={config.agenda.almoco}
                onChange={(e) => setConfig({
                  ...config,
                  agenda: { ...config.agenda, almoco: e.target.value }
                })}
              />
            </div>
          </div>

          <Button 
            onClick={() => salvarSecao({ agenda: config.agenda })}
            className="mt-4"
          >
            Salvar Horários
          </Button>
        </Card>
      </motion.div>

      {/* Serviços */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Serviços e Preços</h2>
            </div>
            <Button onClick={adicionarServico} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-3">
            {config.servicos.map((servico, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Nome do Serviço</Label>
                  <Input
                    value={servico.nome}
                    onChange={(e) => atualizarServico(index, 'nome', e.target.value)}
                    placeholder="Ex: Corte Masculino"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Preço</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={servico.preco}
                    onChange={(e) => atualizarServico(index, 'preco', parseFloat(e.target.value))}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Duração (min)</Label>
                  <Input
                    type="number"
                    value={servico.duracao}
                    onChange={(e) => atualizarServico(index, 'duracao', parseInt(e.target.value))}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removerServico(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button 
            onClick={() => salvarSecao({ servicos: config.servicos })}
            className="mt-4"
          >
            Salvar Serviços
          </Button>
        </Card>
      </motion.div>

      {/* Pagamentos */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Pagamentos e Fiado</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="aceitaPix"
                checked={config.pagamentos.aceitaPix}
                onChange={(e) => setConfig({
                  ...config,
                  pagamentos: { ...config.pagamentos, aceitaPix: e.target.checked }
                })}
                className="rounded"
              />
              <Label htmlFor="aceitaPix">Aceitar PIX</Label>
            </div>

            {config.pagamentos.aceitaPix && (
              <div className="space-y-2">
                <Label>Chave PIX</Label>
                <Input
                  value={config.pagamentos.chavePix || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    pagamentos: { ...config.pagamentos, chavePix: e.target.value }
                  })}
                  placeholder="CPF, E-mail, Telefone ou Chave Aleatória"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="aceitaFiado"
                checked={config.pagamentos.aceitaFiado}
                onChange={(e) => setConfig({
                  ...config,
                  pagamentos: { ...config.pagamentos, aceitaFiado: e.target.checked }
                })}
                className="rounded"
              />
              <Label htmlFor="aceitaFiado">Aceitar Fiado</Label>
            </div>

            {config.pagamentos.aceitaFiado && (
              <div className="space-y-2">
                <Label>Limite de Fiado por Cliente</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={config.pagamentos.limiteFiado}
                  onChange={(e) => setConfig({
                    ...config,
                    pagamentos: { ...config.pagamentos, limiteFiado: parseFloat(e.target.value) }
                  })}
                />
              </div>
            )}
          </div>

          <Button 
            onClick={() => salvarSecao({ pagamentos: config.pagamentos })}
            className="mt-4"
          >
            Salvar Pagamentos
          </Button>
        </Card>
      </motion.div>

      {/* Fiscal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Configurações Fiscais</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Dia de Fechamento</Label>
              <Input
                type="number"
                min="1"
                max="28"
                value={config.fiscal.diaFechamento}
                onChange={(e) => setConfig({
                  ...config,
                  fiscal: { ...config.fiscal, diaFechamento: parseInt(e.target.value) }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Regime Tributário</Label>
              <Select
                value={config.fiscal.regime}
                onValueChange={(v) => setConfig({
                  ...config,
                  fiscal: { ...config.fiscal, regime: v as RegimeFiscal }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autonomo">Autônomo</SelectItem>
                  <SelectItem value="mei">MEI</SelectItem>
                  <SelectItem value="simples">Simples Nacional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Alíquota (%)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={config.fiscal.aliquota}
                onChange={(e) => setConfig({
                  ...config,
                  fiscal: { ...config.fiscal, aliquota: parseFloat(e.target.value) }
                })}
              />
            </div>
          </div>

          <Button 
            onClick={() => salvarSecao({ fiscal: config.fiscal })}
            className="mt-4"
          >
            Salvar Configurações Fiscais
          </Button>
        </Card>
      </motion.div>

      {/* Preferências */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Preferências e Temas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select
                value={config.preferencias.tema}
                onValueChange={(v) => setConfig({
                  ...config,
                  preferencias: { ...config.preferencias, tema: v as 'light' | 'dark' }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Alerta de Estoque Mínimo</Label>
              <Input
                type="number"
                min="1"
                value={config.preferencias.alertaEstoqueMinimo}
                onChange={(e) => setConfig({
                  ...config,
                  preferencias: { ...config.preferencias, alertaEstoqueMinimo: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>

          <Button 
            onClick={() => salvarSecao({ preferencias: config.preferencias })}
            className="mt-4"
          >
            Salvar Preferências
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};
