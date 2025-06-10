
"use client";

// This component is no longer used in the primary chat flow.
// The summarization is now part of the chat interaction.
// It's kept here for potential future use or reference.

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadCloud, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SummaryDisplayProps {
  summaryText: string | null;
  isLoading: boolean;
  onExport?: () => void; // Made optional
  error: string | null;
}

const SummaryDisplay: FC<SummaryDisplayProps> = ({ summaryText, isLoading, onExport, error }) => {
  return (
    <Card className="flex flex-col h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">AI-Generated Output</CardTitle>
        <CardDescription>Response from the AI based on your query.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Processing...</p>
            </div>
          )}
          {!isLoading && error && (
            <div className="text-destructive p-4 border border-destructive/50 rounded-md">
              <p className="font-semibold">Error processing request:</p>
              <p>{error}</p>
            </div>
          )}
          {!isLoading && !error && summaryText && (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{summaryText}</pre>
          )}
          {!isLoading && !error && !summaryText && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Upload contracts and ask a question to see results here.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      {onExport && (
        <CardFooter>
          <Button
            onClick={onExport}
            disabled={!summaryText || isLoading}
            className="w-full sm:w-auto"
            variant="default"
          >
            <DownloadCloud className="mr-2 h-4 w-4" />
            Export Output
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SummaryDisplay;
