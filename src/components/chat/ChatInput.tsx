
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, SendIcon } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  language: 'ja' | 'en' | 'zh' | 'ko';
  onExportHistory: () => void;
  showExportButton: boolean;
}

const ChatInput = ({ 
  onSendMessage, 
  isTyping, 
  language, 
  onExportHistory, 
  showExportButton 
}: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholderText = {
    ja: 'メッセージを入力...',
    en: 'Type a message...',
    zh: '输入消息...',
    ko: '메시지를 입력하세요...'
  };

  const exportText = {
    ja: 'チャット履歴をエクスポート',
    en: 'Export Chat History',
    zh: '导出聊天记录',
    ko: '채팅 기록 내보내기'
  };

  return (
    <div className="w-full">
      <form 
        className="flex items-center w-full gap-2 mb-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText[language]}
          className="flex-1 transition-all duration-200 focus-visible:ring-1"
          disabled={isTyping}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!input.trim() || isTyping}
          className="h-9 w-9 rounded-full shrink-0 transition-all duration-300"
        >
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">送信</span>
        </Button>
      </form>
      
      {showExportButton && (
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2 text-xs"
          onClick={onExportHistory}
        >
          <Download className="h-3 w-3" />
          {exportText[language]}
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
