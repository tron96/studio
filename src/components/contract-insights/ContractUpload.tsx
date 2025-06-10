
"use client";

import type { ChangeEvent, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UploadCloud } from 'lucide-react';

interface ContractUploadProps {
  onFilesUpload: (files: File[]) => void;
  isLoading: boolean;
}

const ContractUpload: FC<ContractUploadProps> = ({ onFilesUpload, isLoading }) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFilesUpload(Array.from(files));
    }
    // Reset the input value to allow uploading the same file(s) again if removed and re-selected
    event.target.value = '';
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <UploadCloud className="mr-2 h-6 w-6 text-primary" />
          Upload Contracts
        </CardTitle>
        <CardDescription>
          Select one or more PDF contract documents to analyze.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            multiple // Allow multiple file selection
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
            {isLoading ? 'Processing...' : 'Choose PDF File(s)'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractUpload;
