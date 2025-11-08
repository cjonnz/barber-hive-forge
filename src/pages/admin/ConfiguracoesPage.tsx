import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Mail, Shield, Database, Save } from 'lucide-react';
import { toast } from 'sonner';
import { sistemaService } from '@/services/sistemaService';
import { SistemaConfiguracao } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const configuracaoPadrao: SistemaConfiguracao = {
  sistemaEmail: 'contato@nexus.com',
  emailSMTP: '',
  whatsappAPI: '',
  backupAutomatico: true,
  notificacoesEmail: true,
  notificacoesWhatsApp: false,
  autenticacaoDoisFatores: false,
  logsAtivos: true
};

export const ConfiguracoesPage = () => {
  const [config, setConfig] = useState<SistemaConfiguracao>(configuracaoPadrao);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      setLoading(true);
      try {
        const dados = await sistemaService.obterConfiguracao();
        if (dados) {
          setConfig(prev => ({ ...prev, ...dados }));
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do sistema:', error);
        toast.error('Não foi possível carregar as configurações.');
      } finally {
        setLoading(false);
      }
    };

    carregarConfiguracoes();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await sistemaService.salvarConfiguracao(config);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações gerais do sistema</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações de Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>Configurações de envio de emails</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sistema-email">Email do Sistema</Label>
                <Input
                  id="sistema-email"
                  type="email"
                  value={config.sistemaEmail}
                  onChange={(e) => setConfig({ ...config, sistemaEmail: e.target.value })}
                  placeholder="contato@nexus.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp">Servidor SMTP</Label>
                <Input
                  id="smtp"
                  value={config.emailSMTP}
                  onChange={(e) => setConfig({ ...config, emailSMTP: e.target.value })}
                  placeholder="smtp.exemplo.com"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Configurações de WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Bell className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <CardTitle>WhatsApp</CardTitle>
                  <CardDescription>Integração com WhatsApp Business API</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-api">API Key WhatsApp</Label>
                <Input
                  id="whatsapp-api"
                  type="password"
                  value={config.whatsappAPI}
                  onChange={(e) => setConfig({ ...config, whatsappAPI: e.target.value })}
                  placeholder="Insira sua API Key"
                />
                <p className="text-xs text-muted-foreground">
                  Obtenha sua chave em business.whatsapp.com
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Configurações de Segurança */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Configurações de segurança e privacidade</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-xs text-muted-foreground">Adicione uma camada extra de segurança</p>
                </div>
                <Switch
                  checked={Boolean(config.autenticacaoDoisFatores)}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({ ...prev, autenticacaoDoisFatores: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Logs de Acesso</Label>
                  <p className="text-xs text-muted-foreground">Registrar todos os acessos ao sistema</p>
                </div>
                <Switch
                  checked={Boolean(config.logsAtivos)}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({ ...prev, logsAtivos: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Configurações de Backup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Database className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle>Backup</CardTitle>
                  <CardDescription>Backup automático dos dados</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Backup Automático</Label>
                  <p className="text-xs text-muted-foreground">Backup diário às 03:00</p>
                </div>
                <Switch
                  checked={config.backupAutomatico}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({ ...prev, backupAutomatico: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Último Backup</Label>
                  <p className="text-xs text-muted-foreground">
                    {config.atualizadoEm
                      ? `Realizado ${formatDistanceToNow(config.atualizadoEm, { locale: ptBR, addSuffix: true })}`
                      : 'Nunca foi executado'}
                  </p>
                </div>
                <Button variant="outline" size="sm">Fazer Backup Agora</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Botão Salvar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <Button
          size="lg"
          onClick={handleSave}
          disabled={saving || loading}
          className="min-w-[200px]"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </motion.div>
    </div>
  );
};
