import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NexusLogo } from '@/components/NexusLogo';
import { barbeiroService } from '@/services/barbeiroService';
import { agendamentoService } from '@/services/agendamentoService';
import { Barbeiro, Servico } from '@/types';
import { Calendar as CalendarIcon, Clock, MapPin, Phone, Scissors, CheckCircle } from 'lucide-react';
import { addDays, format, isBefore, setHours, setMinutes, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export const AgendamentoPublico = () => {
  const { linkPublico } = useParams<{ linkPublico: string }>();
  const navigate = useNavigate();
  const [barbeiro, setBarbeiro] = useState<Barbeiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [selectedHorario, setSelectedHorario] = useState<string>('');
  const [formData, setFormData] = useState({
    clienteNome: '',
    clienteWhatsapp: '',
    comentario: ''
  });

  useEffect(() => {
    loadBarbeiro();
  }, [linkPublico]);

  const loadBarbeiro = async () => {
    try {
      const barbeiros = await barbeiroService.listarTodos();
      const found = barbeiros.find(b => b.linkPublico === linkPublico);
      
      if (!found) {
        navigate('/404');
        return;
      }
      
      if (found.status !== 'ativo') {
        toast.error('Esta barbearia não está disponível para agendamentos no momento');
        navigate('/');
        return;
      }
      
      setBarbeiro(found);
    } catch (error) {
      toast.error('Erro ao carregar dados da barbearia');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const gerarHorariosDisponiveis = () => {
    const horarios: string[] = [];
    for (let h = 8; h <= 18; h++) {
      horarios.push(`${h.toString().padStart(2, '0')}:00`);
      if (h < 18) {
        horarios.push(`${h.toString().padStart(2, '0')}:30`);
      }
    }
    return horarios;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedServico || !selectedHorario) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!formData.clienteNome || !formData.clienteWhatsapp) {
      toast.error('Preencha seu nome e WhatsApp');
      return;
    }

    setSubmitting(true);
    try {
      const [hora, minuto] = selectedHorario.split(':').map(Number);
      const dataAgendamento = setMinutes(setHours(selectedDate, hora), minuto);

      const disponivel = await agendamentoService.verificarDisponibilidade(
        barbeiro!.id,
        dataAgendamento,
        selectedHorario,
        selectedServico.duracao
      );

      if (!disponivel) {
        toast.error('Este horário não está mais disponível. Escolha outro.');
        setSubmitting(false);
        return;
      }

      await agendamentoService.criar({
        barbeiroId: barbeiro!.id,
        clienteNome: formData.clienteNome,
        clienteWhatsapp: formData.clienteWhatsapp,
        servico: selectedServico.nome,
        data: dataAgendamento,
        hora: selectedHorario,
        duracao: selectedServico.duracao,
        comentario: formData.comentario,
        status: 'pendente'
      });

      setSuccess(true);
      toast.success('Agendamento realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao realizar agendamento');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!barbeiro) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-border/50 text-center">
            <CardContent className="pt-12 pb-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Agendamento Confirmado!</h2>
              <p className="text-muted-foreground mb-6">
                Seu agendamento foi realizado com sucesso. Em breve você receberá uma confirmação via WhatsApp.
              </p>
              <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg mb-6">
                <p><strong>Data:</strong> {format(selectedDate!, "dd/MM/yyyy")}</p>
                <p><strong>Horário:</strong> {selectedHorario}</p>
                <p><strong>Serviço:</strong> {selectedServico?.nome}</p>
                <p><strong>Valor:</strong> R$ {selectedServico?.preco.toFixed(2)}</p>
              </div>
              <Button onClick={() => window.location.reload()} className="w-full">
                Fazer Outro Agendamento
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <NexusLogo size="sm" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Info da Barbearia */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {barbeiro.nomeEstabelecimento}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {barbeiro.endereco.cidade}/{barbeiro.endereco.estado}
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              {barbeiro.telefone}
            </span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seleção de Serviço e Data */}
            <div className="space-y-6">
              {/* Serviços */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scissors className="w-5 h-5 text-primary" />
                      Escolha o Serviço
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {barbeiro.servicos.map((servico) => (
                      <button
                        key={servico.nome}
                        type="button"
                        onClick={() => setSelectedServico(servico)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedServico?.nome === servico.nome
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-foreground">{servico.nome}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {servico.duracao} minutos
                            </p>
                          </div>
                          <p className="text-lg font-bold text-primary">
                            R$ {servico.preco.toFixed(2)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Calendário */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Escolha a Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={ptBR}
                      disabled={(date) =>
                        isBefore(date, startOfDay(new Date())) || date > addDays(new Date(), 30)
                      }
                      className="rounded-md border border-border mx-auto"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Horários */}
              {selectedDate && selectedServico && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Escolha o Horário
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {gerarHorariosDisponiveis().map((horario) => (
                          <button
                            key={horario}
                            type="button"
                            onClick={() => setSelectedHorario(horario)}
                            className={`p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                              selectedHorario === horario
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border hover:border-primary/50 text-foreground'
                            }`}
                          >
                            {horario}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Formulário de Dados */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50 sticky top-24">
                <CardHeader>
                  <CardTitle>Seus Dados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      required
                      value={formData.clienteNome}
                      onChange={(e) => setFormData({ ...formData, clienteNome: e.target.value })}
                      placeholder="Digite seu nome"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp *</Label>
                    <Input
                      id="whatsapp"
                      required
                      value={formData.clienteWhatsapp}
                      onChange={(e) => setFormData({ ...formData, clienteWhatsapp: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comentario">Observações</Label>
                    <Textarea
                      id="comentario"
                      value={formData.comentario}
                      onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                      placeholder="Alguma observação sobre o atendimento? (opcional)"
                      rows={3}
                    />
                  </div>

                  {selectedDate && selectedServico && selectedHorario && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                      <p className="font-semibold text-foreground">Resumo do Agendamento:</p>
                      <p><strong>Data:</strong> {format(selectedDate, "dd/MM/yyyy")}</p>
                      <p><strong>Horário:</strong> {selectedHorario}</p>
                      <p><strong>Serviço:</strong> {selectedServico.nome}</p>
                      <p><strong>Duração:</strong> {selectedServico.duracao} min</p>
                      <p className="text-lg font-bold text-primary pt-2">
                        Total: R$ {selectedServico.preco.toFixed(2)}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!selectedDate || !selectedServico || !selectedHorario || !formData.clienteNome || !formData.clienteWhatsapp || submitting}
                  >
                    {submitting ? 'Agendando...' : 'Confirmar Agendamento'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};
