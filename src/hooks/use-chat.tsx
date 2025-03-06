
import { useState, useEffect } from 'react';
import { ChatMessage, QuoteDetails, ServiceType } from '@/types';
import { generateAIResponse, isApiKeySet } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';

// Define the welcome messages
const welcomeMessages = {
  ja: 'こんにちは！印刷、製本、物流、環境印刷に関するご質問やお見積もりのお手伝いをさせていただきます。お気軽にお問い合わせください。',
  en: 'Hello! I can help you with printing, binding, logistics, and eco-friendly printing services. Feel free to ask any questions or request a quote.',
  zh: '您好！我可以帮助您解决印刷、装订、物流和环保印刷服务的问题。欢迎随时提问或索取报价。',
  ko: '안녕하세요! 인쇄, 제본, 물류 및 친환경 인쇄 서비스에 관한 문의나 견적에 도움을 드릴 수 있습니다. 언제든지 질문해 주세요.'
};

interface UseChatProps {
  initialMessage?: string;
  onServiceSelect?: (serviceType: ServiceType) => void;
  onQuoteGenerated?: (quote: QuoteDetails) => void;
  initialApiConfigured?: boolean;
  onApiConfigured?: () => void;
}

export function useChat({
  initialMessage,
  onServiceSelect,
  onQuoteGenerated,
  initialApiConfigured,
  onApiConfigured
}: UseChatProps) {
  const [isApiConfigured, setIsApiConfigured] = useState(initialApiConfigured || isApiKeySet());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: initialMessage || welcomeMessages.ja,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<'ja' | 'en' | 'zh' | 'ko'>('ja');
  const { toast } = useToast();

  // Check if API key is set
  useEffect(() => {
    setIsApiConfigured(initialApiConfigured || isApiKeySet());
  }, [initialApiConfigured]);

  // Function to detect service type from message
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

  // Send message function
  const sendMessage = async (inputText: string) => {
    if (!inputText.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // サービスタイプを検出
      const serviceType = detectServiceType(inputText);
      
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
      if (onQuoteGenerated && (inputText.includes('見積') || inputText.includes('quote') || inputText.includes('estimate'))) {
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
            customSpecs: inputText,
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

  // Change language function
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

  // Clear chat function
  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: welcomeMessages[language],
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };

  // Export chat history function
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

  // Handle API key configuration
  const handleApiConfigured = () => {
    setIsApiConfigured(true);
    if (onApiConfigured) {
      onApiConfigured();
    }
  };

  return {
    messages,
    isTyping,
    language,
    isApiConfigured,
    sendMessage,
    changeLanguage,
    clearChat,
    exportChatHistory,
    handleApiConfigured
  };
}
