"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Highlighter } from 'lucide-react';

interface ContractDisplayProps {
  contractDataUri: string | null;
  onAnnotate: () => void;
}

const ContractDisplay: FC<ContractDisplayProps> = ({ contractDataUri, onAnnotate }) => {
  return (
    <Card className="flex flex-col h-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl">Original Contract</CardTitle>
        <Button variant="outline" size="sm" onClick={onAnnotate} className="text-accent-foreground border-accent hover:bg-accent/10">
          <Highlighter className="mr-2 h-4 w-4" />
          Annotate
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        {contractDataUri ? (
          <embed src={contractDataUri} type="application/pdf" className="w-full h-full min-h-[400px]" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No contract uploaded.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractDisplay;
