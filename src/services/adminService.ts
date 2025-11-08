import { db } from '@/config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { AdminPerfil } from '@/types';

const COLLECTION = 'admins';

const mapTimestampToDate = (value: unknown): Date | undefined => {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return undefined;
};

export const adminService = {
  async obterPerfil(uid: string): Promise<AdminPerfil | null> {
    const docRef = doc(db, COLLECTION, uid);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      id: snapshot.id,
      nome: data.nome || '',
      email: data.email || '',
      telefone: data.telefone || '',
      whatsapp: data.whatsapp || '',
      cargo: data.cargo || '',
      bio: data.bio || '',
      fotoUrl: data.fotoUrl || '',
      notificacoesEmail: Boolean(data.notificacoesEmail),
      notificacoesWhatsapp: Boolean(data.notificacoesWhatsapp),
      criadoEm: mapTimestampToDate(data.criadoEm),
      atualizadoEm: mapTimestampToDate(data.atualizadoEm)
    };
  },

  async salvarPerfil(uid: string, dados: Omit<AdminPerfil, 'id' | 'criadoEm' | 'atualizadoEm'>) {
    const docRef = doc(db, COLLECTION, uid);
    const snapshot = await getDoc(docRef);

    await setDoc(
      docRef,
      {
        ...dados,
        atualizadoEm: serverTimestamp(),
        ...(snapshot.exists() ? {} : { criadoEm: serverTimestamp() })
      },
      { merge: true }
    );
  }
};
