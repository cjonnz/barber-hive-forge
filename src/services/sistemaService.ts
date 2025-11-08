import { db } from '@/config/firebase';
import { SistemaConfiguracao } from '@/types';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

const COLLECTION = 'sistema';
const DOCUMENT_ID = 'configuracoes';

const toDate = (value: unknown): Date | undefined => {
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

export const sistemaService = {
  async obterConfiguracao(): Promise<SistemaConfiguracao | null> {
    const docRef = doc(db, COLLECTION, DOCUMENT_ID);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      sistemaEmail: data.sistemaEmail || '',
      emailSMTP: data.emailSMTP || '',
      whatsappAPI: data.whatsappAPI || '',
      backupAutomatico: Boolean(
        data.backupAutomatico ?? true
      ),
      notificacoesEmail: Boolean(data.notificacoesEmail ?? true),
      notificacoesWhatsApp: Boolean(data.notificacoesWhatsApp ?? false),
      autenticacaoDoisFatores: Boolean(data.autenticacaoDoisFatores ?? false),
      logsAtivos: Boolean(data.logsAtivos ?? true),
      criadoEm: toDate(data.criadoEm),
      atualizadoEm: toDate(data.atualizadoEm)
    };
  },

  async salvarConfiguracao(configuracao: SistemaConfiguracao) {
    const docRef = doc(db, COLLECTION, DOCUMENT_ID);
    const snapshot = await getDoc(docRef);

    await setDoc(
      docRef,
      {
        ...configuracao,
        atualizadoEm: serverTimestamp(),
        ...(snapshot.exists() ? {} : { criadoEm: serverTimestamp() })
      },
      { merge: true }
    );
  }
};
