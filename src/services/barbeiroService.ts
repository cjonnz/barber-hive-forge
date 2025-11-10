import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Barbeiro, BarbeiroStatus, PlanoTipo } from '@/types';

const COLLECTION = 'barbeiros';

const VALID_PLANOS = new Set<PlanoTipo>(['agenda', 'sparkle', 'blaze', 'pro', 'teste']);

const normalizePlano = (plano: unknown): PlanoTipo => {
  if (typeof plano === 'string') {
    const normalized = plano.toLowerCase() as PlanoTipo;
    if (VALID_PLANOS.has(normalized)) {
      return normalized;
    }

    if (normalized === 'basico') {
      return 'agenda';
    }
  }

  return 'agenda';
};

const mapTimestamp = (value: any): Date => {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
};

const mapBarbeiroData = (
  snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>
): Barbeiro => {
  const data = snapshot.data() || {};

  return {
    id: snapshot.id,
    nomeCompleto: data.nomeCompleto || '',
    cpf: data.cpf || '',
    endereco: data.endereco || {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    nomeEstabelecimento: data.nomeEstabelecimento || '',
    cnpj: data.cnpj || '',
    quantidadeFuncionarios: data.quantidadeFuncionarios || 0,
    fotoFachada: data.fotoFachada || '',
    telefone: data.telefone || '',
    email: data.email || '',
    servicos: Array.isArray(data.servicos) ? data.servicos : [],
    plano: normalizePlano(data.plano),
    status: data.status || 'pendente',
    dataCadastro: mapTimestamp(data.dataCadastro),
    dataAprovacao: data.dataAprovacao ? mapTimestamp(data.dataAprovacao) : undefined,
    dataInicioTeste: data.dataInicioTeste ? mapTimestamp(data.dataInicioTeste) : undefined,
    vencimentoPlano: mapTimestamp(data.vencimentoPlano),
    pagamentoTipo: data.pagamentoTipo || 'mensal',
    modoTeste: Boolean(data.modoTeste),
    linkPublico: data.linkPublico || '',
    linkPagamentoExterno: data.linkPagamentoExterno || '',
    totalAgendamentos: typeof data.totalAgendamentos === 'number' ? data.totalAgendamentos : 0,
    motivoRecusa: data.motivoRecusa
  } as Barbeiro;
};

export const barbeiroService = {
  // Criar novo barbeiro
  async criar(uid: string, data: Omit<Barbeiro, 'id'>): Promise<string> {
    const docRef = doc(db, COLLECTION, uid);
    await setDoc(docRef, {
      ...data,
      plano: normalizePlano(data.plano),
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
      return mapBarbeiroData(docSnap);
    }
    
    return null;
  },

  // Listar todos os barbeiros
  async listarTodos(): Promise<Barbeiro[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION));
    return querySnapshot.docs.map(mapBarbeiroData);
  },

  // Listar barbeiros por status
  async listarPorStatus(status: BarbeiroStatus): Promise<Barbeiro[]> {
    const q = query(collection(db, COLLECTION), where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapBarbeiroData);
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

    if (data.plano) {
      updateData.plano = normalizePlano(data.plano);
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
