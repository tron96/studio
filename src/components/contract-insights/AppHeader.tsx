import type { FC } from 'react';

const AppHeader: FC = () => {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary font-headline">
          Contract Insights
        </h1>
      </div>
    </header>
  );
};

export default AppHeader;
