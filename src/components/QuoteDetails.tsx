
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuoteDetails as QuoteDetailsType } from '@/types';
import { CheckCircle, Download, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface QuoteDetailsProps {
  quote: QuoteDetailsType;
  onNewQuote: () => void;
}

const QuoteDetails = ({ quote, onNewQuote }: QuoteDetailsProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveQuote = () => {
    setIsSaving(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "見積書が保存されました",
        description: "お客様のメールアドレスに見積書のコピーを送信しました。",
      });
    }, 1500);
  };
  
  // Format Japanese Yen
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  // Calculate discounted amount if applicable
  const getDiscountAmount = () => {
    if (!quote.discountApplied) return null;
    
    const originalPrice = Math.round(quote.price / (1 - quote.discountApplied));
    const discountAmount = originalPrice - quote.price;
    
    return {
      discountPercentage: quote.discountApplied * 100,
      discountAmount
    };
  };
  
  const discountInfo = getDiscountAmount();

  return (
    <Card 
      className={cn(
        "w-full max-w-2xl mx-auto overflow-hidden",
        "shadow-lg transition-all duration-500 ease-out-expo animate-fade-in",
        "border border-gray-200/60 hover:shadow-xl"
      )}
    >
      <CardHeader className="bg-secondary/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              見積書 #{quote.id}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('ja-JP')}
            </div>
          </div>
          <CardTitle className="flex items-center justify-between">
            <span>お見積り詳細</span>
            <span className="text-2xl font-bold">{formatPrice(quote.price)}</span>
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 pb-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">商品タイプ</h4>
              <p className="text-sm font-medium">{getProductTypeName(quote.specs.productType)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">サイズ</h4>
              <p className="text-sm font-medium">{getSizeName(quote.specs.size)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">数量</h4>
              <p className="text-sm font-medium">{quote.specs.quantity}部</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">用紙タイプ</h4>
              <p className="text-sm font-medium">{getPaperTypeName(quote.specs.paperType)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">印刷色</h4>
              <p className="text-sm font-medium">{getPrintColorName(quote.specs.printColors)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">納期</h4>
              <p className="text-sm font-medium">約{quote.turnaround}営業日</p>
            </div>
          </div>
          
          {quote.specs.finishing.length > 0 && quote.specs.finishing[0] !== 'none' && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">仕上げ</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {quote.specs.finishing.map((finish) => (
                  <div 
                    key={finish}
                    className="px-2 py-1 bg-secondary text-xs rounded-md"
                  >
                    {getFinishingName(finish)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {quote.specs.customSpecs && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">特記事項</h4>
              <p className="text-sm font-medium">{quote.specs.customSpecs}</p>
            </div>
          )}
          
          <div className="rounded-md border border-gray-100 bg-gray-50/50 p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">小計</span>
              <span className="text-sm">
                {discountInfo 
                  ? formatPrice(Math.round(quote.price / (1 - quote.discountApplied)))
                  : formatPrice(quote.price)
                }
              </span>
            </div>
            
            {discountInfo && (
              <div className="flex items-center justify-between mb-2 text-green-600">
                <span className="text-sm font-medium">
                  数量割引 ({discountInfo.discountPercentage}%)
                </span>
                <span className="text-sm">-{formatPrice(discountInfo.discountAmount)}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-medium">合計 (税抜)</span>
              <span className="text-sm font-bold">{formatPrice(quote.price)}</span>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-medium">消費税 (10%)</span>
              <span className="text-sm">{formatPrice(Math.round(quote.price * 0.1))}</span>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
              <span className="font-medium">合計 (税込)</span>
              <span className="font-bold">{formatPrice(Math.round(quote.price * 1.1))}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>お見積もりの有効期限は発行から30日間です。</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
        <div className="flex gap-3 w-full">
          <Button 
            className="flex-1 bg-primary/90 hover:bg-primary transition-all duration-300"
            onClick={handleSaveQuote}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                保存中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                見積もりを保存
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF出力
          </Button>
        </div>
        
        <Button 
          variant="link" 
          className="transition-all duration-300"
          onClick={onNewQuote}
        >
          別の見積もりを作成
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper functions for display names
function getProductTypeName(type: string): string {
  const productTypes: Record<string, string> = {
    'business-card': '名刺',
    'flyer': 'チラシ',
    'brochure': 'パンフレット',
    'poster': 'ポスター',
    'booklet': '冊子',
    'postcard': 'ポストカード',
    'stationery': '文房具',
    'other': 'その他',
  };
  return productTypes[type] || type;
}

function getSizeName(size: string): string {
  const sizes: Record<string, string> = {
    'a3': 'A3',
    'a4': 'A4',
    'a5': 'A5',
    'b4': 'B4',
    'b5': 'B5',
    'postcard': 'ハガキ',
    'business-card': '名刺サイズ',
    'custom': 'カスタム',
  };
  return sizes[size] || size;
}

function getPaperTypeName(type: string): string {
  const paperTypes: Record<string, string> = {
    'standard': '普通紙',
    'premium': '上質紙',
    'recycled': '再生紙',
    'glossy': '光沢紙',
    'matte': 'マット紙',
    'textured': 'エンボス紙',
  };
  return paperTypes[type] || type;
}

function getPrintColorName(color: string): string {
  const printColors: Record<string, string> = {
    'black-and-white': 'モノクロ',
    'full-color-one-side': 'フルカラー（片面）',
    'full-color-both-sides': 'フルカラー（両面）',
    'spot-color': '特色',
  };
  return printColors[color] || color;
}

function getFinishingName(finishing: string): string {
  const finishingTypes: Record<string, string> = {
    'none': 'なし',
    'folding': '折り',
    'binding': '製本',
    'lamination': 'ラミネート',
    'die-cutting': '型抜き',
    'embossing': 'エンボス',
    'foil-stamping': '箔押し',
    'uv-coating': 'UVコート',
  };
  return finishingTypes[finishing] || finishing;
}

export default QuoteDetails;
