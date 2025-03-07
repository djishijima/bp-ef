
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { QuoteDetails as QuoteDetailsType } from '@/types';
import { 
  CheckCircle, 
  FileCheck,
  FileText,
  Receipt
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveQuote } from '@/services/quotes';
import { cn } from '@/lib/utils';
import ProductSpecs from './quote/ProductSpecs';
import PriceSummary from './quote/PriceSummary';
import QuoteActions from './quote/QuoteActions';
import { formatPrice } from '@/utils/quoteFormatters';

interface QuoteDetailsProps {
  quote: QuoteDetailsType;
  onNewQuote: () => void;
}

const QuoteDetails = ({ quote, onNewQuote }: QuoteDetailsProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  
  const handleSaveQuote = async () => {
    setIsSaving(true);
    
    try {
      // 実際にデータを保存する
      await saveQuote(quote);
      setIsGenerated(true);
      
      // 保存成功のトースト通知
      toast({
        title: "見積書が保存されました",
        description: (
          <div className="relative">
            <div className="absolute -left-6 -top-5 h-20 w-20 bg-green-100 rounded-full opacity-20 animate-ping"></div>
            <div className="flex items-center gap-2 relative z-10">
              <Receipt className="h-4 w-4 text-blue-500" />
              <span>見積もりデータが保存され、管理者ページで確認できるようになりました。</span>
            </div>
          </div>
        ),
        className: "border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white",
      });
    } catch (error) {
      // エラー通知
      toast({
        variant: "destructive",
        title: "保存エラー",
        description: "見積もりの保存中にエラーが発生しました。",
      });
      console.error("見積もり保存エラー:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card 
      className={cn(
        "w-full max-w-2xl mx-auto overflow-hidden",
        "shadow-lg transition-all duration-500 ease-out-expo animate-fade-in",
        "border border-gray-200/60 hover:shadow-xl",
        isGenerated ? "border-green-200 bg-green-50/30" : ""
      )}
    >
      <CardHeader className={cn(
        "bg-secondary/40 relative overflow-hidden",
        isGenerated ? "bg-gradient-to-r from-green-50 to-blue-50" : ""
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        {isGenerated && (
          <div className="absolute top-0 right-0 m-2">
            <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <FileCheck className="h-3 w-3 mr-1" />
              生成済み
            </div>
          </div>
        )}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full flex items-center">
              <Receipt className="h-3 w-3 mr-1" />
              見積書 #{quote.id}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('ja-JP')}
            </div>
          </div>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              お見積り詳細
            </span>
            <span className="text-2xl font-bold">{formatPrice(quote.price)}</span>
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 pb-2">
        <div className="space-y-4">
          <ProductSpecs specs={quote.specs} turnaround={quote.turnaround} />
          
          <PriceSummary price={quote.price} discountApplied={quote.discountApplied} />
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>お見積もりの有効期限は発行から30日間です。</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-0">
        <QuoteActions 
          onNewQuote={onNewQuote} 
          isGenerated={isGenerated} 
          onSave={handleSaveQuote} 
          isSaving={isSaving}
        />
      </CardFooter>
      
      {isGenerated && (
        <div className="absolute top-1/4 right-0 -mr-10 opacity-20">
          <div className="rotate-30 bg-green-200 p-2 rounded-lg w-40 text-green-800 text-center font-bold text-lg">
            承認済み
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuoteDetails;
