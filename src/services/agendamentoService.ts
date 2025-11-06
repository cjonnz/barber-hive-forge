import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Agendamento, AgendamentoStatus } from '@/types';

const COLLECTION = 'agendamentos';

export const agendamentoService = {
  // Criar novo agendamento
  async criar(data: Omit<Agendamento, 'id' | 'criadoEm'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      data: Timestamp.fromDate(data.data),
      criadoEm: Timestamp.now()
    });
    return docRef.id;
  },

  // Buscar agendamento por ID
  async buscarPorId(id: string): Promise<Agendamento | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        data: data.data.toDate(),
        criadoEm: data.criadoEm.toDate()
      } as Agendamento;
    }
    
    return null;
  },

  // Listar agendamentos por barbeiro
  async listarPorBarbeiro(barbeiroId: string): Promise<Agendamento[]> {
    const q = query(
      collection(db, COLLECTION), 
      where('barbeiroId', '==', barbeiroId),
      orderBy('data', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data.toDate(),
      criadoEm: doc.data().criadoEm.toDate()
    })) as Agendamento[];
  },

  // Listar agendamentos por status e barbeiro
  async listarPorStatusEBarbeiro(
    barbeiroId: string, 
    status: AgendamentoStatus
  ): Promise<Agendamento[]> {
    const q = query(
      collection(db, COLLECTION), 
      where('barbeiroId', '==', barbeiroId),
      where('status', '==', status),
      orderBy('data', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data.toDate(),
      criadoEm: doc.data().criadoEm.toDate()
    })) as Agendamento[];
  },

  // Listar todos os agendamentos
  async listarTodos(): Promise<Agendamento[]> {
    const q = query(collection(db, COLLECTION), orderBy('data', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      data: doc.data().data.toDate(),
      criadoEm: doc.data().criadoEm.toDate()
    })) as Agendamento[];
  },

  // Atualizar agendamento
  async atualizar(id: string, data: Partial<Agendamento>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    const updateData = { ...data };
    
    if (data.data) {
      updateData.data = Timestamp.fromDate(data.data) as any;
    }
    
    await updateDoc(docRef, updateData);
  },

  // Atualizar status
  async atualizarStatus(id: string, status: AgendamentoStatus): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, { status });
  },

  // Verificar disponibilidade
  async verificarDisponibilidade(
    barbeiroId: string,
    data: Date,
    hora: string,
    duracao: number
  ): Promise<boolean> {
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, COLLECTION),
      where('barbeiroId', '==', barbeiroId),
      where('data', '>=', Timestamp.fromDate(dataInicio)),
      where('data', '<=', Timestamp.fromDate(dataFim)),
      where('status', 'in', ['pendente', 'confirmado'])
    );

    const querySnapshot = await getDocs(q);
    
    // Verificar conflitos de horário
    for (const doc of querySnapshot.docs) {
      const agendamento = doc.data();
      if (agendamento.hora === hora) {
        return false; // Horário já ocupado
      }
    }

    return true; // Horário disponível
  }
};
