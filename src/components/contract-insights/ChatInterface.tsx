
"use client";

import type { FC } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage, { type Message as MessageType } from './ChatMessage';
import ChatInput from './ChatInput';
import { Card } from '../ui/card';

interface ChatInterfaceProps {
  messages: MessageType[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  chatContainerHeight?: string;
}

const ChatInterface: FC<ChatInterfaceProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading,
  chatContainerHeight = "flex-1" // Default to flex-1 to take available space
}) => {
  return (
    <Card className="flex flex-col w-full h-full shadow-lg overflow-hidden">
      <ScrollArea className={cn("p-4 space-y-4", chatContainerHeight)}>
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Ask a question about your uploaded contracts.</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
           <div className="flex self-start items-start gap-3 p-3 rounded-lg max-w-[85%] bg-card border animate-pulse">
             <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="h-4 w-4 bg-primary/50 rounded-sm"></div>
             </div>
             <div className="flex flex-col gap-2">
                <div className="h-3 w-32 bg-muted rounded"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
             </div>
           </div>
        )}
      </ScrollArea>
      <ChatInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSendMessage}
        isLoading={isLoading}
      />
    </Card>
  );
};

export default ChatInterface;

function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(' ');
}
