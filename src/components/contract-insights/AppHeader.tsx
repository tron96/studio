
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface AppHeaderProps {
  showReset?: boolean;
  onReset?: () => void;
}

const AppHeader: FC<AppHeaderProps> = ({ showReset, onReset }) => {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary font-headline">
          Contract Insights
        </h1>
        {showReset && onReset && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
