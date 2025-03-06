import { useState, useEffect, useRef } from 'react';
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
import { PrintSpecs, QuoteDetails, ServiceType, ChatMessage } from '@/types';
import { calculateQuote } from '@/utils/printCalculator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Printer, Upload, HelpCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface PrintFormProps {
  onQuoteGenerated: (quote: QuoteDetails) => void;
  serviceType: ServiceType;
  onAskAI?: (question: string, fieldName?: string) => void;
}

const PrintForm = ({ onQuoteGenerated, serviceType, onAskAI }: PrintFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [specs, setSpecs] = useState<PrintSpecs>({
    serviceType: serviceType,
    productType: '',
    size: '',
    quantity: 100,
    paperType: '',
    printColors: '',
    finishing: [],
    customSpecs: '',
    uploadedFiles: [],
    fileUrls: [],
  });
  const [date, setDate] = useState<Date | undefined>();
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showFieldHelp, setShowFieldHelp] = useState<string | null>(null);
  
  useEffect(() => {
    setSpecs(prev => ({
      ...prev,
      serviceType: serviceType,
    }));
  }, [serviceType]);

  const fieldHelp: Record<string, string> = {
    productType: '印刷物の種類を選択してください。デザインや仕様に影響します。',
    size: '印刷物のサイズを選択します。特殊サイズはカスタムを選んで詳細を記入してください。',
    quantity: '印刷部数を入力してください。数量が多いほど1部あたりの単価は下がります。',
    paperType: '紙の種類によって印刷効果や耐久性が変わります。目的に合わせて選択してください。',
    printColors: '印刷色数を選択します。フルカラーは写真やグラデーションに適しています。',
    finishing: '折り、製本、加工など印刷後の仕上げ処理を選択できます。複数選択可能です。',
    bindingType: '製本方法によって本の開き方や耐久性が変わります。用途に合わせて選択してください。',
    ecoMaterials: '環境に配慮した素材を選択できます。SDGsの取り組みをアピールするのに効果的です。',
    consultingScope: 'コンサルティングの範囲と深さを選択します。より広範なサービスほどコストが高くなります。',
    reportType: 'レポートの種類によって必要な情報や構成が異なります。適切なタイプを選択してください。',
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!specs.productType) newErrors.productType = '商品タイプを���択してください';
    
    if (serviceType === 'printing' || serviceType === 'eco-printing') {
      if (!specs.size) newErrors.size = 'サイズを選択してください';
      if (!specs.quantity || specs.quantity < 1) newErrors.quantity = '有効な数量を入力してください';
      if (!specs.paperType) newErrors.paperType = '用紙タイプを選択してください';
      if (!specs.printColors) newErrors.printColors = '印刷色を選択してください';
    } else if (serviceType === 'binding') {
      if (!specs.bindingType) newErrors.bindingType = '製本タイプを選択してください';
      if (!specs.pageCount || specs.pageCount < 1) newErrors.pageCount = 'ページ数を入力してください';
    } else if (serviceType === 'logistics') {
      if (!specs.weight || specs.weight <= 0) newErrors.weight = '重量を入力してください';
      if (!specs.deliverySpeed) newErrors.deliverySpeed = '配送速度を選択してください';
      if (!specs.deliveryAddress) newErrors.deliveryAddress = '配送先住所を入力してください';
    } else if (serviceType === 'sdgs-consulting') {
      if (!specs.companySize) newErrors.companySize = '会社規模を選択してください';
      if (!specs.industryType) newErrors.industryType = '業種を選択してください';
      if (!specs.consultingScope) newErrors.consultingScope = 'コンサルティング範囲を選択してください';
    } else if (serviceType === 'sustainability-report') {
      if (!specs.reportType) newErrors.reportType = 'レポートタイプを選択してください';
      if (!specs.reportLength || specs.reportLength < 1) newErrors.reportLength = 'ページ数を入力してください';
      if (!specs.designComplexity) newErrors.designComplexity = 'デザインの複雑さを選択してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PrintSpecs, value: any) => {
    setSpecs(prev => ({ ...prev, [field]: value }));
    
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

  const handleAskAI = (fieldName: string) => {
    if (onAskAI) {
      const question = `${fieldName}について教えてください。`;
      onAskAI(question, fieldName);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
    
    const newFileUrls = files.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });
    
    setPreviewUrls(prevUrls => [...prevUrls, ...newFileUrls.filter(url => url)]);
    
    setSpecs(prev => ({
      ...prev,
      uploadedFiles: [...(prev.uploadedFiles || []), ...files],
      fileUrls: [...(prev.fileUrls || []), ...newFileUrls]
    }));
    
    toast({
      title: "ファイルがアップロードされました",
      description: `${files.length}個のファイルがアップロードされました`,
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
    
    setPreviewUrls(prevUrls => {
      const newUrls = [...prevUrls];
      if (newUrls[index]) {
        URL.revokeObjectURL(newUrls[index]);
      }
      newUrls.splice(index, 1);
      return newUrls;
    });
    
    setSpecs(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles?.filter((_, i) => i !== index),
      fileUrls: prev.fileUrls?.filter((_, i) => i !== index)
    }));
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
    
    const updatedSpecs = { ...specs };
    if (date) {
      updatedSpecs.deliveryDate = date;
    }
    
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

  const renderServiceTypeFields = () => {
    switch (serviceType) {
      case 'printing':
        return renderPrintingFields();
      case 'binding':
        return renderBindingFields();
      case 'logistics':
        return renderLogisticsFields();
      case 'eco-printing':
        return renderEcoPrintingFields();
      case 'sdgs-consulting':
        return renderSdgsConsultingFields();
      case 'sustainability-report':
        return renderSustainabilityReportFields();
      default:
        return renderPrintingFields();
    }
  };

  const renderPrintingFields = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="productType" className={cn(errors.productType && "text-destructive")}>
                商品タイプ <span className="text-destructive">*</span>
              </Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 rounded-full" 
                onClick={() => setShowFieldHelp(showFieldHelp === 'productType' ? null : 'productType')}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
            {showFieldHelp === 'productType' && (
              <div className="text-sm bg-muted p-2 rounded-md mb-2">
                {fieldHelp.productType}
                <Button 
                  variant="link" 
                  size="sm"
                  className="p-0 h-auto text-xs"
                  onClick={() => handleAskAI('商品タイプ')}
                >
                  AIに質問する
                </Button>
              </div>
            )}
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
            <div className="flex items-center justify-between">
              <Label htmlFor="size" className={cn(errors.size && "text-destructive")}>
                サイズ <span className="text-destructive">*</span>
              </Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 rounded-full" 
                onClick={() => setShowFieldHelp(showFieldHelp === 'size' ? null : 'size')}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
            {showFieldHelp === 'size' && (
              <div className="text-sm bg-muted p-2 rounded-md mb-2">
                {fieldHelp.size}
                <Button 
                  variant="link" 
                  size="sm"
                  className="p-0 h-auto text-xs"
                  onClick={() => handleAskAI('印刷サイズ')}
                >
                  AIに質問する
                </Button>
              </div>
            )}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="quantity" className={cn(errors.quantity && "text-destructive")}>
              数量 <span className="text-destructive">*</span>
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={() => setShowFieldHelp(showFieldHelp === 'quantity' ? null : 'quantity')}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          {showFieldHelp === 'quantity' && (
            <div className="text-sm bg-muted p-2 rounded-md mb-2">
              {fieldHelp.quantity}
              <Button 
                variant="link" 
                size="sm"
                className="p-0 h-auto text-xs ml-1"
                onClick={() => handleAskAI('印刷数量')}
              >
                AIに質問する
              </Button>
            </div>
          )}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="paperType" className={cn(errors.paperType && "text-destructive")}>
              用紙タイプ <span className="text-destructive">*</span>
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={() => setShowFieldHelp(showFieldHelp === 'paperType' ? null : 'paperType')}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          {showFieldHelp === 'paperType' && (
            <div className="text-sm bg-muted p-2 rounded-md mb-2">
              {fieldHelp.paperType}
              <Button 
                variant="link" 
                size="sm"
                className="p-0 h-auto text-xs ml-1"
                onClick={() => handleAskAI('用紙タイプ')}
              >
                AIに質問する
              </Button>
            </div>
          )}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="printColors" className={cn(errors.printColors && "text-destructive")}>
              印刷色 <span className="text-destructive">*</span>
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={() => setShowFieldHelp(showFieldHelp === 'printColors' ? null : 'printColors')}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          {showFieldHelp === 'printColors' && (
            <div className="text-sm bg-muted p-2 rounded-md mb-2">
              {fieldHelp.printColors}
              <Button 
                variant="link" 
                size="sm"
                className="p-0 h-auto text-xs ml-1"
                onClick={() => handleAskAI('印刷色')}
              >
                AIに質問する
              </Button>
            </div>
          )}
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
          <div className="flex items-center justify-between">
            <Label>仕上げ (複数選択可)</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={() => setShowFieldHelp(showFieldHelp === 'finishing' ? null : 'finishing')}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          {showFieldHelp === 'finishing' && (
            <div className="text-sm bg-muted p-2 rounded-md mb-2">
              {fieldHelp.finishing}
              <Button 
                variant="link" 
                size="sm"
                className="p-0 h-auto text-xs ml-1"
                onClick={() => handleAskAI('印刷仕上げ')}
              >
                AIに質問する
              </Button>
            </div>
          )}
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
      </>
    );
  };

  const renderBindingFields = () => {
    return (
      <>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bindingType" className={cn(errors.bindingType && "text-destructive")}>
              製本タイプ <span className="text-destructive">*</span>
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={() => setShowFieldHelp(showFieldHelp === 'bindingType' ? null : 'bindingType')}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          {showFieldHelp === 'bindingType' && (
            <div className="text-sm bg-muted p-2 rounded-md mb-2">
              {fieldHelp.bindingType}
              <Button 
                variant="link" 
                size="sm"
                className="p-0 h-auto text-xs ml-1"
                onClick={() => handleAskAI('製本タイプ')}
              >
                AIに質問する
              </Button>
            </div>
          )}
          <Select 
            value={specs.bindingType} 
            onValueChange={(value) => handleInputChange('bindingType', value)}
          >
            <SelectTrigger id="bindingType" className={cn(errors.bindingType && "border-destructive")}>
              <SelectValue placeholder="製本タイプを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staple">ステープル（ホチキス）</SelectItem>
              <SelectItem value="perfect">無線綴じ</SelectItem>
              <SelectItem value="hardcover">ハードカバー</SelectItem>
              <SelectItem value="spiral">スパイラル</SelectItem>
              <SelectItem value="saddle-stitch">中綴じ</SelectItem>
              <SelectItem value="case-bound">ケース製本</SelectItem>
            </SelectContent>
          </Select>
          {errors.bindingType && (
            <p className="text-sm text-destructive">{errors.bindingType}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pageCount" className={cn(errors.pageCount && "text-destructive")}>
            ページ数 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pageCount"
            type="number"
            value={specs.pageCount || ''}
            onChange={(e) => handleInputChange('pageCount', parseInt(e.target.value) || 0)}
            min={1}
            className={cn(errors.pageCount && "border-destructive")}
          />
          {errors.pageCount && (
            <p className="text-sm text-destructive">{errors.pageCount}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coverType">カバータイプ</Label>
          <Select 
            value={specs.coverType} 
            onValueChange={(value) => handleInputChange('coverType', value)}
          >
            <SelectTrigger id="coverType">
              <SelectValue placeholder="カバータイプを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="softcover">ソフトカバー</SelectItem>
              <SelectItem value="hardcover">ハードカバー</SelectItem>
              <SelectItem value="premium">プレミアム</SelectItem>
              <SelectItem value="none">なし</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paperType">用紙タイプ</Label>
          <Select 
            value={specs.paperType} 
            onValueChange={(value) => handleInputChange('paperType', value)}
          >
            <SelectTrigger id="paperType">
              <SelectValue placeholder="用紙タイプを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">普通紙</SelectItem>
              <SelectItem value="premium">上質紙</SelectItem>
              <SelectItem value="recycled">再生紙</SelectItem>
              <SelectItem value="matte">マット紙</SelectItem>
              <SelectItem value="textured">エンボス紙</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">部数</Label>
          <Input
            id="quantity"
            type="number"
            value={specs.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
            min={1}
          />
        </div>
      </>
    );
  };

  const renderLogisticsFields = () => {
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="weight" className={cn(errors.weight && "text-destructive")}>
            重量 (kg) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="weight"
            type="number"
            value={specs.weight || ''}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
            min={0.1}
            step={0.1}
            className={cn(errors.weight && "border-destructive")}
          />
          {errors.weight && (
            <p className="text-sm text-destructive">{errors.weight}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dimensions">寸法 (例: 30x20x10cm)</Label>
          <Input
            id="dimensions"
            value={specs.dimensions || ''}
            onChange={(e) => handleInputChange('dimensions', e.target.value)}
            placeholder="幅x高さx奥行き"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">数量</Label>
          <Input
            id="quantity"
            type="number"
            value={specs.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
            min={1}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deliverySpeed" className={cn(errors.deliverySpeed && "text-destructive")}>
            配送速度 <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={specs.deliverySpeed} 
            onValueChange={(value) => handleInputChange('deliverySpeed', value)}
          >
            <SelectTrigger id="deliverySpeed" className={cn(errors.deliverySpeed && "border-destructive")}>
              <SelectValue placeholder="配送速度を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">標準配送 (3-5営業日)</SelectItem>
              <SelectItem value="express">特急配送 (1-2営業日)</SelectItem>
              <SelectItem value="same-day">当日配送</SelectItem>
              <SelectItem value="international">国際配送</SelectItem>
            </SelectContent>
          </Select>
          {errors.deliverySpeed && (
            <p className="text-sm text-destructive">{errors.deliverySpeed}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deliveryAddress" className={cn(errors.deliveryAddress && "text-destructive")}>
            配送先住所 <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="deliveryAddress"
            value={specs.deliveryAddress || ''}
            onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
            placeholder="郵便番号、住所を入力"
            className={cn(errors.deliveryAddress && "border-destructive")}
          />
          {errors.deliveryAddress && (
            <p className="text-sm text-destructive">{errors.deliveryAddress}</p>
          )}
        </div>
      </>
    );
  };

  const renderEcoPrintingFields = () => {
    return (
      <>
        {renderPrintingFields()}
        
        <Separator />
        
        <div className="space-y-4 mt-4">
          <h3 className="font-medium">環境印刷オプション</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ecoMaterials">環境配慮素材</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 rounded-full" 
                onClick={() => setShowFieldHelp(showFieldHelp === 'ecoMaterials' ? null : 'ecoMaterials')}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
            {showFieldHelp === 'ecoMaterials' && (
              <div className="text-sm bg-muted p-2 rounded-md mb-2">
                {fieldHelp.ecoMaterials}
                <Button 
                  variant="link" 
                  size="sm"
                  className="p-0 h-auto text-xs ml-1"
                  onClick={() => handleAskAI('環境配慮素材')}
                >
                  AIに質問する
                </Button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="eco-recycled" 
                  checked={specs.ecoMaterials?.includes('recycled')}
                  onCheckedChange={() => {
                    const newMaterials = specs.ecoMaterials || [];
                    if (newMaterials.includes('recycled')) {
                      handleInputChange('ecoMaterials', newMaterials.filter(m => m !== 'recycled'));
                    } else {
                      handleInputChange('ecoMaterials', [...newMaterials, 'recycled']);
                    }
                  }}
                />
                <Label htmlFor="eco-recycled">再生紙</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="eco-fsc" 
                  checked={specs.ecoMaterials?.includes('fsc-certified')}
                  onCheckedChange={() => {
                    const newMaterials = specs.ecoMaterials || [];
                    if (newMaterials.includes('fsc-certified')) {
                      handleInputChange('ecoMaterials', newMaterials.filter(m => m !== 'fsc-certified'));
                    } else {
                      handleInputChange('ecoMaterials', [...newMaterials, 'fsc-certified']);
                    }
                  }}
                />
                <Label htmlFor="eco-fsc">FSC認証紙</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="eco-vegetable" 
                  checked={specs.ecoMaterials?.includes('vegetable-ink')}
                  onCheckedChange={() => {
                    const newMaterials = specs.ecoMaterials || [];
                    if (newMaterials.includes('vegetable-ink')) {
                      handleInputChange('ecoMaterials', newMaterials.filter(m => m !== 'vegetable-ink'));
                    } else {
                      handleInputChange('ecoMaterials', [...newMaterials, 'vegetable-ink']);
                    }
                  }}
                />
                <Label htmlFor="eco-vegetable">植物性インク</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="eco-bamboo" 
                  checked={specs.ecoMaterials?.includes('bamboo')}
                  onCheckedChange={() => {
                    const newMaterials = specs.ecoMaterials || [];
                    if (newMaterials.includes('bamboo')) {
                      handleInputChange('ecoMaterials', newMaterials.filter(m => m !== 'bamboo'));
                    } else {
                      handleInputChange('ecoMaterials', [...newMaterials, 'bamboo']);
                    }
                  }}
                />
                <Label htmlFor="eco-bamboo">竹パルプ</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="carbonOffset" 
                checked={specs.carbonOffset}
                onCheckedChange={(checked) => handleInputChange('carbonOffset', !!checked)}
              />
              <div>
                <Label htmlFor="carbonOffset">カーボンオフセット</Label>
                <p className="text-xs text-muted-foreground">印刷工程でのCO2排出量を相殺します</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="certifications">環境認証</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cert-fsc" 
                  checked={specs.certifications?.includes('fsc')}
                  onCheckedChange={() => {
                    const newCerts = specs.certifications || [];
                    if (newCerts.includes('fsc')) {
                      handleInputChange('certifications', newCerts.filter(c => c !== 'fsc'));
                    } else {
                      handleInputChange('certifications', [...newCerts, 'fsc']);
                    }
                  }}
                />
                <Label htmlFor="cert-fsc">FSC認証</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cert-pefc" 
                  checked={specs.certifications?.includes('pefc')}
                  onCheckedChange={() => {
                    const newCerts = specs.certifications || [];
                    if (newCerts.includes('pefc')) {
                      handleInputChange('certifications', newCerts.filter(c => c !== 'pefc'));
                    } else {
                      handleInputChange('certifications', [...newCerts, 'pefc']);
                    }
                  }}
                />
                <Label htmlFor="cert-pefc">PEFC認証</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cert-carbon" 
                  checked={specs.certifications?.includes('carbon-neutral')}
                  onCheckedChange={() => {
                    const newCerts = specs.certifications || [];
                    if (newCerts.includes('carbon-neutral')) {
                      handleInputChange('certifications', newCerts.filter(c => c !== 'carbon-neutral'));
                    } else {
                      handleInputChange('certifications', [...newCerts, 'carbon-neutral']);
                    }
                  }}
                />
                <Label htmlFor="cert-carbon">カーボンニュートラル</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cert-nordic" 
                  checked={specs.certifications?.includes('nordic-swan')}
                  onCheckedChange={() => {
                    const newCerts = specs.certifications || [];
                    if (newCerts.includes('nordic-swan')) {
                      handleInputChange('certifications', newCerts.filter(c => c !== 'nordic-swan'));
                    } else {
                      handleInputChange('certifications', [...newCerts, 'nordic-swan']);
                    }
                  }}
                />
                <Label htmlFor="cert-nordic">ノルディックスワン</Label>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderSdgsConsultingFields = () => {
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="companySize" className={cn(errors.companySize && "text-destructive")}>
            会社規模 <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={specs.companySize} 
            onValueChange={(value) => handleInputChange('companySize', value)}
          >
            <SelectTrigger id="companySize" className={cn(errors.companySize && "border-destructive")}>
              <SelectValue placeholder="会社規模を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">小規模 (1-50名)</SelectItem>
              <SelectItem value="medium">中規模 (51-300名)</SelectItem>
              <SelectItem value="large">大規模 (301-1000名)</SelectItem>
              <SelectItem value="enterprise">超大規模 (1000名以上)</SelectItem>
            </SelectContent>
          </Select>
          {errors.companySize && (
            <p className="text-sm text-destructive">{errors.companySize}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industryType" className={cn(errors.industryType && "text-destructive")}>
            業種 <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={specs.industryType} 
            onValueChange={(value) => handleInputChange('industryType', value)}
          >
            <SelectTrigger id="industryType" className={cn(errors.industryType && "border-destructive")}>
              <SelectValue placeholder="業種を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manufacturing">製造業</SelectItem>
              <SelectItem value="retail">小売業</SelectItem>
              <SelectItem value="service">サービス業</SelectItem>
              <SelectItem value="technology">IT・テクノロジー</SelectItem>
              <SelectItem value="finance">金融・保険</SelectItem>
              <SelectItem value="healthcare">医療・ヘルスケア</SelectItem>
              <SelectItem value="education">教育</SelectItem>
              <SelectItem value="other">その他</SelectItem>
            </SelectContent>
          </Select>
          {errors.industryType && (
            <p className="text-sm text-destructive">{errors.industryType}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentSdgsInitiatives">現在のSDGs取り組み (複数選択可)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sdgs-none" 
                checked={specs.currentSdgsInitiatives?.includes('none')}
                onCheckedChange={() => {
                  const newInitiatives = specs.currentSdgsInitiatives?.includes('none') ? [] : ['none'];
                  handleInputChange('currentSdgsInitiatives', newInitiatives);
                }}
              />
              <Label htmlFor="sdgs-none">まだ取り組んでいない</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sdgs-report" 
                checked={specs.currentSdgsInitiatives?.includes('reporting')}
                onCheckedChange={() => {
                  const newInitiatives = specs.currentSdgsInitiatives || [];
                  if (newInitiatives.includes('reporting')) {
                    handleInputChange('currentSdgsInitiatives', newInitiatives.filter(i => i !== 'reporting'));
                  } else {
                    handleInputChange('currentSdgsInitiatives', [...newInitiatives.filter(i => i !== 'none'), 'reporting']);
                  }
                }}
              />
              <Label htmlFor="sdgs-report">サステナビリティレポート</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sdgs-targets" 
                checked={specs.currentSdgsInitiatives?.includes('targets')}
                onCheckedChange={() => {
                  const newInitiatives = specs.currentSdgsInitiatives || [];
                  if (newInitiatives.includes('targets')) {
                    handleInputChange('currentSdgsInitiatives', newInitiatives.filter(i => i !== 'targets'));
                  } else {
                    handleInputChange('currentSdgsInitiatives', [...newInitiatives.filter(i => i !== 'none'), 'targets']);
                  }
                }}
              />
              <Label htmlFor="sdgs-targets">目標設定</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sdgs-projects" 
                checked={specs.currentSdgsInitiatives?.includes('projects')}
                onCheckedChange={() => {
                  const newInitiatives = specs.currentSdgsInitiatives || [];
                  if (newInitiatives.includes('projects')) {
                    handleInputChange('currentSdgsInitiatives', newInitiatives.filter(i => i !== 'projects'));
                  } else {
                    handleInputChange('currentSdgsInitiatives', [...newInitiatives.filter(i => i !== 'none'), 'projects']);
                  }
                }}
              />
              <Label htmlFor="sdgs-projects">プロジェクト実施</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="consultingScope" className={cn(errors.consultingScope && "text-destructive")}>
              コンサルティング範囲 <span className="text-destructive">*</span>
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={() => setShowFieldHelp(showFieldHelp === 'consultingScope' ? null : 'consultingScope')}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          {showFieldHelp === 'consultingScope' && (
            <div className="text-sm bg-muted p-2 rounded-md mb-2">
              {fieldHelp.consultingScope}
              <Button 
                variant="link" 
                size="sm"
                className="p-0 h-auto text-xs ml-1"
                onClick={() => handleAskAI('SDGsコンサルティング範囲')}
              >
                AIに質問する
              </Button>
            </div>
          )}
          <Select 
            value={specs.consultingScope} 
            onValueChange={(value) => handleInputChange('consultingScope', value)}
          >
            <SelectTrigger id="consultingScope" className={cn(errors.consultingScope && "border-destructive")}>
              <SelectValue placeholder="コンサルティング範囲を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="initial-assessment">初期評価・分析</SelectItem>
              <SelectItem value="strategy-development">戦略策定</SelectItem>
              <SelectItem value="implementation-support">実施サポート</SelectItem>
              <SelectItem value="reporting-communication">報告・コミュニケーション</SelectItem>
              <SelectItem value="comprehensive">包括的サポート（すべて含む）</SelectItem>
            </SelectContent>
          </Select>
          {errors.consultingScope && (
            <p className="text-sm text-destructive">{errors.consultingScope}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="targetGoals">注力したいSDGs目標 (複数選択可)</Label>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 17 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox 
                  id={`goal-${i+1}`} 
                  checked={specs.targetGoals?.includes(`goal-${i+1}`)}
                  onCheckedChange={() => {
                    const newGoals = specs.targetGoals || [];
                    if (newGoals.includes(`goal-${i+1}`)) {
                      handleInputChange('targetGoals', newGoals.filter(g => g !== `goal-${i+1}`));
                    } else {
                      handleInputChange('targetGoals', [...newGoals, `goal-${i+1}`]);
                    }
                  }}
                />
                <Label htmlFor={`goal-${i+1}`}>目標 {i+1}</Label>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderSustainabilityReportFields = () => {
    return (
      <>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="reportType" className={cn(errors.reportType && "text-destructive")}>
              レポートタイプ <span className="text-destructive">*</span>
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full" 
              onClick={() => setShowFieldHelp(showFieldHelp === 'reportType' ? null : 'reportType')}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          {showFieldHelp === 'reportType' && (
            <div className="text-sm bg-muted p-2 rounded-md mb-2">
              {fieldHelp.reportType}
              <Button 
                variant="link" 
                size="sm"
                className="p-0 h-auto text-xs ml-1"
                onClick={() => handleAskAI('サステナビリティレポートタイプ')}
              >
                AIに質問する
              </Button>
            </div>
          )}
          <Select 
            value={specs.reportType} 
            onValueChange={(value) => handleInputChange('reportType', value)}
          >
            <SelectTrigger id="reportType" className={cn(errors.reportType && "border-destructive")}>
              <SelectValue placeholder="レポートタイプを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">基本レポート</SelectItem>
              <SelectItem value="standard">標準レポート (GRIガイドライン準拠)</SelectItem>
              <SelectItem value="advanced">高度レポート (GRI/SASB/TCFD対応)</SelectItem>
              <SelectItem value="integrated">統合報告書</SelectItem>
              <SelectItem value="custom">カスタムレポート</SelectItem>
            </SelectContent>
          </Select>
          {errors.reportType && (
            <p className="text-sm text-destructive">{errors.reportType}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reportLength" className={cn(errors.reportLength && "text-destructive")}>
            ページ数（概算） <span className="text-destructive">*</span>
          </Label>
          <Input
            id="reportLength"
            type="number"
            value={specs.reportLength || ''}
            onChange={(e) => handleInputChange('reportLength', parseInt(e.target.value) || 0)}
            min={1}
            className={cn(errors.reportLength && "border-destructive")}
          />
          {errors.reportLength && (
            <p className="text-sm text-destructive">{errors.reportLength}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="includedData">含める情報 (複数選択可)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="data-environment" 
                checked={specs.includedData?.includes('environment')}
                onCheckedChange={() => {
                  const newData = specs.includedData || [];
                  if (newData.includes('environment')) {
                    handleInputChange('includedData', newData.filter(d => d !== 'environment'));
                  } else {
                    handleInputChange('includedData', [...newData, 'environment']);
                  }
                }}
              />
              <Label htmlFor="data-environment">環境データ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="data-social" 
                checked={specs.includedData?.includes('social')}
                onCheckedChange={() => {
                  const newData = specs.includedData || [];
                  if (newData.includes('social')) {
                    handleInputChange('includedData', newData.filter(d => d !== 'social'));
                  } else {
                    handleInputChange('includedData', [...newData, 'social']);
                  }
                }}
              />
              <Label htmlFor="data-social">社会データ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="data-governance" 
                checked={specs.includedData?.includes('governance')}
                onCheckedChange={() => {
                  const newData = specs.includedData || [];
                  if (newData.includes('governance')) {
                    handleInputChange('includedData', newData.filter(d => d !== 'governance'));
                  } else {
                    handleInputChange('includedData', [...newData, 'governance']);
                  }
                }}
              />
              <Label htmlFor="data-governance">ガバナンスデータ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="data-sdgs" 
                checked={specs.includedData?.includes('sdgs')}
                onCheckedChange={() => {
                  const newData = specs.includedData || [];
                  if (newData.includes('sdgs')) {
                    handleInputChange('includedData', newData.filter(d => d !== 'sdgs'));
                  } else {
                    handleInputChange('includedData', [...newData, 'sdgs']);
                  }
                }}
              />
              <Label htmlFor="data-sdgs">SDGs活動</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="data-cases" 
                checked={specs.includedData?.includes('case-studies')}
                onCheckedChange={() => {
                  const newData = specs.includedData || [];
                  if (newData.includes('case-studies')) {
                    handleInputChange('includedData', newData.filter(d => d !== 'case-studies'));
                  } else {
                    handleInputChange('includedData', [...newData, 'case-studies']);
                  }
                }}
              />
              <Label htmlFor="data-cases">ケーススタディ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="data-financial" 
                checked={specs.includedData?.includes('financial')}
                onCheckedChange={() => {
                  const newData = specs.includedData || [];
                  if (newData.includes('financial')) {
                    handleInputChange('includedData', newData.filter(d => d !== 'financial'));
                  } else {
                    handleInputChange('includedData', [...newData, 'financial']);
                  }
                }}
              />
              <Label htmlFor="data-financial">財務情報</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="designComplexity" className={cn(errors.designComplexity && "text-destructive")}>
            デザインの複雑さ <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={specs.designComplexity} 
            onValueChange={(value) => handleInputChange('designComplexity', value)}
          >
            <SelectTrigger id="designComplexity" className={cn(errors.designComplexity && "border-destructive")}>
              <SelectValue placeholder="デザインの複雑さを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">シンプル（テキスト中心）</SelectItem>
              <SelectItem value="standard">標準（グラフ・図表を含む）</SelectItem>
              <SelectItem value="complex">複雑（カスタムグラフィック・高度な視覚表現）</SelectItem>
              <SelectItem value="premium">プレミアム（完全オリジナルデザイン・ブランディング）</SelectItem>
            </SelectContent>
          </Select>
          {errors.designComplexity && (
            <p className="text-sm text-destructive">{errors.designComplexity}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="previousReports" 
              checked={specs.previousReports}
              onCheckedChange={(checked) => handleInputChange('previousReports', !!checked)}
            />
            <Label htmlFor="previousReports">過去のレポートあり</Label>
          </div>
        </div>
      </>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg animate-fade-in transition-all duration-300 hover:shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">
          {serviceType === 'printing' && '印刷仕様入力'}
          {serviceType === 'binding' && '製本仕様入力'}
          {serviceType === 'logistics' && '物流仕様入力'}
          {serviceType === 'eco-printing' && '環境印刷仕様入力'}
          {serviceType === 'sdgs-consulting' && 'SDGsコンサルティング仕様入力'}
          {serviceType === 'sustainability-report' && 'サステナビリティレポート仕様入力'}
        </CardTitle>
        <CardDescription className="text-center">お見積りに必要な情報を入力してください</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {renderServiceTypeFields()}
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="file-upload" className="text-center block">参考ファイル（オプション）</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                ファイルをアップロード
              </Button>
              <p className="text-xs text-muted-foreground">
                ドキュメント、デザイン、参考資料など
              </p>
            </div>
            
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url} 
                      alt={`アップロードファイル ${index + 1}`} 
                      className="w-full h-20 object-cover rounded-md border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {uploadedFiles.length > 0 && (
              <ul className="text-sm mt-2 space-y-1">
                {uploadedFiles.map((file, index) => !file.type.startsWith('image/') && (
                  <li key={index} className="flex items-center justify-between">
                    <span className="truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      &times;
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customSpecs" className="text-center block">特記事項 (オプション)</Label>
            <Textarea
              id="customSpecs"
              placeholder="その他の条件や特記事項があればご記入ください"
              value={specs.customSpecs}
              onChange={(e) => handleInputChange('customSpecs', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliveryDate" className="text-center block">希望納期 (オプション)</Label>
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
