import { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, QuoteDetails, ServiceType } from '@/types';
import { SendIcon, Bot, User, RefreshCcw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import ApiKeyInput from './ApiKeyInput';
import { generateAIResponse, isApiKeySet } from '@/services/ai';

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
  // API設定状態
  const [isApiConfigured, setIsApiConfigured] = useState(initialApiConfigured || isApiKeySet());
  
  // 多言語対応のウェルカムメッセージ
  const welcomeMessages = {
    ja: 'こんにちは！印刷、製本、物流、環境印刷に関するご質問やお見積もりのお手伝いをさせていただきます。お気軽にお問い合わせください。',
    en: 'Hello! I can help you with printing, binding, logistics, and eco-friendly printing services. Feel free to ask any questions or request a quote.',
    zh: '您好！我可以帮助您解决印刷、装订、物流和环保印刷服务的问题。欢迎随时提问或索取报价。',
    ko: '안녕하세요! 인쇄, 제본, 물류 및 친환경 인쇄 서비스에 관한 문의나 견적에 도움을 드릴 수 있습니다. 언제든지 질문해 주세요.'
  };
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: initialMessage || welcomeMessages.ja,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'ja' | 'en' | 'zh' | 'ko'>('ja');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // APIの設定状態をチェック
  useEffect(() => {
    const apiKeySet = isApiKeySet();
    setIsApiConfigured(initialApiConfigured || apiKeySet);
  }, [initialApiConfigured]);

  // サービスタイプを検出する関数
  const detectServiceType = (message: string): ServiceType => {
    const lowerMessage = message.toLowerCase();
    
    // 印刷関連のキーワード
    if (lowerMessage.includes('印刷') || lowerMessage.includes('名刺') || lowerMessage.includes('チラシ') || 
        lowerMessage.includes('ポスター') || lowerMessage.includes('パンフレット')) {
      return 'printing';
    }
    
    // 製本関連のキーワード
    if (lowerMessage.includes('製本') || lowerMessage.includes('冊子') || lowerMessage.includes('書籍') || 
        lowerMessage.includes('ハードカバー') || lowerMessage.includes('ソフトカバー') || lowerMessage.includes('綴じ')) {
      return 'binding';
    }
    
    // 物流関連のキーワード
    if (lowerMessage.includes('物流') || lowerMessage.includes('配送') || lowerMessage.includes('発送') || 
        lowerMessage.includes('梱包') || lowerMessage.includes('保管') || lowerMessage.includes('輸送')) {
      return 'logistics';
    }
    
    // 環境印刷関連のキーワード
    if (lowerMessage.includes('環境') || lowerMessage.includes('エコ') || lowerMessage.includes('リサイクル') || 
        lowerMessage.includes('再生紙') || lowerMessage.includes('fsc') || lowerMessage.includes('カーボン')) {
      return 'eco-printing';
    }
    
    // デフォルトは印刷サービス
    return 'printing';
  };
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // サービスタイプを検出
      const serviceType = detectServiceType(input);
      
      // サービスタイプが検出されたら親コンポーネントに通知
      if (onServiceSelect) {
        onServiceSelect(serviceType);
      }
      
      // Google Gemini APIを使って応答を生成
      const aiResponse = await generateAIResponse([...messages, userMessage], language);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      // 見積もり関連のキーワードがあれば見積もりを生成
      if (onQuoteGenerated && (input.includes('見積') || input.includes('quote') || input.includes('estimate'))) {
        // サンプルの見積もりデータを生成
        const sampleQuote: QuoteDetails = {
          id: `QT-${Date.now()}`,
          specs: {
            serviceType: serviceType,
            productType: 'チラシ',
            size: 'A4',
            quantity: 1000,
            paperType: '上質紙 110kg',
            printColors: '4色カラー',
            finishing: ['折り加工'],
            customSpecs: input,
          },
          price: 45000,
          turnaround: 5
        };
        
        onQuoteGenerated(sampleQuote);
      }
    } catch (error) {
      console.error('Error:', error);
      
      // エラーメッセージを表示
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `エラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}。APIキーが正しく設定されているか確認してください。`,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "エラーが発生しました",
        description: "APIの呼び出し中にエラーが発生しました。APIキーを確認してください。",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: welcomeMessages[language],
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };

  // 言語切替関数
  const changeLanguage = (lang: 'ja' | 'en' | 'zh' | 'ko') => {
    setLanguage(lang);
    setMessages([
      {
        id: Date.now().toString(),
        content: welcomeMessages[lang],
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };
  
  // チャット履歴をエクスポート
  const exportChatHistory = () => {
    // 会話内容をテキスト形式に整形
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };
    
    const chatText = messages.map(msg => {
      const sender = msg.sender === 'user' ? 'お客様' : 'AIアシスタント';
      return `[${formatDate(msg.timestamp)}] ${sender}:\n${msg.content}\n`;
    }).join('\n');
    
    // ファイル名を生成（現在の日時を含む）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const filename = `chat-history-${timestamp}.txt`;
    
    // Blobとしてファイルを作成
    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    
    // ダウンロードリンクを作成して自動クリック
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // クリーンアップ
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast({
      title: "エクスポート完了",
      description: "チャット履歴を保存しました。",
    });
  };

  // API設定が完了した際の処理
  const handleKeySet = () => {
    setIsApiConfigured(true);
    if (onApiConfigured) {
      onApiConfigured();
    }
  };

  // API設定が完了していない場合はAPIキー入力画面を表示
  if (!isApiConfigured) {
    return (
      <ApiKeyInput onKeySet={handleKeySet} />
    );
  }

  return (
    <Card className="w-full max-w-md h-[32rem] flex flex-col shadow-lg animate-fade-in transition-all duration-300 hover:shadow-xl overflow-hidden">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI印刷アシスタント
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md overflow-hidden text-xs">
              <Button 
                variant={language === 'ja' ? 'default' : 'ghost'} 
                size="sm" 
                className="px-2 py-1 h-7 text-xs"
                onClick={() => changeLanguage('ja')}
              >
                日本語
              </Button>
              <Button 
                variant={language === 'en' ? 'default' : 'ghost'} 
                size="sm" 
                className="px-2 py-1 h-7 text-xs"
                onClick={() => changeLanguage('en')}
              >
                English
              </Button>
              <Button 
                variant={language === 'zh' ? 'default' : 'ghost'} 
                size="sm" 
                className="px-2 py-1 h-7 text-xs"
                onClick={() => changeLanguage('zh')}
              >
                中文
              </Button>
              <Button 
                variant={language === 'ko' ? 'default' : 'ghost'} 
                size="sm" 
                className="px-2 py-1 h-7 text-xs"
                onClick={() => changeLanguage('ko')}
              >
                한국어
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={handleClearChat}
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="sr-only">チャットをリセット</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full py-4 px-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
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
            ))}
            
            {isTyping && (
              <div className="flex gap-3 text-sm">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-2xl px-4 py-2 bg-muted max-w-[80%] flex items-center">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t">
        <div className="w-full">
          <form 
            className="flex items-center w-full gap-2 mb-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={language === 'ja' ? 'メッセージを入力...' : 
                          language === 'en' ? 'Type a message...' : 
                          language === 'zh' ? '输入消息...' : '메시지를 입력하세요...'}
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
          
          {messages.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-xs"
              onClick={exportChatHistory}
            >
              <Download className="h-3 w-3" />
              {language === 'ja' ? 'チャット履歴をエクスポート' : 
               language === 'en' ? 'Export Chat History' : 
               language === 'zh' ? '导出聊天记录' : '채팅 기록 내보내기'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIChat;
