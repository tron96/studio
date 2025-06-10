
"use client";

import { useState, type ChangeEvent, useEffect, useRef } from 'react';
import AppHeader from '@/components/contract-insights/AppHeader';
import ContractUpload from '@/components/contract-insights/ContractUpload';
import UploadedContractsList from '@/components/contract-insights/UploadedContractsList';
import ChatInterface from '@/components/contract-insights/ChatInterface';
import type { Message as ChatMessageType } from '@/components/contract-insights/ChatMessage';
import { chatWithContracts, type ChatWithContractsInput, type Contract as AiContractText } from '@/ai/flows/chat-with-contracts-flow';
// Note: summarizeContract is not currently used in this page, but types might be needed if re-integrated.
// import { summarizeContract, type SummarizeContractInput } from '@/ai/flows/summarize-contract';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

interface UploadedContract {
  file: File;
  dataUri: string; // We keep dataUri for potential future use (e.g., PDF display)
  id: string;
}

export default function ContractChatPage() {
  const [uploadedContracts, setUploadedContracts] = useState<UploadedContract[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [currentChatInput, setCurrentChatInput] = useState<string>("");
  
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
  const [isLoadingChatResponse, setIsLoadingChatResponse] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const generateId = () => Math.random().toString(36).substring(2, 15);

  // This function remains, but its output (dataUri) will not be directly sent to the AI model.
  // Instead, a placeholder text will be sent until PDF text extraction is implemented.
  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFilesUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsLoadingUpload(true);
    setError(null);
    const newUploadedContracts: UploadedContract[] = [];
    let fileErrorOccurred = false;

    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        setError(`File "${file.name}" exceeds 20MB. Please upload smaller PDFs.`);
        toast({
          title: "Upload Error",
          description: `File "${file.name}" exceeds 20MB.`,
          variant: "destructive",
        });
        fileErrorOccurred = true;
        continue; 
      }
      if (file.type !== "application/pdf") {
        setError(`File "${file.name}" is not a PDF. Please upload PDF files only.`);
        toast({
          title: "Upload Error",
          description: `File "${file.name}" is not a PDF.`,
          variant: "destructive",
        });
        fileErrorOccurred = true;
        continue;
      }

      try {
        // We still generate dataUri for potential display or other uses,
        // but it's NOT what we'll send to the AI for text processing.
        const dataUri = await fileToDataUri(file);
        newUploadedContracts.push({ file, dataUri, id: generateId() });
      } catch (err) {
        console.error("Error processing file:", file.name, err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred processing file.";
        setError(`Failed to process file "${file.name}": ${errorMessage}`);
        toast({
          title: "File Processing Error",
          description: `Could not process "${file.name}".`,
          variant: "destructive",
        });
        fileErrorOccurred = true;
      }
    }
    
    setUploadedContracts(prevContracts => [...prevContracts, ...newUploadedContracts]);

    if (newUploadedContracts.length > 0 && !fileErrorOccurred) {
      toast({
        title: "Upload Successful",
        description: `${newUploadedContracts.length} contract(s) uploaded. Ready for chat. (Note: PDF text extraction is a placeholder).`,
      });
    } else if (newUploadedContracts.length > 0 && fileErrorOccurred) {
       toast({
        title: "Partial Upload",
        description: `${newUploadedContracts.length} contract(s) uploaded, but some files had issues. (Note: PDF text extraction is a placeholder).`,
        variant: "default" 
      });
    }
    
    setIsLoadingUpload(false);
  };

  const handleSendMessage = async () => {
    if (!currentChatInput.trim() || isLoadingChatResponse) return;
    if (uploadedContracts.length === 0) {
      setError("Please upload contracts before asking questions.");
      toast({ title: "No Contracts", description: "Upload contracts to chat.", variant: "destructive" });
      return;
    }

    const userMessage: ChatMessageType = {
      id: generateId(),
      sender: 'user',
      text: currentChatInput.trim(),
      timestamp: new Date(),
    };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setCurrentChatInput("");
    setIsLoadingChatResponse(true);
    setError(null);

    try {
      const aiContracts: AiContractText[] = uploadedContracts.map(uc => ({
        fileName: uc.file.name,
        // IMPORTANT PLACEHOLDER: Actual PDF text extraction needs to be implemented.
        // For now, we send a placeholder string to the AI.
        contentText: `[PDF content for ${uc.file.name}. Text extraction from PDF is not yet implemented. This is placeholder text.]`,
      }));
      
      const input: ChatWithContractsInput = {
        userQuery: userMessage.text,
        contracts: aiContracts,
      };
      
      // Ensure you are calling the new Transformers.js based function
      const result = await chatWithContracts(input); 
      
      const aiMessage: ChatMessageType = {
        id: generateId(),
        sender: 'ai',
        text: result.aiResponse,
        timestamp: new Date(),
      };
      setChatMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (err) {
      console.error("Error in chat flow:", err);
      const errorMessage = err instanceof Error ? err.message : "An AI processing error occurred.";
      setError(`Chat error: ${errorMessage}`);
      toast({
        title: "Chat Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
       const aiErrorMessage: ChatMessageType = {
        id: generateId(),
        sender: 'ai',
        text: "I'm sorry, I encountered an error trying to process your request. Please try again.",
        timestamp: new Date(),
      };
      setChatMessages(prevMessages => [...prevMessages, aiErrorMessage]);
    } finally {
      setIsLoadingChatResponse(false);
    }
  };
  
  const resetState = () => {
    setUploadedContracts([]);
    setChatMessages([]);
    setCurrentChatInput("");
    setError(null);
    setIsLoadingUpload(false);
    setIsLoadingChatResponse(false);
    toast({ title: "Reset Complete", description: "Application state has been cleared." });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader showReset={uploadedContracts.length > 0 || chatMessages.length > 0} onReset={resetState} />
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-4 items-center">
        {uploadedContracts.length === 0 ? (
          <div className="w-full max-w-2xl flex flex-col items-center justify-center pt-10">
            {error && !isLoadingUpload && ( 
              <Alert variant="destructive" className="mb-4 w-full">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Upload Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <ContractUpload onFilesUpload={handleFilesUpload} isLoading={isLoadingUpload} />
          </div>
        ) : (
          <div className="w-full h-[calc(100vh-10rem)] flex flex-col gap-4 max-w-4xl mx-auto">
            <UploadedContractsList contracts={uploadedContracts} />
             {error && !isLoadingChatResponse && ( 
              <Alert variant="destructive" className="w-full">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Chat Error</AlertTitle>
                <AlertDescription>{error} Please try rephrasing your question or check your uploaded files.</AlertDescription>
              </Alert>
            )}
            <ChatInterface
              messages={chatMessages}
              inputValue={currentChatInput}
              onInputChange={setCurrentChatInput}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChatResponse}
              chatContainerHeight="flex-1 min-h-0"
            />
          </div>
        )}
      </main>
    </div>
  );
}
