
"use client";

import type { FC, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput: FC<ChatInputProps> = ({ value, onChange, onSend, isLoading, placeholder }) => {
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-t bg-card sticky bottom-0">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder || "Ask a question about your contracts..."}
        disabled={isLoading}
        className="flex-1 rounded-full px-4 py-2 focus-visible:ring-primary"
      />
      <Button onClick={onSend} disabled={isLoading || !value.trim()} size="icon" className="rounded-full">
        {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
};

export default ChatInput;
