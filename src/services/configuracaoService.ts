import { db } from '@/config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ConfiguracaoBarbearia } from '@/types';

const COLLECTION = 'configuracoes';

export const configuracaoService = {
  async buscar(barbeiroId: string): Promise<ConfiguracaoBarbearia | null> {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, 'config');
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return docSnap.data() as ConfiguracaoBarbearia;
  },

  async criar(barbeiroId: string, data: ConfiguracaoBarbearia) {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, 'config');
    await setDoc(docRef, data);
  },

  async atualizar(barbeiroId: string, data: Partial<ConfiguracaoBarbearia>) {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, 'config');
    await updateDoc(docRef, data);
  },

  async inicializarPadrao(barbeiroId: string, dadosBarbeiro: any) {
    const configPadrao: ConfiguracaoBarbearia = {
      barbeiroId,
      dadosGerais: {
        nomeBarbearia: dadosBarbeiro.nomeEstabelecimento || '',
        cpfResponsavel: dadosBarbeiro.cpf || '',
        cnpj: dadosBarbeiro.cnpj || '',
        endereco: dadosBarbeiro.endereco 
          ? `${dadosBarbeiro.endereco.rua}, ${dadosBarbeiro.endereco.numero} - ${dadosBarbeiro.endereco.bairro}, ${dadosBarbeiro.endereco.cidade}/${dadosBarbeiro.endereco.estado}`
          : '',
        whatsapp: dadosBarbeiro.telefone || '',
        email: dadosBarbeiro.email || '',
        qtdFuncionarios: dadosBarbeiro.quantidadeFuncionarios || 1
      },
      agenda: {
        diasAtivos: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
        horarioInicio: '09:00',
        horarioFim: '18:00',
        intervalo: 30,
        almoco: '12:00-13:00',
        bloqueios: []
      },
      servicos: dadosBarbeiro.servicos || [],
      pagamentos: {
        aceitaPix: true,
        chavePix: '',
        aceitaFiado: false,
        limiteFiado: 0
      },
      fiscal: {
        diaFechamento: 5,
        regime: 'mei',
        aliquota: 0
      },
      preferencias: {
        tema: 'dark',
        alertaEstoqueMinimo: 5
      }
    };

    await this.criar(barbeiroId, configPadrao);
    return configPadrao;
  }
};
