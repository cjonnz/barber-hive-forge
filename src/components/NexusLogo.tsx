import { Scissors } from 'lucide-react';

interface NexusLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const NexusLogo = ({ size = 'md', showTagline = false }: NexusLogoProps) => {
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-xl',
      tagline: 'text-xs'
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-2xl',
      tagline: 'text-sm'
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-4xl',
      tagline: 'text-base'
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-3">
        <Scissors className={`${sizes[size].icon} text-primary`} />
        <div className="flex flex-col">
          <h1 className={`font-brand font-bold ${sizes[size].text} text-primary tracking-wider`}>
            NEXUS
          </h1>
        </div>
      </div>
      {showTagline && (
        <p className={`${sizes[size].tagline} text-muted-foreground font-light tracking-wide`}>
          by Jon
        </p>
      )}
    </div>
  );
};
