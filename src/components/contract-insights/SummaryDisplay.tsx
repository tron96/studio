"use client";

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadCloud, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SummaryDisplayProps {
  summaryText: string | null;
  isLoading: boolean;
  onExport: () => void;
  error: string | null;
}

const SummaryDisplay: FC<SummaryDisplayProps> = ({ summaryText, isLoading, onExport, error }) => {
  return (
    <Card className="flex flex-col h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">AI-Generated Summary</CardTitle>
        <CardDescription>Key terms extracted from the contract.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Summarizing contract...</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="text-destructive p-4 border border-destructive/50 rounded-md">
              <p className="font-semibold">Error Summarizing Contract:</p>
              <p>{error}</p>
            </div>
          )}
          {!isLoading && !error && summaryText && (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{summaryText}</pre>
          )}
          {!isLoading && !error && !summaryText && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Upload a contract to generate its summary.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onExport} 
          disabled={!summaryText || isLoading} 
          className="w-full sm:w-auto"
          variant="default"
        >
          <DownloadCloud className="mr-2 h-4 w-4" />
          Export Summary
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SummaryDisplay;
