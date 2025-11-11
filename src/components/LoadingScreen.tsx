import { Scissors, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const LoadingScreen = () => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    // Mostrar aviso se carregar por mais de 10 segundos
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="flex flex-col items-center gap-6 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Scissors className="w-16 h-16 text-primary" />
        </motion.div>
        <div className="text-center">
          <h2 className="font-brand text-3xl text-primary tracking-wider mb-2">
            NEXUS
          </h2>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>

        {showTimeout && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                O carregamento está demorando mais que o esperado. Verifique sua conexão ou tente recarregar a página.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
