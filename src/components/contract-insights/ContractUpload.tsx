"use client";

import type { ChangeEvent, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UploadCloud } from 'lucide-react';

interface ContractUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const ContractUpload: FC<ContractUploadProps> = ({ onFileUpload, isLoading }) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <UploadCloud className="mr-2 h-6 w-6 text-primary" />
          Upload Contract
        </CardTitle>
        <CardDescription>
          Select a PDF contract document to analyze and summarize its key terms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isLoading}
            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          <Button 
            onClick={() => document.getElementById('pdf-upload')?.click()} 
            className="w-full" 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Processing...' : 'Choose PDF File'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractUpload;
