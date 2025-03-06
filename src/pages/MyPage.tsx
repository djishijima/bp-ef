
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatLog, getChatLogs, deleteChatLog, clearAllChatLogs } from '@/utils/logManager';
import { Trash2, ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const serviceTypeName = {
  'printing': '印刷',
  'binding': '製本',
  'logistics': '物流',
  'eco-printing': '環境印刷',
  'sdgs-consulting': 'SDGsコンサルティング',
  'sustainability-report': 'サステナビリティレポート'
};

const MyPage = () => {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [activeLog, setActiveLog] = useState<ChatLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // チャットログの読み込み
  const loadLogs = () => {
    setIsLoading(true);
    const fetchedLogs = getChatLogs();
    setLogs(fetchedLogs);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // ログの削除
  const handleDeleteLog = (id: string) => {
    deleteChatLog(id);
    
    if (activeLog?.id === id) {
      setActiveLog(null);
    }
    
    setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
    
    toast({
      title: "削除完了",
      description: "ログが削除されました。",
    });
  };

  // 全ログの削除
  const handleClearAllLogs = () => {
    if (window.confirm('全てのログを削除しますか？この操作は元に戻せません。')) {
      clearAllChatLogs();
      setLogs([]);
      setActiveLog(null);
      
      toast({
        title: "削除完了",
        description: "全てのログが削除されました。",
      });
    }
  };

  // ログの詳細表示
  const handleViewLog = (log: ChatLog) => {
    setActiveLog(log);
  };

  // チャット履歴をエクスポート
  const exportChatHistory = (messages: ChatMessage[]) => {
    const formatDate = (date: Date) => {
      return format(date, 'yyyy年MM月dd日 HH:mm', { locale: ja });
    };
    
    // 会話内容をテキスト形式に整形
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

  // サービスタイプの表示用
  const getServiceTypeDisplay = (type?: string) => {
    if (!type) return '不明';
    return serviceTypeName[type as keyof typeof serviceTypeName] || type;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center mb-6 gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">マイページ</h1>
          </div>
          
          <Tabs defaultValue="logs" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="logs">利用履歴</TabsTrigger>
              <TabsTrigger value="settings">設定</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左側: ログリスト */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>会話履歴</CardTitle>
                        <CardDescription>過去の会話履歴一覧</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={loadLogs}
                          title="更新"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        {logs.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleClearAllLogs}
                            title="全削除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="py-8 text-center text-muted-foreground">
                          読み込み中...
                        </div>
                      ) : logs.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                          会話履歴がありません
                        </div>
                      ) : (
                        <ul className="space-y-2">
                          {logs.map((log) => (
                            <li key={log.id}>
                              <Button
                                variant={activeLog?.id === log.id ? "default" : "outline"}
                                className="w-full justify-start text-left h-auto py-3"
                                onClick={() => handleViewLog(log)}
                              >
                                <div className="w-full">
                                  <div className="flex justify-between items-center w-full">
                                    <span className="font-medium truncate">
                                      {format(log.date, 'yyyy年MM月dd日', { locale: ja })}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {format(log.date, 'HH:mm', { locale: ja })}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {getServiceTypeDisplay(log.serviceType)}
                                    </Badge>
                                    {log.quoteGenerated && (
                                      <Badge className="text-xs">
                                        見積り
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {log.messages.length}件のメッセージ
                                  </p>
                                </div>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* 右側: 詳細表示 */}
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    {activeLog ? (
                      <>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <div>
                            <CardTitle>
                              {format(activeLog.date, 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">
                                {getServiceTypeDisplay(activeLog.serviceType)}
                              </Badge>
                              {activeLog.quoteGenerated && (
                                <Badge>
                                  見積り発行済み
                                </Badge>
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => exportChatHistory(activeLog.messages)}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>エクスポート</span>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteLog(activeLog.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>削除</span>
                            </Button>
                          </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                          <div className="space-y-4">
                            {activeLog.messages.map((message, index) => (
                              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div 
                                  className={`max-w-[80%] p-3 rounded-lg ${
                                    message.sender === 'user' 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p className="text-xs mt-1 opacity-70 text-right">
                                    {format(message.timestamp, 'HH:mm', { locale: ja })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center p-6">
                        <div className="text-center text-muted-foreground">
                          <p className="mb-2">会話を選択してください</p>
                          <p className="text-sm">左側のリストから詳細を表示したい会話を選択してください</p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>設定</CardTitle>
                  <CardDescription>アプリケーションの設定を変更できます</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">現在設定可能な項目はありません</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
