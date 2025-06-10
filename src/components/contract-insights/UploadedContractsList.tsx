
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface UploadedContractsListProps {
  contracts: Array<{
    file: File;
    id: string;
  }>;
  onRemoveContract?: (id: string) => void; // Optional: for future "remove" functionality
}

const UploadedContractsList: FC<UploadedContractsListProps> = ({ contracts }) => {
  if (contracts.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-lg flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Uploaded Contracts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contracts.length > 0 ? (
          <ScrollArea className="h-24 pr-3"> {/* Adjust height as needed */}
            <ul className="space-y-1 text-sm">
              {contracts.map((contract) => (
                <li key={contract.id} className="flex items-center justify-between p-1 rounded hover:bg-muted/50">
                  <span className="truncate" title={contract.file.name}>
                    {contract.file.name} ({ (contract.file.size / 1024).toFixed(2) } KB)
                  </span>
                  {/* Placeholder for remove button if onRemoveContract is implemented
                  {onRemoveContract && (
                    <Button variant="ghost" size="sm" onClick={() => onRemoveContract(contract.id)} className="text-destructive hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  */}
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">No contracts uploaded yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadedContractsList;
