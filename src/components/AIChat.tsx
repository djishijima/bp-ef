
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
import { ChatMessage } from '@/types';
import { SendIcon, Bot, User, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIChatProps {
  initialMessage?: string;
}

const AIChat = ({ initialMessage }: AIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: initialMessage || 'こんにちは！印刷物に関するご質問やお見積もりのお手伝いをさせていただきます。お気軽にお問い合わせください。',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Responses for common print-related questions
  const aiResponses: Record<string, string> = {
    default: "申し訳ありませんが、もう少し具体的にお聞かせいただけますか？印刷の種類、サイズ、数量など、詳細な情報があるとより正確なご案内ができます。",
    greeting: "こんにちは！印刷に関するご質問やお見積りのサポートをいたします。どのようなお手伝いが必要ですか？",
    pricing: "印刷物の価格は、サイズ、紙質、印刷色数、数量、加工方法などによって大きく変わります。具体的な仕様をお知らせいただければ、お見積りをご提案できます。",
    turnaround: "標準的な納期は、通常の印刷物で5〜7営業日程度です。特殊加工や大量注文の場合は、さらにお時間をいただくことがあります。急ぎの場合は特急対応も可能ですので、ご相談ください。",
    businessCards: "名刺の印刷は、片面・両面、モノクロ・カラー、紙質など様々なオプションがございます。標準的な名刺100枚からのご注文が可能で、デザインテンプレートもご用意しています。",
    flyers: "チラシは集客や宣伝に最適なツールです。A4、A5、B5など様々なサイズでご提供可能です。紙質は光沢紙やマット紙、再生紙などお選びいただけます。",
    posters: "ポスターは主にA2、A1、B2サイズでご提供しています。耐久性のある厚手の紙や、屋外用の防水紙もご用意しております。",
    brochures: "パンフレットや冊子は、ページ数、綴じ方（ホチキス止め、無線綴じなど）、紙質を選べます。表紙と本文で異なる紙を使用することも可能です。",
  };
  
  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.includes('こんにちは') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return aiResponses.greeting;
    }
    
    // Check for pricing questions
    if (lowerMessage.includes('価格') || lowerMessage.includes('料金') || lowerMessage.includes('費用') || lowerMessage.includes('いくら')) {
      return aiResponses.pricing;
    }
    
    // Check for delivery time questions
    if (lowerMessage.includes('納期') || lowerMessage.includes('いつ') || lowerMessage.includes('何日') || lowerMessage.includes('日数')) {
      return aiResponses.turnaround;
    }
    
    // Check for product-specific questions
    if (lowerMessage.includes('名刺')) {
      return aiResponses.businessCards;
    }
    
    if (lowerMessage.includes('チラシ') || lowerMessage.includes('フライヤー')) {
      return aiResponses.flyers;
    }
    
    if (lowerMessage.includes('ポスター')) {
      return aiResponses.posters;
    }
    
    if (lowerMessage.includes('パンフレット') || lowerMessage.includes('冊子') || lowerMessage.includes('ブックレット')) {
      return aiResponses.brochures;
    }
    
    // Default response
    return aiResponses.default;
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
  
  const handleSendMessage = () => {
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
    
    // Simulate AI thinking and typing with a delay
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(input),
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
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
        content: 'こんにちは！印刷物に関するご質問やお見積もりのお手伝いをさせていただきます。お気軽にお問い合わせください。',
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Card className="w-full max-w-md h-[32rem] flex flex-col shadow-lg animate-fade-in transition-all duration-300 hover:shadow-xl overflow-hidden">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI印刷アシスタント
          </CardTitle>
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
        <form 
          className="flex items-center w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="メッセージを入力..."
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
      </CardFooter>
    </Card>
  );
};

export default AIChat;
