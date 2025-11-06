import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Barbeiro, BarbeiroStatus, PlanoTipo } from '@/types';

const COLLECTION = 'barbeiros';

export const barbeiroService = {
  // Criar novo barbeiro
  async criar(data: Omit<Barbeiro, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      dataCadastro: Timestamp.fromDate(data.dataCadastro),
      vencimentoPlano: Timestamp.fromDate(data.vencimentoPlano)
    });
    return docRef.id;
  },

  // Buscar barbeiro por ID
  async buscarPorId(id: string): Promise<Barbeiro | null> {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        dataCadastro: data.dataCadastro.toDate(),
        vencimentoPlano: data.vencimentoPlano.toDate()
      } as Barbeiro;
    }
    
    return null;
  },

  // Listar todos os barbeiros
  async listarTodos(): Promise<Barbeiro[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataCadastro: doc.data().dataCadastro.toDate(),
      vencimentoPlano: doc.data().vencimentoPlano.toDate()
    })) as Barbeiro[];
  },

  // Listar barbeiros por status
  async listarPorStatus(status: BarbeiroStatus): Promise<Barbeiro[]> {
    const q = query(collection(db, COLLECTION), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dataCadastro: doc.data().dataCadastro.toDate(),
      vencimentoPlano: doc.data().vencimentoPlano.toDate()
    })) as Barbeiro[];
  },

  // Atualizar barbeiro
  async atualizar(id: string, data: Partial<Barbeiro>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    const updateData = { ...data };
    
    if (data.dataCadastro) {
      updateData.dataCadastro = Timestamp.fromDate(data.dataCadastro) as any;
    }
    if (data.vencimentoPlano) {
      updateData.vencimentoPlano = Timestamp.fromDate(data.vencimentoPlano) as any;
    }
    
    await updateDoc(docRef, updateData);
  },

  // Atualizar status
  async atualizarStatus(id: string, status: BarbeiroStatus): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, { status });
  },

  // Deletar barbeiro
  async deletar(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Gerar link público único
  gerarLinkPublico(nomeEstabelecimento: string): string {
    const slug = nomeEstabelecimento
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const random = Math.random().toString(36).substring(2, 8);
    return `${slug}-${random}`;
  }
};
