import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { UserRole } from '@/types';

interface UserData {
  role: UserRole;
  barbeiroId?: string;
}

export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserData(null);
        setUserDataLoading(false);
        return;
      }

      try {
        // Verificar se é admin (Jon)
        if (user.email?.toLowerCase() === 'nexusbyjon@gmail.com') {
          setUserData({ role: 'admin' });
          setUserDataLoading(false);
          return;
        }

        // Buscar dados do barbeiro
        const barbeiroDoc = await getDoc(doc(db, 'barbeiros', user.uid));
        
        if (barbeiroDoc.exists()) {
          setUserData({
            role: 'barbeiro',
            barbeiroId: user.uid
          });
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
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
    error,
    isAdmin: userData?.role === 'admin',
    isBarbeiro: userData?.role === 'barbeiro'
  };
};
