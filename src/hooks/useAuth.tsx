import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { UserRole } from '@/types';
import { toast } from 'sonner';

interface UserData {
  role: UserRole;
  barbeiroId?: string;
}

export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const fetchAttempts = useRef(0);
  const hasShownError = useRef(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserData(null);
        setUserDataLoading(false);
        setAuthError(null);
        fetchAttempts.current = 0;
        hasShownError.current = false;
        return;
      }

      // Evitar loops infinitos
      if (fetchAttempts.current >= 3) {
        setUserDataLoading(false);
        if (!hasShownError.current) {
          setAuthError('Erro ao carregar dados do usuário. Tente fazer login novamente.');
          toast.error('Erro ao carregar dados. Faça login novamente.');
          hasShownError.current = true;
          // Fazer logout após erro
          setTimeout(() => {
            auth.signOut();
          }, 2000);
        }
        return;
      }

      fetchAttempts.current += 1;

      try {
        // Verificar se é admin (Jon)
        if (user.email?.toLowerCase() === 'nexusbyjon@gmail.com') {
          setUserData({ role: 'admin' });
          setUserDataLoading(false);
          setAuthError(null);
          fetchAttempts.current = 0;
          return;
        }

        // Buscar dados do barbeiro
        const barbeiroDoc = await getDoc(doc(db, 'barbeiros', user.uid));
        
        if (barbeiroDoc.exists()) {
          setUserData({
            role: 'barbeiro',
            barbeiroId: user.uid
          });
          setAuthError(null);
          fetchAttempts.current = 0;
        } else {
          setUserData(null);
          setAuthError('Usuário não encontrado no sistema.');
        }
      } catch (err: any) {
        console.error('Erro ao buscar dados do usuário:', err);
        
        // Erros de permissão devem encerrar as tentativas imediatamente
        if (err?.code === 'permission-denied') {
          fetchAttempts.current = 3;
          if (!hasShownError.current) {
            setAuthError('Acesso negado. Verifique suas permissões.');
            toast.error('Erro de permissão. Faça login novamente.');
            hasShownError.current = true;
            setTimeout(() => {
              auth.signOut();
            }, 2000);
          }
        }
        
        setUserData(null);
      } finally {
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return {
    user,
    userData,
    loading: loading || userDataLoading,
    error: error || authError,
    isAdmin: userData?.role === 'admin',
    isBarbeiro: userData?.role === 'barbeiro'
  };
};
