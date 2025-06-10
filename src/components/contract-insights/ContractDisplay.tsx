
"use client";

// This component is no longer used in the primary chat flow.
// It's kept here for potential future use or reference if needed.
// To re-enable, it would need to be integrated into the new UI,
// possibly when clicking a contract in UploadedContractsList.

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Highlighter } from 'lucide-react';

interface ContractDisplayProps {
  contractDataUri: string | null;
  onAnnotate?: () => void; // Made optional as it might not always be relevant
}

const ContractDisplay: FC<ContractDisplayProps> = ({ contractDataUri, onAnnotate }) => {
  return (
    <Card className="flex flex-col h-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl">Original Contract</CardTitle>
        {onAnnotate && (
          <Button variant="outline" size="sm" onClick={onAnnotate} className="text-accent-foreground border-accent hover:bg-accent/10">
            <Highlighter className="mr-2 h-4 w-4" />
            Annotate
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        {contractDataUri ? (
          <embed src={contractDataUri} type="application/pdf" className="w-full h-full min-h-[400px]" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No contract selected or available for display.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractDisplay;
