import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { adminService } from '@/services/adminService';
import { AdminPerfil } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mail, Phone, ShieldCheck } from 'lucide-react';

interface PerfilFormState {
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  cargo: string;
  bio: string;
  fotoUrl: string;
  notificacoesEmail: boolean;
  notificacoesWhatsapp: boolean;
}

const perfilInicial: PerfilFormState = {
  nome: '',
  email: '',
  telefone: '',
  whatsapp: '',
  cargo: 'Administrador',
  bio: '',
  fotoUrl: '',
  notificacoesEmail: true,
  notificacoesWhatsapp: false
};

export const AdminPerfilPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState<PerfilFormState>(perfilInicial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [perfilAtual, setPerfilAtual] = useState<AdminPerfil | null>(null);

  useEffect(() => {
    const carregarPerfil = async () => {
      if (!user?.uid) {
        return;
      }

      setLoading(true);
      try {
        const perfil = await adminService.obterPerfil(user.uid);

        if (perfil) {
          setPerfilAtual(perfil);
          setForm({
            nome: perfil.nome,
            email: perfil.email || user.email || '',
            telefone: perfil.telefone || '',
            whatsapp: perfil.whatsapp || '',
            cargo: perfil.cargo || 'Administrador',
            bio: perfil.bio || '',
            fotoUrl: perfil.fotoUrl || '',
            notificacoesEmail: perfil.notificacoesEmail,
            notificacoesWhatsapp: perfil.notificacoesWhatsapp
          });
        } else {
          setForm({
            ...perfilInicial,
            nome: user.displayName || '',
            email: user.email || ''
          });
        }
      } catch (error) {
        console.error('Erro ao carregar perfil do administrador:', error);
        toast.error('Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [user?.uid, user?.email, user?.displayName]);

  const handleChange = (field: keyof PerfilFormState) => (value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const initials = useMemo(() => {
    if (form.nome) {
      return form.nome
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }

    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }

    return 'AD';
  }, [form.nome, user?.email]);

  const ultimaAtualizacao = useMemo(() => {
    const data = perfilAtual?.atualizadoEm || perfilAtual?.criadoEm;
    return data ? format(data, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR }) : null;
  }, [perfilAtual]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user?.uid) {
      toast.error('Usuário não autenticado. Faça login novamente.');
      return;
    }

    setSaving(true);
    try {
      await adminService.salvarPerfil(user.uid, {
        nome: form.nome || 'Administrador',
        email: form.email || user.email || '',
        telefone: form.telefone,
        whatsapp: form.whatsapp,
        cargo: form.cargo,
        bio: form.bio,
        fotoUrl: form.fotoUrl,
        notificacoesEmail: form.notificacoesEmail,
        notificacoesWhatsapp: form.notificacoesWhatsapp
      });

      toast.success('Perfil atualizado com sucesso!');
      setPerfilAtual(prev => ({
        id: prev?.id || user.uid,
        nome: form.nome || 'Administrador',
        email: form.email || user.email || '',
        telefone: form.telefone,
        whatsapp: form.whatsapp,
        cargo: form.cargo,
        bio: form.bio,
        fotoUrl: form.fotoUrl,
        notificacoesEmail: form.notificacoesEmail,
        notificacoesWhatsapp: form.notificacoesWhatsapp,
        criadoEm: prev?.criadoEm || new Date(),
        atualizadoEm: new Date()
      }));
    } catch (error) {
      console.error('Erro ao salvar perfil do administrador:', error);
      toast.error('Não foi possível salvar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie as informações da conta administrativa Nexus
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              {form.fotoUrl ? <AvatarImage src={form.fotoUrl} alt={form.nome} /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{form.nome || 'Administrador Nexus'}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Acesso privilegiado às áreas administrativas
              </CardDescription>
              {ultimaAtualizacao && (
                <p className="text-xs text-muted-foreground mt-2">
                  Última atualização: {ultimaAtualizacao}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(event) => handleChange('nome')(event.target.value)}
                placeholder="Nome do administrador"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={form.cargo}
                onChange={(event) => handleChange('cargo')(event.target.value)}
                placeholder="Função principal"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(event) => handleChange('bio')(event.target.value)}
                placeholder="Conte um pouco sobre você e a missão do Nexus"
                rows={4}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="foto">Foto (URL)</Label>
              <Input
                id="foto"
                value={form.fotoUrl}
                onChange={(event) => handleChange('fotoUrl')(event.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contatos
              </CardTitle>
              <CardDescription>Dados de contato para notificações e suporte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange('email')(event.target.value)}
                  placeholder="email@nexus.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={form.telefone}
                  onChange={(event) => handleChange('telefone')(event.target.value)}
                  placeholder="(00) 0000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={form.whatsapp}
                  onChange={(event) => handleChange('whatsapp')(event.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Preferências de notificações
              </CardTitle>
              <CardDescription>Controle como deseja ser avisado sobre os eventos da plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por email</p>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas de novos cadastros e movimentações críticas
                  </p>
                </div>
                <Switch
                  checked={form.notificacoesEmail}
                  onCheckedChange={(checked) => handleChange('notificacoesEmail')(checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações via WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas instantâneos no número cadastrado
                  </p>
                </div>
                <Switch
                  checked={form.notificacoesWhatsapp}
                  onCheckedChange={(checked) => handleChange('notificacoesWhatsapp')(checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={saving} className="min-w-[200px]">
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
};
