
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { QuoteDetails, ServiceType } from '@/types';
import ApiKeyInput from './chat/ApiKeyInput';
import ChatHeader from './chat/ChatHeader';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import { useChat } from '@/hooks/use-chat';

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
    handleApiConfigured
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
      
      <CardFooter className="p-4 pt-2 border-t">
        <ChatInput 
          onSendMessage={sendMessage}
          isTyping={isTyping}
          language={language}
          onExportHistory={exportChatHistory}
          showExportButton={messages.length > 1}
        />
      </CardFooter>
    </Card>
  );
};

export default AIChat;
