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
import { Venda, ItemVenda } from '@/types';

const COLLECTION = 'vendas';

export const vendaService = {
  async criar(barbeiroId: string, data: Omit<Venda, 'id' | 'barbeiroId'>) {
    const vendaRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    const docRef = await addDoc(vendaRef, {
      ...data,
      barbeiroId,
      data: Timestamp.fromDate(data.data)
    });
    return docRef.id;
  },

  async atualizar(barbeiroId: string, vendaId: string, data: Partial<Venda>) {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, vendaId);
    await updateDoc(docRef, data);
  },

  async buscarPorId(barbeiroId: string, vendaId: string): Promise<Venda | null> {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, vendaId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      data: data.data?.toDate() || new Date()
    } as Venda;
  },

  async listar(barbeiroId: string, pageLimit: number = 30) {
    const vendasRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    
    const q = query(
      vendasRef,
      orderBy('data', 'desc'),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data?.toDate() || new Date()
    })) as Venda[];
  },

  async listarPorPeriodo(
    barbeiroId: string, 
    dataInicio: Date, 
    dataFim: Date
  ) {
    const vendasRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    
    const q = query(
      vendasRef,
      where('data', '>=', Timestamp.fromDate(dataInicio)),
      where('data', '<=', Timestamp.fromDate(dataFim)),
      orderBy('data', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data?.toDate() || new Date()
    })) as Venda[];
  },

  async listarPorFormaPagamento(
    barbeiroId: string,
    formaPagamento: string
  ) {
    const vendasRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    
    const q = query(
      vendasRef,
      where('pagamento', '==', formaPagamento),
      orderBy('data', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data?.toDate() || new Date()
    })) as Venda[];
  }
};
