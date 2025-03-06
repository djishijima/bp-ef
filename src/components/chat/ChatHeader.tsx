
import { Bot, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface ChatHeaderProps {
  onClearChat: () => void;
  onChangeLanguage: (lang: 'ja' | 'en' | 'zh' | 'ko') => void;
  currentLanguage: 'ja' | 'en' | 'zh' | 'ko';
}

const ChatHeader = ({ onClearChat, onChangeLanguage, currentLanguage }: ChatHeaderProps) => {
  return (
    <CardHeader className="px-4 py-3 border-b">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI印刷アシスタント
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden text-xs">
            <Button 
              variant={currentLanguage === 'ja' ? 'default' : 'ghost'} 
              size="sm" 
              className="px-2 py-1 h-7 text-xs"
              onClick={() => onChangeLanguage('ja')}
            >
              日本語
            </Button>
            <Button 
              variant={currentLanguage === 'en' ? 'default' : 'ghost'} 
              size="sm" 
              className="px-2 py-1 h-7 text-xs"
              onClick={() => onChangeLanguage('en')}
            >
              English
            </Button>
            <Button 
              variant={currentLanguage === 'zh' ? 'default' : 'ghost'} 
              size="sm" 
              className="px-2 py-1 h-7 text-xs"
              onClick={() => onChangeLanguage('zh')}
            >
              中文
            </Button>
            <Button 
              variant={currentLanguage === 'ko' ? 'default' : 'ghost'} 
              size="sm" 
              className="px-2 py-1 h-7 text-xs"
              onClick={() => onChangeLanguage('ko')}
            >
              한국어
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={onClearChat}
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">チャットをリセット</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default ChatHeader;
