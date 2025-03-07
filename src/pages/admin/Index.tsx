import { useState, useEffect } from 'react';
import { getSavedQuotes, deleteQuote } from '@/services/quotes';
import { QuoteDetails as QuoteDetailsType } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/utils/quoteFormatters';
import { Trash2, Eye, ReceiptText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

export default function AdminPage() {
  const [quotes, setQuotes] = useState<QuoteDetailsType[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // 見積もりデータを取得
  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = () => {
    setIsLoading(true);
    try {
      const quotesData = getSavedQuotes();
      setQuotes(quotesData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "データ取得エラー",
        description: "見積もりデータの取得に失敗しました",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 見積もりの詳細を表示
  const handleViewQuote = (quote: QuoteDetailsType) => {
    setSelectedQuote(quote);
  };

  // 見積もりを削除
  const handleDeleteQuote = async (quoteId: string) => {
    try {
      await deleteQuote(quoteId);
      setQuotes(quotes.filter(q => q.id !== quoteId));
      setQuoteToDelete(null);
      toast({
        title: "削除完了",
        description: "見積もりが削除されました",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "削除エラー",
        description: "見積もりの削除に失敗しました",
      });
    }
  };

  // 詳細モーダルを閉じる
  const closeQuoteDetail = () => {
    setSelectedQuote(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('ja-JP');
    } catch (e) {
      return '日付不明';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <Header />
      
      <main className="flex-1 w-full overflow-x-hidden pt-20 pb-12">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">管理者ページ</h1>
              <p className="text-muted-foreground">送信された見積もりを確認・管理できます</p>
            </div>
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> 戻る
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ReceiptText className="h-5 w-5" /> 見積もり一覧
              </CardTitle>
              <CardDescription>
                {quotes.length > 0 
                  ? `${quotes.length}件の見積もりが保存されています`
                  : 'データがありません'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">データを読み込み中...</p>
                </div>
              ) : quotes.length > 0 ? (
                <Table>
                  <TableCaption>見積もり一覧（最新順）</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>日時</TableHead>
                      <TableHead>種類</TableHead>
                      <TableHead className="text-right">金額</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.id}</TableCell>
                        <TableCell>{quote.createdAt ? formatDate(quote.createdAt) : '-'}</TableCell>
                        <TableCell>{quote.specs?.serviceType || 'その他'}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(quote.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewQuote(quote)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => setQuoteToDelete(quote.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>この見積もりを削除しますか？</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    この操作は元に戻せません。見積もり ID: {quote.id} を削除します。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteQuote(quote.id)}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    削除する
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">見積もりデータがありません</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* 見積もり詳細モーダル */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">見積もり詳細</h2>
                <Button variant="ghost" size="sm" onClick={closeQuoteDetail}>
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">見積もりID</p>
                    <p className="text-lg">{selectedQuote.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">作成日時</p>
                    <p>{selectedQuote.createdAt ? formatDate(selectedQuote.createdAt) : '不明'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">金額</p>
                  <p className="text-2xl font-bold">{formatPrice(selectedQuote.price)}</p>
                </div>
                
                <div className="border rounded p-3 bg-gray-50">
                  <p className="text-sm font-medium mb-2">仕様詳細</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">サービスタイプ</p>
                      <p>{selectedQuote.specs?.serviceType || '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">製品タイプ</p>
                      <p>{selectedQuote.specs?.productType || '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">数量</p>
                      <p>{selectedQuote.specs?.quantity || '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">サイズ</p>
                      <p>{selectedQuote.specs?.size || '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">用紙タイプ</p>
                      <p>{selectedQuote.specs?.paperType || '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">印刷色数</p>
                      <p>{selectedQuote.specs?.printColors || '-'}</p>
                    </div>
                  </div>
                  
                  {selectedQuote.specs?.customSpecs && (
                    <div className="mt-2">
                      <p className="font-medium">カスタム仕様</p>
                      <p className="whitespace-pre-wrap">{selectedQuote.specs.customSpecs}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium">納期</p>
                  <p>{selectedQuote.turnaround || '標準納期'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">備考</p>
                  <p className="whitespace-pre-wrap">{selectedQuote.notes || '特になし'}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button variant="default" onClick={closeQuoteDetail}>
                閉じる
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
