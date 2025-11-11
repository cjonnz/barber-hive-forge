import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { barbeiroService } from '@/services/barbeiroService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NexusLogo } from '@/components/NexusLogo';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { PlanoTipo } from '@/types';

const cadastroSchema = z.object({
  nomeCompleto: z.string().min(3, 'Nome completo é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  rua: z.string().min(3, 'Rua é obrigatória'),
  numero: z.string().min(1, 'Número é obrigatório'),
  bairro: z.string().min(2, 'Bairro é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
  cep: z.string().min(8, 'CEP inválido').max(9, 'CEP inválido'),
  nomeEstabelecimento: z.string().min(3, 'Nome do estabelecimento é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido').max(18, 'CNPJ inválido'),
  quantidadeFuncionarios: z.string().min(1, 'Informe a quantidade de funcionários'),
  telefone: z.string().min(10, 'Telefone inválido').max(15, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  confirmarSenha: z.string(),
  plano: z.enum(['agenda', 'sparkle', 'blaze'] as const),
  aceitarTermos: z.boolean().refine(val => val === true, 'Você deve aceitar os termos de uso')
}).refine(data => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha']
});

type CadastroForm = z.infer<typeof cadastroSchema>;

export const CadastroBarbearia = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema)
  });

  const planoSelecionado = watch('plano');

  const onSubmit = async (data: CadastroForm) => {
    setLoading(true);
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.senha);
      
      // Criar registro na coleção barbeiros com status pendente
      await barbeiroService.criar(userCredential.user.uid, {
        nomeCompleto: data.nomeCompleto,
        cpf: data.cpf,
        endereco: {
          rua: data.rua,
          numero: data.numero,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep
        },
        nomeEstabelecimento: data.nomeEstabelecimento,
        cnpj: data.cnpj,
        quantidadeFuncionarios: parseInt(data.quantidadeFuncionarios),
        telefone: data.telefone,
        email: data.email,
        servicos: [],
        plano: data.plano as PlanoTipo,
        status: 'pendente',
        dataCadastro: new Date(),
        vencimentoPlano: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        pagamentoTipo: 'mensal',
        modoTeste: false,
        linkPublico: barbeiroService.gerarLinkPublico(data.nomeEstabelecimento),
        totalAgendamentos: 0
      });

      toast.success('Cadastro realizado com sucesso!');
      navigate('/status-pendente');
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      toast.error(error.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NexusLogo size="sm" />
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Cadastro de Barbearia</CardTitle>
              <CardDescription className="text-lg">
                Preencha os dados abaixo para solicitar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Dados do Responsável</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                      <Input {...register('nomeCompleto')} placeholder="Seu nome completo" />
                      {errors.nomeCompleto && <p className="text-sm text-destructive">{errors.nomeCompleto.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input {...register('cpf')} placeholder="000.000.000-00" />
                      {errors.cpf && <p className="text-sm text-destructive">{errors.cpf.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="rua">Rua *</Label>
                      <Input {...register('rua')} placeholder="Nome da rua" />
                      {errors.rua && <p className="text-sm text-destructive">{errors.rua.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número *</Label>
                      <Input {...register('numero')} placeholder="123" />
                      {errors.numero && <p className="text-sm text-destructive">{errors.numero.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro *</Label>
                      <Input {...register('bairro')} placeholder="Bairro" />
                      {errors.bairro && <p className="text-sm text-destructive">{errors.bairro.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input {...register('cidade')} placeholder="Cidade" />
                      {errors.cidade && <p className="text-sm text-destructive">{errors.cidade.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado *</Label>
                      <Input {...register('estado')} placeholder="SP" maxLength={2} />
                      {errors.estado && <p className="text-sm text-destructive">{errors.estado.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP *</Label>
                      <Input {...register('cep')} placeholder="00000-000" />
                      {errors.cep && <p className="text-sm text-destructive">{errors.cep.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Dados da Barbearia */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Dados do Estabelecimento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeEstabelecimento">Nome do Estabelecimento *</Label>
                      <Input {...register('nomeEstabelecimento')} placeholder="Barbearia XYZ" />
                      {errors.nomeEstabelecimento && <p className="text-sm text-destructive">{errors.nomeEstabelecimento.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ *</Label>
                      <Input {...register('cnpj')} placeholder="00.000.000/0000-00" />
                      {errors.cnpj && <p className="text-sm text-destructive">{errors.cnpj.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantidadeFuncionarios">Quantidade de Funcionários *</Label>
                      <Input {...register('quantidadeFuncionarios')} type="number" min="1" placeholder="5" />
                      {errors.quantidadeFuncionarios && <p className="text-sm text-destructive">{errors.quantidadeFuncionarios.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">WhatsApp (com DDD) *</Label>
                      <Input {...register('telefone')} placeholder="(11) 99999-9999" />
                      {errors.telefone && <p className="text-sm text-destructive">{errors.telefone.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Dados de Acesso */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Dados de Acesso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input {...register('email')} type="email" placeholder="seu@email.com" />
                      {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha *</Label>
                      <div className="relative">
                        <Input 
                          {...register('senha')} 
                          type={showPassword ? 'text' : 'password'} 
                          placeholder="Mínimo 8 caracteres"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.senha && <p className="text-sm text-destructive">{errors.senha.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <div className="relative">
                      <Input 
                        {...register('confirmarSenha')} 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        placeholder="Repita a senha"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmarSenha && <p className="text-sm text-destructive">{errors.confirmarSenha.message}</p>}
                  </div>
                </div>

                {/* Plano */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-primary">Escolha seu Plano</h3>
                  <div className="space-y-2">
                    <Label htmlFor="plano">Plano Inicial *</Label>
                    <Select onValueChange={(value) => setValue('plano', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agenda">Agenda Plan - R$ 29,99/mês (250 agendamentos)</SelectItem>
                        <SelectItem value="sparkle">Sparkle - R$ 38,90/mês (350 agendamentos)</SelectItem>
                        <SelectItem value="blaze">Blaze - R$ 69,00/mês (500 agendamentos)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.plano && <p className="text-sm text-destructive">{errors.plano.message}</p>}
                  </div>
                </div>

                {/* Termos */}
                <div className="flex items-start space-x-3 space-y-0">
                  <Checkbox
                    id="termos"
                    onCheckedChange={(checked) => setValue('aceitarTermos', checked as boolean)}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="termos" className="cursor-pointer">
                      Aceito os termos de uso e política de privacidade *
                    </Label>
                    {errors.aceitarTermos && <p className="text-sm text-destructive">{errors.aceitarTermos.message}</p>}
                  </div>
                </div>

                {/* Botão */}
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cadastrando...
                    </>
                  ) : (
                    'Solicitar Cadastro'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};
