
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { QuoteDetails, ServiceType } from '@/types';
import ApiKeyInput from './chat/ApiKeyInput';
import ChatHeader from './chat/ChatHeader';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import { useChat } from '@/hooks/use-chat';
import { Button } from './ui/button';
import { Save } from 'lucide-react';

interface AIChatProps {
  initialMessage?: string;
  onServiceSelect?: (serviceType: ServiceType) => void;
  onQuoteGenerated?: (quote: QuoteDetails) => void;
  initialApiConfigured?: boolean;
  onApiConfigured?: () => void;
}

const AIChat = ({
  initialMessage,
  onServiceSelect,
  onQuoteGenerated,
  initialApiConfigured,
  onApiConfigured
}: AIChatProps) => {
  const {
    messages,
    isTyping,
    language,
    isApiConfigured,
    sendMessage,
    changeLanguage,
    clearChat,
    exportChatHistory,
    handleApiConfigured,
    saveCurrentChat
  } = useChat({
    initialMessage,
    onServiceSelect,
    onQuoteGenerated,
    initialApiConfigured,
    onApiConfigured
  });

  // API設定が完了していない場合はAPIキー入力画面を表示
  if (!isApiConfigured) {
    return <ApiKeyInput onKeySet={handleApiConfigured} language={language} />;
  }

  const saveButtonText = {
    ja: 'マイページに保存',
    en: 'Save to My Page',
    zh: '保存到我的页面',
    ko: '마이페이지에 저장'
  };

  return (
    <Card className="w-full max-w-md h-[32rem] flex flex-col shadow-lg animate-fade-in transition-all duration-300 hover:shadow-xl overflow-hidden">
      <ChatHeader 
        onClearChat={clearChat} 
        onChangeLanguage={changeLanguage} 
        currentLanguage={language} 
      />
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ChatMessageList messages={messages} isTyping={isTyping} />
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t flex flex-col gap-2">
        <ChatInput 
          onSendMessage={sendMessage}
          isTyping={isTyping}
          language={language}
          onExportHistory={exportChatHistory}
          showExportButton={messages.length > 1}
        />
        
        {messages.length > 1 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-center gap-2 text-xs"
            onClick={saveCurrentChat}
          >
            <Save className="h-3 w-3" />
            {saveButtonText[language]}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIChat;
