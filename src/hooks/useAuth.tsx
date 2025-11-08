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
    let isActive = true;

    const fetchUserData = async () => {
      if (!user) {
        if (isActive) {
          setUserData(null);
          setUserDataLoading(false);
        }
        return;
      }

      setUserDataLoading(true);

      try {
        const email = user.email?.toLowerCase();
        let resolvedUserData: UserData | null = null;

        if (email === 'nexusbyjon@gmail.com') {
          resolvedUserData = { role: 'admin' };
        } else {
          const barbeiroDoc = await getDoc(doc(db, 'barbeiros', user.uid));

          if (barbeiroDoc.exists()) {
            resolvedUserData = {
              role: 'barbeiro',
              barbeiroId: user.uid
            };
          } else {
            console.warn('Dados do barbeiro não encontrados para o usuário:', user.uid);
          }
        }

        if (isActive) {
          setUserData(resolvedUserData);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        if (isActive) {
          setUserData(null);
        }
      } finally {
        if (isActive) {
          setUserDataLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isActive = false;
    };
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
