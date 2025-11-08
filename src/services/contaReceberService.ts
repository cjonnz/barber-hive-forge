import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { ContaReceber } from '@/types';

const COLLECTION = 'contas_a_receber';

export const contaReceberService = {
  async criar(barbeiroId: string, data: Omit<ContaReceber, 'id' | 'barbeiroId'>) {
    const contaRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    const docRef = await addDoc(contaRef, {
      ...data,
      barbeiroId,
      dataVenda: Timestamp.fromDate(data.dataVenda),
      dataPagamento: data.dataPagamento ? Timestamp.fromDate(data.dataPagamento) : null
    });
    return docRef.id;
  },

  async atualizar(barbeiroId: string, contaId: string, data: Partial<ContaReceber>) {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, contaId);
    const updateData: any = { ...data };
    
    if (data.dataPagamento) {
      updateData.dataPagamento = Timestamp.fromDate(data.dataPagamento);
    }
    
    await updateDoc(docRef, updateData);
  },

  async buscarPorId(barbeiroId: string, contaId: string): Promise<ContaReceber | null> {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, contaId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      dataVenda: data.dataVenda?.toDate() || new Date(),
      dataPagamento: data.dataPagamento?.toDate() || undefined
    } as ContaReceber;
  },

  async listar(barbeiroId: string, pageLimit: number = 30) {
    const contasRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    
    const q = query(
      contasRef,
      orderBy('dataVenda', 'desc'),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dataVenda: data.dataVenda?.toDate() || new Date(),
        dataPagamento: data.dataPagamento?.toDate() || undefined
      };
    }) as ContaReceber[];
  },

  async listarPendentes(barbeiroId: string) {
    const contasRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    
    const q = query(
      contasRef,
      where('status', 'in', ['Pendente', 'Pago Parcial']),
      orderBy('dataVenda', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dataVenda: data.dataVenda?.toDate() || new Date(),
        dataPagamento: data.dataPagamento?.toDate() || undefined
      };
    }) as ContaReceber[];
  },

  async registrarPagamento(
    barbeiroId: string, 
    contaId: string, 
    valorPago: number
  ) {
    const conta = await this.buscarPorId(barbeiroId, contaId);
    if (!conta) throw new Error('Conta não encontrada');

    const novoValorPago = conta.valorPago + valorPago;
    const valorRestante = conta.valorTotal - novoValorPago;
    const status = valorRestante <= 0 ? 'Pago' : 'Pago Parcial';

    await this.atualizar(barbeiroId, contaId, {
      valorPago: novoValorPago,
      valorRestante,
      status,
      dataPagamento: new Date()
    });
  }
};
