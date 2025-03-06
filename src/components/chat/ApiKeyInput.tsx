
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, ExternalLink } from 'lucide-react';
import { setApiKey } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onKeySet: () => void;
  language?: 'ja' | 'en' | 'zh' | 'ko';
}

const ApiKeyInput = ({ onKeySet, language = 'ja' }: ApiKeyInputProps) => {
  const [apiKey, setApiKeyState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Translations for multilingual support
  const translations = {
    title: {
      ja: 'Google Gemini API設定',
      en: 'Google Gemini API Setup',
      zh: 'Google Gemini API设置',
      ko: 'Google Gemini API 설정',
    },
    description: {
      ja: 'AIアシスタント機能を有効にするには、Google Gemini APIキーが必要です。',
      en: 'To enable AI assistant features, you need a Google Gemini API key.',
      zh: '要启用AI助手功能，您需要Google Gemini API密钥。',
      ko: 'AI 어시스턴트 기능을 활성화하려면 Google Gemini API 키가 필요합니다.',
    },
    getKey: {
      ja: 'Google AI Studioでキーを取得',
      en: 'Get a key from Google AI Studio',
      zh: '从Google AI Studio获取密钥',
      ko: 'Google AI Studio에서 키 받기',
    },
    placeholder: {
      ja: 'Google Gemini APIキーを入力',
      en: 'Enter your Google Gemini API key',
      zh: '输入您的Google Gemini API密钥',
      ko: 'Google Gemini API 키를 입력하세요',
    },
    button: {
      ja: '保存して続ける',
      en: 'Save and Continue',
      zh: '保存并继续',
      ko: '저장하고 계속하기',
    },
    footer: {
      ja: 'APIキーはあなたのブラウザのlocalStorageに保存されます。サーバーに送信されることはありません。',
      en: 'Your API key is stored in your browser\'s localStorage. It is never sent to our servers.',
      zh: '您的API密钥存储在浏览器的localStorage中。它永远不会发送到我们的服务器。',
      ko: 'API 키는 브라우저의 localStorage에 저장됩니다. 당사 서버로 전송되지 않습니다.',
    },
    errorEmpty: {
      ja: 'APIキーが入力されていません',
      en: 'API key is empty',
      zh: 'API密钥为空',
      ko: 'API 키가 비어 있습니다',
    },
    errorDetail: {
      ja: 'Google Gemini APIキーを入力してください',
      en: 'Please enter your Google Gemini API key',
      zh: '请输入您的Google Gemini API密钥',
      ko: 'Google Gemini API 키를 입력하세요',
    },
    success: {
      ja: 'APIキーが設定されました',
      en: 'API key has been set',
      zh: 'API密钥已设置',
      ko: 'API 키가 설정되었습니다',
    },
    successDetail: {
      ja: 'Google Gemini APIを使用する準備が整いました',
      en: 'Ready to use Google Gemini API',
      zh: '准备使用Google Gemini API',
      ko: 'Google Gemini API를 사용할 준비가 되었습니다',
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: translations.errorEmpty[language],
        description: translations.errorDetail[language],
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save API key
      setApiKey(apiKey);
      
      toast({
        title: translations.success[language],
        description: translations.successDetail[language],
      });
      
      // Notify parent component
      onKeySet();
    } catch (error) {
      toast({
        title: translations.errorEmpty[language],
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          {translations.title[language]}
        </CardTitle>
        <CardDescription>
          {translations.description[language]}
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1 mt-1"
          >
            {translations.getKey[language]}
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="password"
              placeholder={translations.placeholder[language]}
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              className="w-full bg-background pr-12"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {translations.button[language]}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground text-center">
        {translations.footer[language]}
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
