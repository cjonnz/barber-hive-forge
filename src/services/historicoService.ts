import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { HistoricoLog } from '@/types';

const COLLECTION = 'historico';

export const historicoService = {
  async criar(barbeiroId: string, data: Omit<HistoricoLog, 'id' | 'barbeiroId'>) {
    const historicoRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    await addDoc(historicoRef, {
      ...data,
      barbeiroId,
      data: Timestamp.fromDate(data.data)
    });
  },

  async listar(barbeiroId: string, pageLimit: number = 50) {
    const historicoRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    
    const q = query(
      historicoRef,
      orderBy('data', 'desc'),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data?.toDate() || new Date()
    })) as HistoricoLog[];
  },

  async listarPorTipo(barbeiroId: string, tipo: string, pageLimit: number = 50) {
    const historicoRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    
    const q = query(
      historicoRef,
      where('tipo', '==', tipo),
      orderBy('data', 'desc'),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data?.toDate() || new Date()
    })) as HistoricoLog[];
  }
};
