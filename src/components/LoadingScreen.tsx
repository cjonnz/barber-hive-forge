import { Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-6"
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
      </motion.div>
    </div>
  );
};
