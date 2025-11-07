import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NexusLogo } from '@/components/NexusLogo';
import { Clock, Mail, CheckCircle } from 'lucide-react';

export const StatusPendente = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <NexusLogo size="lg" showTagline={false} />
        </div>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Clock className="w-10 h-10 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Cadastro em Análise</CardTitle>
            <CardDescription className="text-lg">
              Seu perfil está em análise. Em breve entraremos em contato após a verificação dos dados.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Verificação por E-mail</h4>
                  <p className="text-sm text-muted-foreground">
                    Você receberá uma notificação no e-mail cadastrado assim que seu perfil for aprovado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Processo de Aprovação</h4>
                  <p className="text-sm text-muted-foreground">
                    Nossa equipe está verificando seus dados. Este processo geralmente leva até 24 horas úteis.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-center">
                <strong>Importante:</strong> Mantenha seu e-mail sempre atualizado para receber as notificações do sistema.
              </p>
            </div>

            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              Voltar para o Início
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Dúvidas? Entre em contato: <a href="mailto:suporte@nexus.com" className="text-primary hover:underline">suporte@nexus.com</a>
        </p>
      </motion.div>
    </div>
  );
};
