
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PrintSpecs, QuoteDetails } from '@/types';
import { calculateQuote } from '@/utils/printCalculator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface PrintFormProps {
  onQuoteGenerated: (quote: QuoteDetails) => void;
}

const PrintForm = ({ onQuoteGenerated }: PrintFormProps) => {
  const { toast } = useToast();
  const [specs, setSpecs] = useState<PrintSpecs>({
    productType: '',
    size: '',
    quantity: 100,
    paperType: '',
    printColors: '',
    finishing: [],
    customSpecs: '',
  });
  const [date, setDate] = useState<Date | undefined>();
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!specs.productType) newErrors.productType = '商品タイプを選択してください';
    if (!specs.size) newErrors.size = 'サイズを選択してください';
    if (!specs.quantity || specs.quantity < 1) newErrors.quantity = '有効な数量を入力してください';
    if (!specs.paperType) newErrors.paperType = '用紙タイプを選択してください';
    if (!specs.printColors) newErrors.printColors = '印刷色を選択してください';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PrintSpecs, value: any) => {
    setSpecs(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFinishingToggle = (value: string) => {
    setSpecs(prev => {
      const finishingOptions = prev.finishing.includes(value)
        ? prev.finishing.filter(item => item !== value)
        : [...prev.finishing, value];
      
      return { ...prev, finishing: finishingOptions };
    });
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "入力エラー",
        description: "すべての必須項目を入力してください",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingQuote(true);
    
    // Update specs with delivery date if selected
    const updatedSpecs = { ...specs };
    if (date) {
      updatedSpecs.deliveryDate = date;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      const quote = calculateQuote(updatedSpecs);
      onQuoteGenerated(quote);
      setIsGeneratingQuote(false);
      
      toast({
        title: "お見積もりが生成されました",
        description: "詳細を確認してください",
      });
    }, 1500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg animate-fade-in transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">印刷仕様入力</CardTitle>
        <CardDescription>お見積りに必要な情報を入力してください</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productType" className={cn(errors.productType && "text-destructive")}>
                商品タイプ <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={specs.productType} 
                onValueChange={(value) => handleInputChange('productType', value)}
              >
                <SelectTrigger id="productType" className={cn(errors.productType && "border-destructive")}>
                  <SelectValue placeholder="商品タイプを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business-card">名刺</SelectItem>
                  <SelectItem value="flyer">チラシ</SelectItem>
                  <SelectItem value="brochure">パンフレット</SelectItem>
                  <SelectItem value="poster">ポスター</SelectItem>
                  <SelectItem value="booklet">冊子</SelectItem>
                  <SelectItem value="postcard">ポストカード</SelectItem>
                  <SelectItem value="stationery">文房具</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
              {errors.productType && (
                <p className="text-sm text-destructive">{errors.productType}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size" className={cn(errors.size && "text-destructive")}>
                サイズ <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={specs.size} 
                onValueChange={(value) => handleInputChange('size', value)}
              >
                <SelectTrigger id="size" className={cn(errors.size && "border-destructive")}>
                  <SelectValue placeholder="サイズを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a3">A3</SelectItem>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="a5">A5</SelectItem>
                  <SelectItem value="b4">B4</SelectItem>
                  <SelectItem value="b5">B5</SelectItem>
                  <SelectItem value="postcard">ハガキ</SelectItem>
                  <SelectItem value="business-card">名刺サイズ</SelectItem>
                  <SelectItem value="custom">カスタム</SelectItem>
                </SelectContent>
              </Select>
              {errors.size && (
                <p className="text-sm text-destructive">{errors.size}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className={cn(errors.quantity && "text-destructive")}>
              数量 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quantity"
              type="number"
              value={specs.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              min={1}
              className={cn(errors.quantity && "border-destructive")}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paperType" className={cn(errors.paperType && "text-destructive")}>
              用紙タイプ <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={specs.paperType} 
              onValueChange={(value) => handleInputChange('paperType', value)}
            >
              <SelectTrigger id="paperType" className={cn(errors.paperType && "border-destructive")}>
                <SelectValue placeholder="用紙タイプを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">普通紙</SelectItem>
                <SelectItem value="premium">上質紙</SelectItem>
                <SelectItem value="recycled">再生紙</SelectItem>
                <SelectItem value="glossy">光沢紙</SelectItem>
                <SelectItem value="matte">マット紙</SelectItem>
                <SelectItem value="textured">エンボス紙</SelectItem>
              </SelectContent>
            </Select>
            {errors.paperType && (
              <p className="text-sm text-destructive">{errors.paperType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="printColors" className={cn(errors.printColors && "text-destructive")}>
              印刷色 <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={specs.printColors}
              onValueChange={(value) => handleInputChange('printColors', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="black-and-white" id="color-bw" />
                <Label htmlFor="color-bw">モノクロ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-color-one-side" id="color-one" />
                <Label htmlFor="color-one">フルカラー（片面）</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-color-both-sides" id="color-both" />
                <Label htmlFor="color-both">フルカラー（両面）</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spot-color" id="color-spot" />
                <Label htmlFor="color-spot">特色</Label>
              </div>
            </RadioGroup>
            {errors.printColors && (
              <p className="text-sm text-destructive">{errors.printColors}</p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>仕上げ (複数選択可)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="finish-none" 
                  checked={specs.finishing.includes('none')}
                  onCheckedChange={() => handleFinishingToggle('none')}
                />
                <Label htmlFor="finish-none">なし</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="finish-folding" 
                  checked={specs.finishing.includes('folding')}
                  onCheckedChange={() => handleFinishingToggle('folding')}
                />
                <Label htmlFor="finish-folding">折り</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="finish-binding" 
                  checked={specs.finishing.includes('binding')}
                  onCheckedChange={() => handleFinishingToggle('binding')}
                />
                <Label htmlFor="finish-binding">製本</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="finish-lamination" 
                  checked={specs.finishing.includes('lamination')}
                  onCheckedChange={() => handleFinishingToggle('lamination')}
                />
                <Label htmlFor="finish-lamination">ラミネート</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="finish-die-cutting" 
                  checked={specs.finishing.includes('die-cutting')}
                  onCheckedChange={() => handleFinishingToggle('die-cutting')}
                />
                <Label htmlFor="finish-die-cutting">型抜き</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="finish-embossing" 
                  checked={specs.finishing.includes('embossing')}
                  onCheckedChange={() => handleFinishingToggle('embossing')}
                />
                <Label htmlFor="finish-embossing">エンボス</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="finish-foil-stamping" 
                  checked={specs.finishing.includes('foil-stamping')}
                  onCheckedChange={() => handleFinishingToggle('foil-stamping')}
                />
                <Label htmlFor="finish-foil-stamping">箔押し</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="finish-uv-coating" 
                  checked={specs.finishing.includes('uv-coating')}
                  onCheckedChange={() => handleFinishingToggle('uv-coating')}
                />
                <Label htmlFor="finish-uv-coating">UVコート</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customSpecs">特記事項 (オプション)</Label>
            <Textarea
              id="customSpecs"
              placeholder="その他の印刷条件や特記事項があればご記入ください"
              value={specs.customSpecs}
              onChange={(e) => handleInputChange('customSpecs', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">希望納期 (オプション)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'yyyy年MM月dd日') : "日付を選択"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full flex items-center gap-2 transition-all duration-300" 
          onClick={handleSubmit}
          disabled={isGeneratingQuote}
        >
          {isGeneratingQuote ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              お見積り計算中...
            </>
          ) : (
            <>
              <Printer className="h-4 w-4" />
              お見積りを作成
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrintForm;
