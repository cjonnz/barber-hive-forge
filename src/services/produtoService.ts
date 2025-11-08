import { db } from '@/config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp 
} from 'firebase/firestore';
import { Produto } from '@/types';

const COLLECTION = 'produtos';

export const produtoService = {
  async criar(barbeiroId: string, data: Omit<Produto, 'id' | 'barbeiroId' | 'criadoEm'>) {
    const produtoRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    const docRef = await addDoc(produtoRef, {
      ...data,
      barbeiroId,
      criadoEm: Timestamp.now()
    });
    return docRef.id;
  },

  async atualizar(barbeiroId: string, produtoId: string, data: Partial<Produto>) {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, produtoId);
    await updateDoc(docRef, data);
  },

  async deletar(barbeiroId: string, produtoId: string) {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, produtoId);
    await deleteDoc(docRef);
  },

  async buscarPorId(barbeiroId: string, produtoId: string): Promise<Produto | null> {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, produtoId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      criadoEm: data.criadoEm?.toDate() || new Date()
    } as Produto;
  },

  async listar(barbeiroId: string, pageLimit: number = 30, lastDoc?: any) {
    const produtosRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    
    let q = query(
      produtosRef,
      orderBy('nome'),
      limit(pageLimit)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const produtos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      criadoEm: doc.data().criadoEm?.toDate() || new Date()
    })) as Produto[];

    return {
      produtos,
      lastDoc: snapshot.docs[snapshot.docs.length - 1]
    };
  },

  async buscar(barbeiroId: string, termo: string, pageLimit: number = 30) {
    const produtosRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    
    const q = query(
      produtosRef,
      where('nome', '>=', termo),
      where('nome', '<=', termo + '\uf8ff'),
      orderBy('nome'),
      limit(pageLimit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      criadoEm: doc.data().criadoEm?.toDate() || new Date()
    })) as Produto[];
  },

  async listarAtivos(barbeiroId: string) {
    const produtosRef = collection(db, `barbeiros/${barbeiroId}/${COLLECTION}`);
    
    const q = query(
      produtosRef,
      where('ativo', '==', true),
      orderBy('nome')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      criadoEm: doc.data().criadoEm?.toDate() || new Date()
    })) as Produto[];
  },

  async atualizarEstoque(barbeiroId: string, produtoId: string, quantidade: number) {
    const docRef = doc(db, `barbeiros/${barbeiroId}/${COLLECTION}`, produtoId);
    await updateDoc(docRef, { quantidade });
  }
};
