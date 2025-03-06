
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isApiKeySet, setApiKey } from '@/services/ai';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onKeySet: () => void;
}

const ApiKeyInput = ({ onKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKeyState] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "APIキーが入力されていません",
        description: "Google Gemini APIキーを入力してください",
        variant: "destructive",
      });
      return;
    }
    
    // APIキーを保存
    setApiKey(apiKey);
    
    toast({
      title: "APIキーが設定されました",
      description: "Google Gemini APIを使用する準備が整いました",
    });
    
    // 親コンポーネントに通知
    onKeySet();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Google Gemini API設定</CardTitle>
        <CardDescription>
          AIアシスタント機能を有効にするには、Google Gemini APIキーが必要です。
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline block mt-1"
          >
            Google AI Studioでキーを取得
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Google Gemini APIキーを入力"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            保存して続ける
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        APIキーはあなたのブラウザのlocalStorageに保存されます。サーバーに送信されることはありません。
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
