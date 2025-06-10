"use client";

import { useState, type ChangeEvent } from 'react';
import AppHeader from '@/components/contract-insights/AppHeader';
import ContractUpload from '@/components/contract-insights/ContractUpload';
import ContractDisplay from '@/components/contract-insights/ContractDisplay';
import SummaryDisplay from '@/components/contract-insights/SummaryDisplay';
import { summarizeContract } from '@/ai/flows/summarize-contract';
import type { SummarizeContractInput } from '@/ai/flows/summarize-contract';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function ContractInsightsPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [contractDataUri, setContractDataUri] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit for demo purposes
      setError("File size exceeds 5MB. Please upload a smaller PDF.");
      toast({
        title: "Upload Error",
        description: "File size exceeds 5MB. Please upload a smaller PDF.",
        variant: "destructive",
      });
      setUploadedFile(null);
      setContractDataUri(null);
      setSummaryText(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummaryText(null); 
    setUploadedFile(file);

    try {
      const dataUri = await fileToDataUri(file);
      setContractDataUri(dataUri);

      const input: SummarizeContractInput = { contractDataUri: dataUri };
      const result = await summarizeContract(input);
      setSummaryText(result.summary);
      toast({
        title: "Summarization Complete",
        description: "Contract summary generated successfully.",
      });
    } catch (err) {
      console.error("Error processing file or summarizing contract:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to process or summarize the contract: ${errorMessage}`);
      toast({
        title: "Summarization Failed",
        description: `An error occurred: ${errorMessage}`,
        variant: "destructive",
      });
      setContractDataUri(null); // Clear PDF view on error
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSummary = () => {
    if (!summaryText) return;
    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${uploadedFile?.name.replace(/\.pdf$/i, '') || 'contract'}_summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({
      title: "Summary Exported",
      description: "The contract summary has been downloaded.",
    });
  };

  const handleAnnotate = () => {
    // Placeholder for annotation functionality
    console.log("Annotation feature clicked. Full functionality TBD.");
    toast({
      title: "Annotation Tool",
      description: "This feature is currently under development.",
    });
  };
  
  const resetState = () => {
    setUploadedFile(null);
    setContractDataUri(null);
    setSummaryText(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6 items-center">
        {!uploadedFile && !contractDataUri ? (
          <div className="w-full max-w-2xl flex flex-col items-center justify-center pt-10">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <ContractUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
          </div>
        ) : (
          <div className="w-full h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] flex flex-col gap-6">
            {error && !isLoading && (
               <Alert variant="destructive" className="mb-4">
                 <Terminal className="h-4 w-4" />
                 <AlertTitle>Processing Error</AlertTitle>
                 <AlertDescription>{error} <Button variant="link" onClick={resetState} className="p-0 h-auto text-destructive underline">Try uploading another file?</Button></AlertDescription>
               </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
              <ContractDisplay contractDataUri={contractDataUri} onAnnotate={handleAnnotate} />
              <SummaryDisplay summaryText={summaryText} isLoading={isLoading} onExport={handleExportSummary} error={error} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
