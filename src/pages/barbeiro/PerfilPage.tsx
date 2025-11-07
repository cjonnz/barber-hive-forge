import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Building, Calendar, CreditCard, Link as LinkIcon, Save, Copy, Check } from 'lucide-react';
import { barbeiroService } from '@/services/barbeiroService';
import { useAuth } from '@/hooks/useAuth';
import { Barbeiro, PLANOS } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export const PerfilPage = () => {
  const { userData } = useAuth();
  const [barbeiro, setBarbeiro] = useState<Barbeiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    telefone: '',
    endereco: '',
    nomeEstabelecimento: ''
  });

  useEffect(() => {
    if (userData?.barbeiroId) {
      loadDados();
    }
  }, [userData]);

  const loadDados = async () => {
    try {
      const data = await barbeiroService.buscarPorId(userData!.barbeiroId!);
      if (data) {
        setBarbeiro(data);
        setFormData({
          nomeCompleto: data.nomeCompleto,
          telefone: data.telefone,
          endereco: data.endereco,
          nomeEstabelecimento: data.nomeEstabelecimento
        });
      }
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await barbeiroService.atualizar(userData!.barbeiroId!, formData);
      setBarbeiro(prev => prev ? { ...prev, ...formData } : null);
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar dados');
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    if (barbeiro) {
      const link = `${window.location.origin}/${barbeiro.linkPublico}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!barbeiro) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Dados não encontrados</p>
      </div>
    );
  }

  const plano = PLANOS.find(p => p.nome === barbeiro.plano);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie seus dados e configurações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Plano */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Plano Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge className="text-lg px-3 py-1 bg-gradient-to-r from-primary to-primary/80">
                  {plano?.label}
                </Badge>
                <p className="text-2xl font-bold text-foreground mt-2">
                  R$ {plano?.preco[barbeiro.pagamentoTipo].toFixed(2)}
                  <span className="text-sm text-muted-foreground font-normal">
                    /{barbeiro.pagamentoTipo === 'mensal' ? 'mês' : barbeiro.pagamentoTipo === 'semestral' ? 'semestre' : 'ano'}
                  </span>
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={barbeiro.status === 'ativo' ? 'default' : 'secondary'}>
                    {barbeiro.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vencimento</span>
                  <span className="font-medium text-foreground">
                    {format(barbeiro.vencimentoPlano, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Agendamentos</span>
                  <span className="font-medium text-foreground">
                    {barbeiro.totalAgendamentos}
                    {plano?.agendamentosMensais !== -1 && ` / ${plano?.agendamentosMensais}`}
                  </span>
                </div>
              </div>

              {barbeiro.modoTeste && (
                <Badge variant="outline" className="w-full justify-center">
                  Modo de Teste
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Link Público */}
          <Card className="border-border/50 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                Link Público
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Compartilhe este link para seus clientes agendarem
              </p>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/${barbeiro.linkPublico}`}
                  readOnly
                  className="text-sm"
                />
                <Button size="icon" onClick={copyLink}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dados Pessoais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo</Label>
                  <Input
                    id="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={barbeiro.cpf}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={barbeiro.email}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nomeEstabelecimento">Nome do Estabelecimento</Label>
                  <Input
                    id="nomeEstabelecimento"
                    value={formData.nomeEstabelecimento}
                    onChange={(e) => setFormData({ ...formData, nomeEstabelecimento: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Informações da Conta</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      Cadastrado em {format(barbeiro.dataCadastro, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="min-w-[150px]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
