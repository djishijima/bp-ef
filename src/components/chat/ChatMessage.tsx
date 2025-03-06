
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 text-sm",
        message.sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {message.sender === 'ai' && (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <div 
        className={cn(
          "rounded-2xl px-4 py-2 max-w-[80%] break-words animate-slide-in",
          message.sender === 'user' 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-muted"
        )}
      >
        {message.content}
      </div>
      
      {message.sender === 'user' && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
