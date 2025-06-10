
"use client";

import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg max-w-[85%]",
        isUser ? "self-end bg-primary text-primary-foreground" : "self-start bg-card border"
      )}
    >
      <Avatar className={cn("h-8 w-8", isUser ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground")}>
        <AvatarFallback>{isUser ? <User size={18} /> : <Bot size={18} />}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        <p className={cn("text-xs mt-1", isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
