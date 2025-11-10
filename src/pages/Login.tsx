import { useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NexusLogo } from '@/components/NexusLogo';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error('Informe seu email para redefinir a senha.');
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Enviamos um link para redefinição da senha.');
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição:', error);
      toast.error('Não foi possível enviar o email de redefinição.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border shadow-card">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <NexusLogo size="lg" showTagline />
            </div>
            <div>
              <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || resetLoading}
              >
                {loading ? (
                  'Entrando...'
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handlePasswordReset}
                disabled={resetLoading || loading}
              >
                {resetLoading ? 'Enviando...' : 'Esqueci minha senha'}
              </Button>
            </form>
            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>Sistema de gestão profissional para barbearias</p>
              <p className="mt-1">© 2024 Nexus by Jon</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
