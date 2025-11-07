import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Settings, Bell, Mail, Shield, Database, Save } from 'lucide-react';
import { toast } from 'sonner';

export const ConfiguracoesPage = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    sistemaEmail: 'contato@nexus.com',
    emailSMTP: '',
    whatsappAPI: '',
    backupAutomatico: true,
    notificacoesEmail: true,
    notificacoesWhatsApp: false
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Aqui você implementaria a lógica de salvar as configurações
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações gerais do sistema</p>
      </div>

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
                <Button variant="outline" size="sm">Ativar</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Logs de Acesso</Label>
                  <p className="text-xs text-muted-foreground">Registrar todos os acessos ao sistema</p>
                </div>
                <Button variant="outline" size="sm">Ativado</Button>
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
                <Button variant="outline" size="sm">Ativado</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Último Backup</Label>
                  <p className="text-xs text-muted-foreground">Hoje, 03:00</p>
                </div>
                <Button variant="outline" size="sm">Fazer Backup Agora</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
          disabled={loading}
          className="min-w-[200px]"
        >
          <Save className="w-5 h-5 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </motion.div>
    </div>
  );
};
