
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

interface AIChatProps {
  initialMessage?: string;
  onServiceSelect?: (serviceType: ServiceType) => void;
  onQuoteGenerated?: (quote: QuoteDetails) => void;
}

const AIChat = ({ initialMessage, onServiceSelect, onQuoteGenerated }: AIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: initialMessage || 'こんにちは！印刷、製本、物流、環境印刷に関するご質問やお見積もりのお手伝いをさせていただきます。お気軽にお問い合わせください。',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'ja' | 'en' | 'zh' | 'ko'>('ja');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // 多言語対応のウェルカムメッセージ
  const welcomeMessages = {
    ja: 'こんにちは！印刷、製本、物流、環境印刷に関するご質問やお見積もりのお手伝いをさせていただきます。お気軽にお問い合わせください。',
    en: 'Hello! I can help you with printing, binding, logistics, and eco-friendly printing services. Feel free to ask any questions or request a quote.',
    zh: '您好！我可以帮助您解决印刷、装订、物流和环保印刷服务的问题。欢迎随时提问或索取报价。',
    ko: '안녕하세요! 인쇄, 제본, 물류 및 친환경 인쇄 서비스에 관한 문의나 견적에 도움을 드릴 수 있습니다. 언제든지 질문해 주세요.'
  };
  
  // 各サービスタイプに関する回答
  const aiResponses: Record<string, Record<string, string>> = {
    default: {
      unknown: "申し訳ありませんが、もう少し具体的にお聞かせいただけますか？サービスの種類（印刷・製本・物流・環境印刷）や詳細な情報があるとより正確なご案内ができます。",
      greeting: "こんにちは！印刷、製本、物流、環境印刷に関するご質問やお見積りのサポートをいたします。どのようなお手伝いが必要ですか？",
    },
    printing: {
      intro: "印刷サービスについてお問い合わせありがとうございます。名刺、チラシ、ポスター、パンフレットなど多様な印刷物に対応しています。どのような印刷物をお考えですか？",
      pricing: "印刷物の価格は、サイズ、紙質、印刷色数、数量、加工方法などによって大きく変わります。具体的な仕様をお知らせいただければ、お見積りをご提案できます。",
      turnaround: "標準的な納期は、通常の印刷物で5〜7営業日程度です。特殊加工や大量注文の場合は、さらにお時間をいただくことがあります。急ぎの場合は特急対応も可能ですので、ご相談ください。",
      businessCards: "名刺の印刷は、片面・両面、モノクロ・カラー、紙質など様々なオプションがございます。標準的な名刺100枚からのご注文が可能で、デザインテンプレートもご用意しています。",
      flyers: "チラシは集客や宣伝に最適なツールです。A4、A5、B5など様々なサイズでご提供可能です。紙質は光沢紙やマット紙、再生紙などお選びいただけます。",
      posters: "ポスターは主にA2、A1、B2サイズでご提供しています。耐久性のある厚手の紙や、屋外用の防水紙もご用意しております。",
      brochures: "パンフレットや冊子は、ページ数、綴じ方（ホチキス止め、無線綴じなど）、紙質を選べます。表紙と本文で異なる紙を使用することも可能です。",
    },
    binding: {
      intro: "製本サービスについてお問い合わせありがとうございます。冊子、書籍、マニュアルなど様々な製本方法をご用意しています。どのような製本をお考えですか？",
      pricing: "製本の価格は、ページ数、製本方法、カバーの種類、部数などによって変わります。詳細な仕様をお知らせいただければ、お見積りいたします。",
      turnaround: "製本の標準納期は、製本方法や部数によりますが、通常7〜14営業日程度です。特に高級製本やハードカバーは追加時間が必要です。",
      types: "主な製本方法として、ステープル綴じ（中綴じ）、無線綴じ（接着剤で背を固定）、糸綴じ（高級書籍向け）、リング綴じ、ハードカバー製本などがあります。",
      softcover: "ソフトカバー製本は、表紙が柔らかく軽量で、コストパフォーマンスに優れています。マニュアルやカタログなどに適しています。",
      hardcover: "ハードカバー製本は、耐久性に優れ高級感があります。長期保存用の書籍や記念誌に最適です。表紙の素材やデザインもカスタマイズ可能です。",
      spiral: "スパイラル・リング製本は、ページを180度開くことができ、実用的です。マニュアルやレシピ本などに向いています。",
    },
    logistics: {
      intro: "物流サービスについてお問い合わせありがとうございます。印刷物の配送、保管、梱包など総合的な物流サービスを提供しています。どのようなサービスをお探しですか？",
      pricing: "物流サービスの価格は、重量、配送先、配送速度、梱包方法などにより決まります。具体的な条件をお知らせいただければ、お見積りいたします。",
      turnaround: "配送速度は標準配送で3〜5営業日、特急便で1〜2営業日、当日配送は対象エリア限定でご利用いただけます。国際配送も承っております。",
      packaging: "梱包サービスでは、商品の安全を確保するための適切な梱包材と方法を選定します。環境に配慮した梱包材オプションもございます。",
      storage: "印刷物の一時保管や在庫管理サービスも提供しています。必要に応じて小分け出荷も可能です。",
      tracking: "すべての配送は追跡システムで管理され、配送状況をリアルタイムで確認できます。",
      international: "国際配送は、各国の輸入規制に準拠した書類作成と適切な配送方法を選定します。",
    },
    "eco-printing": {
      intro: "環境印刷サービスについてお問い合わせありがとうございます。環境に配慮した印刷方法、用紙、インクを使用するエコフレンドリーな印刷サービスを提供しています。",
      pricing: "環境印刷の価格は、使用する環境認証用紙、植物性インク、特殊加工などにより異なります。標準的な印刷よりやや高価になりますが、環境への貢献度が高いサービスです。",
      materials: "FSC認証紙、再生紙、非木材紙（竹、サトウキビ、コットンなど）など、さまざまな環境配慮型用紙を取り揃えています。",
      inks: "VOC（揮発性有機化合物）の少ない植物油インクや大豆インクを使用しています。これらは従来の石油系インクよりも環境負荷が低く、リサイクル性に優れています。",
      certifications: "FSC、PEFC、カーボンニュートラル、ノルディックスワンなどの環境認証を取得した製品を提供しています。",
      carbonOffset: "印刷プロセスで発生するCO2排出量を相殺するカーボンオフセットオプションもご用意しています。",
      process: "環境印刷では、製造工程全体で環境負荷を低減する取り組みを実施しています。省エネ機器の使用、廃棄物の削減、水使用量の最適化などが含まれます。",
    },
  };
  
  // 入力メッセージからサービスタイプを特定する
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
  
  // AIの応答を生成する
  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // サービスタイプを検出
    const serviceType = detectServiceType(userMessage);
    
    // サービスタイプが検出されたら親コンポーネントに通知
    if (onServiceSelect) {
      onServiceSelect(serviceType);
    }
    
    // 挨拶の検出
    if (lowerMessage.includes('こんにちは') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return aiResponses.default.greeting;
    }
    
    // サービスタイプごとの回答を検索
    const serviceResponses = aiResponses[serviceType] || aiResponses.printing;
    
    // サービス固有のキーワードを検索
    switch (serviceType) {
      case 'printing':
        if (lowerMessage.includes('価格') || lowerMessage.includes('料金') || lowerMessage.includes('費用') || lowerMessage.includes('いくら')) {
          return serviceResponses.pricing;
        }
        if (lowerMessage.includes('納期') || lowerMessage.includes('いつ') || lowerMessage.includes('何日') || lowerMessage.includes('日数')) {
          return serviceResponses.turnaround;
        }
        if (lowerMessage.includes('名刺')) {
          return serviceResponses.businessCards;
        }
        if (lowerMessage.includes('チラシ') || lowerMessage.includes('フライヤー')) {
          return serviceResponses.flyers;
        }
        if (lowerMessage.includes('ポスター')) {
          return serviceResponses.posters;
        }
        if (lowerMessage.includes('パンフレット') || lowerMessage.includes('冊子') || lowerMessage.includes('ブックレット')) {
          return serviceResponses.brochures;
        }
        return serviceResponses.intro;
        
      case 'binding':
        if (lowerMessage.includes('価格') || lowerMessage.includes('料金') || lowerMessage.includes('費用')) {
          return serviceResponses.pricing;
        }
        if (lowerMessage.includes('納期') || lowerMessage.includes('いつ') || lowerMessage.includes('何日')) {
          return serviceResponses.turnaround;
        }
        if (lowerMessage.includes('種類') || lowerMessage.includes('方法')) {
          return serviceResponses.types;
        }
        if (lowerMessage.includes('ソフトカバー') || lowerMessage.includes('ソフト')) {
          return serviceResponses.softcover;
        }
        if (lowerMessage.includes('ハードカバー') || lowerMessage.includes('ハード')) {
          return serviceResponses.hardcover;
        }
        if (lowerMessage.includes('スパイラル') || lowerMessage.includes('リング')) {
          return serviceResponses.spiral;
        }
        return serviceResponses.intro;
        
      case 'logistics':
        if (lowerMessage.includes('価格') || lowerMessage.includes('料金') || lowerMessage.includes('費用')) {
          return serviceResponses.pricing;
        }
        if (lowerMessage.includes('納期') || lowerMessage.includes('いつ') || lowerMessage.includes('何日') || lowerMessage.includes('速度')) {
          return serviceResponses.turnaround;
        }
        if (lowerMessage.includes('梱包')) {
          return serviceResponses.packaging;
        }
        if (lowerMessage.includes('保管') || lowerMessage.includes('在庫')) {
          return serviceResponses.storage;
        }
        if (lowerMessage.includes('追跡') || lowerMessage.includes('トラッキング')) {
          return serviceResponses.tracking;
        }
        if (lowerMessage.includes('国際') || lowerMessage.includes('海外')) {
          return serviceResponses.international;
        }
        return serviceResponses.intro;
        
      case 'eco-printing':
        if (lowerMessage.includes('価格') || lowerMessage.includes('料金') || lowerMessage.includes('費用')) {
          return serviceResponses.pricing;
        }
        if (lowerMessage.includes('材料') || lowerMessage.includes('用紙') || lowerMessage.includes('紙')) {
          return serviceResponses.materials;
        }
        if (lowerMessage.includes('インク')) {
          return serviceResponses.inks;
        }
        if (lowerMessage.includes('認証') || lowerMessage.includes('証明')) {
          return serviceResponses.certifications;
        }
        if (lowerMessage.includes('カーボン') || lowerMessage.includes('オフセット') || lowerMessage.includes('co2')) {
          return serviceResponses.carbonOffset;
        }
        if (lowerMessage.includes('プロセス') || lowerMessage.includes('工程') || lowerMessage.includes('製造')) {
          return serviceResponses.process;
        }
        return serviceResponses.intro;
        
      default:
        return aiResponses.default.unknown;
    }
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
    
    // AIの思考・タイピングを遅延でシミュレート
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(input),
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      
      // 仮の見積もり生成 (実際のアプリでは適切なタイミングで生成)
      if (onQuoteGenerated && input.includes('見積') || input.includes('quote') || input.includes('estimate')) {
        // サンプルの見積もりデータを生成
        const sampleQuote: QuoteDetails = {
          id: `QT-${Date.now()}`,
          specs: {
            serviceType: detectServiceType(input),
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
    }, 1000 + Math.random() * 2000); // 1〜3秒のランダムな遅延
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
