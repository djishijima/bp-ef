
import { useState, useEffect } from 'react';
import { ServiceType, PrintSpecs } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { calculateQuote } from '@/utils/printCalculator';
import ServiceSelector from './ServiceSelector';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Checkbox
} from '@/components/ui/checkbox';
import { ArrowRight, Calendar, FileText, Printer } from 'lucide-react';

interface ServiceFormProps {
  onQuoteGenerated: (quote: any) => void;
  initialServiceType?: ServiceType;
}

const ServiceForm = ({ onQuoteGenerated, initialServiceType = 'printing' }: ServiceFormProps) => {
  const [serviceType, setServiceType] = useState<ServiceType>(initialServiceType);
  
  // サービスタイプ別のデフォルト値を設定
  const getDefaultSpecs = (type: ServiceType): PrintSpecs => {
    const baseSpecs = {
      serviceType: type,
      productType: '',
      size: '',
      quantity: 100,
      paperType: 'standard',
      printColors: 'black-and-white',
      finishing: ['none'],
      customSpecs: '',
    };
    
    switch (type) {
      case 'printing':
        return {
          ...baseSpecs,
          productType: 'flyer',
          size: 'A4',
        };
      case 'binding':
        return {
          ...baseSpecs,
          productType: 'softcover-book',
          bindingType: 'perfect',
          pageCount: 50,
          coverType: 'standard',
        };
      case 'logistics':
        return {
          ...baseSpecs,
          productType: 'other',
          weight: 5,
          dimensions: '30x20x10',
          deliverySpeed: 'standard',
          deliveryAddress: '',
        };
      case 'eco-printing':
        return {
          ...baseSpecs,
          productType: 'flyer',
          size: 'A4',
          paperType: 'recycled',
          ecoMaterials: ['recycled-paper'],
          carbonOffset: false,
          certifications: [],
        };
      default:
        return baseSpecs;
    }
  };
  
  const [specs, setSpecs] = useState<PrintSpecs>(getDefaultSpecs(serviceType));
  
  // サービスタイプが変更されたら対応するデフォルト値を設定
  useEffect(() => {
    setSpecs(getDefaultSpecs(serviceType));
  }, [serviceType]);
  
  // 入力値の変更を処理
  const handleInputChange = (field: keyof PrintSpecs, value: any) => {
    setSpecs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // 数値入力の変更を処理
  const handleNumberChange = (field: keyof PrintSpecs, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue)) {
      handleInputChange(field, numValue);
    }
  };
  
  // 仕上げオプションの選択を処理
  const handleFinishingChange = (option: string, checked: boolean) => {
    setSpecs((prev) => {
      const newFinishing = checked
        ? [...prev.finishing.filter(item => item !== 'none'), option]
        : prev.finishing.filter(item => item !== option);
      
      // 何も選択されていない場合は「なし」を選択
      if (newFinishing.length === 0) {
        return { ...prev, finishing: ['none'] };
      }
      
      // 「なし」以外が選択されている場合は「なし」を除外
      return { ...prev, finishing: newFinishing.filter(item => item !== 'none') };
    });
  };
  
  // 環境印刷の素材選択を処理
  const handleEcoMaterialChange = (material: string, checked: boolean) => {
    setSpecs((prev) => {
      if (!prev.ecoMaterials) return { ...prev, ecoMaterials: [material] };
      
      const newMaterials = checked
        ? [...prev.ecoMaterials, material]
        : prev.ecoMaterials.filter(item => item !== material);
      
      return { ...prev, ecoMaterials: newMaterials };
    });
  };
  
  // 環境認証の選択を処理
  const handleCertificationChange = (cert: string, checked: boolean) => {
    setSpecs((prev) => {
      if (!prev.certifications) return { ...prev, certifications: [cert] };
      
      const newCerts = checked
        ? [...prev.certifications, cert]
        : prev.certifications.filter(item => item !== cert);
      
      return { ...prev, certifications: newCerts };
    });
  };
  
  // 見積もりを生成
  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const quote = calculateQuote(specs);
    onQuoteGenerated(quote);
  };
  
  // 印刷サービスの商品タイプオプション
  const printingProductTypes = [
    { value: 'business-card', label: '名刺' },
    { value: 'flyer', label: 'チラシ' },
    { value: 'brochure', label: 'パンフレット' },
    { value: 'poster', label: 'ポスター' },
    { value: 'booklet', label: '冊子' },
    { value: 'postcard', label: 'ポストカード' },
    { value: 'stationery', label: '文具' },
    { value: 'other', label: 'その他' },
  ];
  
  // 製本サービスの商品タイプオプション
  const bindingProductTypes = [
    { value: 'softcover-book', label: 'ソフトカバー書籍' },
    { value: 'hardcover-book', label: 'ハードカバー書籍' },
    { value: 'spiral-bound', label: 'スパイラル製本' },
    { value: 'perfect-bound', label: '無線綴じ冊子' },
    { value: 'other', label: 'その他' },
  ];
  
  // 製本タイプオプション
  const bindingTypes = [
    { value: 'staple', label: 'ステープル（ホチキス）綴じ' },
    { value: 'perfect', label: '無線綴じ' },
    { value: 'hardcover', label: 'ハードカバー' },
    { value: 'spiral', label: 'スパイラル（リング）綴じ' },
    { value: 'saddle-stitch', label: '中綴じ' },
    { value: 'case-bound', label: 'ケース製本' },
  ];
  
  // カバータイプオプション
  const coverTypes = [
    { value: 'standard', label: '標準' },
    { value: 'premium', label: 'プレミアム' },
    { value: 'hardcover', label: 'ハードカバー' },
    { value: 'softcover', label: 'ソフトカバー' },
    { value: 'leather', label: 'レザー' },
    { value: 'other', label: 'その他' },
  ];
  
  // 配送速度オプション
  const deliverySpeeds = [
    { value: 'standard', label: '標準配送（3-5営業日）' },
    { value: 'express', label: '特急配送（1-2営業日）' },
    { value: 'same-day', label: '当日配送（地域限定）' },
    { value: 'international', label: '国際配送' },
  ];
  
  // サイズオプション
  const sizeOptions = [
    { value: 'A4', label: 'A4 (210×297mm)' },
    { value: 'A5', label: 'A5 (148×210mm)' },
    { value: 'A6', label: 'A6 (105×148mm)' },
    { value: 'B4', label: 'B4 (257×364mm)' },
    { value: 'B5', label: 'B5 (182×257mm)' },
    { value: 'postcard', label: 'ポストカード (100×148mm)' },
    { value: 'business-card', label: '名刺 (91×55mm)' },
    { value: 'custom', label: 'カスタムサイズ' },
  ];
  
  // 用紙タイプオプション
  const paperTypes = [
    { value: 'standard', label: '標準' },
    { value: 'premium', label: 'プレミアム' },
    { value: 'recycled', label: '再生紙' },
    { value: 'glossy', label: '光沢紙' },
    { value: 'matte', label: 'マット紙' },
    { value: 'textured', label: '凹凸紙' },
    { value: 'eco-friendly', label: 'エコフレンドリー' },
    { value: 'fsc-certified', label: 'FSC認証紙' },
  ];
  
  // 印刷色オプション
  const colorOptions = [
    { value: 'black-and-white', label: 'モノクロ' },
    { value: 'full-color-one-side', label: 'カラー（片面）' },
    { value: 'full-color-both-sides', label: 'カラー（両面）' },
    { value: 'spot-color', label: 'スポットカラー' },
    { value: 'pantone', label: 'パントン' },
    { value: 'vegetable-ink', label: '植物性インク' },
  ];
  
  // 仕上げオプション
  const finishingOptions = [
    { value: 'none', label: 'なし' },
    { value: 'folding', label: '折り' },
    { value: 'binding', label: '製本' },
    { value: 'lamination', label: 'ラミネート' },
    { value: 'die-cutting', label: '抜き加工' },
    { value: 'embossing', label: 'エンボス加工' },
    { value: 'foil-stamping', label: '箔押し' },
    { value: 'uv-coating', label: 'UVコーティング' },
    { value: 'eco-varnish', label: 'エコニス加工' },
  ];
  
  // 環境素材オプション
  const ecoMaterialOptions = [
    { value: 'recycled-paper', label: '再生紙' },
    { value: 'fsc-certified', label: 'FSC認証紙' },
    { value: 'non-wood-paper', label: '非木材紙（竹、サトウキビなど）' },
    { value: 'cotton-paper', label: 'コットンペーパー' },
    { value: 'stone-paper', label: 'ストーンペーパー' },
  ];
  
  // 環境認証オプション
  const certificationOptions = [
    { value: 'fsc', label: 'FSC認証' },
    { value: 'pefc', label: 'PEFC認証' },
    { value: 'carbon-neutral', label: 'カーボンニュートラル' },
    { value: 'rainforest-alliance', label: 'レインフォレスト・アライアンス' },
    { value: 'nordic-swan', label: 'ノルディックスワン' },
  ];

  return (
    <Card className="w-full max-w-xl shadow-md">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          見積もりフォーム
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleGenerateQuote}>
        <CardContent className="pt-6">
          <ServiceSelector 
            selectedService={serviceType} 
            onServiceChange={(service) => setServiceType(service)} 
          />
          
          <div className="space-y-6">
            {/* 印刷サービス固有のフィールド */}
            {serviceType === 'printing' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productType">印刷物タイプ</Label>
                    <Select 
                      value={specs.productType}
                      onValueChange={(value) => handleInputChange('productType', value)}
                    >
                      <SelectTrigger id="productType">
                        <SelectValue placeholder="タイプを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {printingProductTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="size">サイズ</Label>
                    <Select 
                      value={specs.size}
                      onValueChange={(value) => handleInputChange('size', value)}
                    >
                      <SelectTrigger id="size">
                        <SelectValue placeholder="サイズを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizeOptions.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
            
            {/* 製本サービス固有のフィールド */}
            {serviceType === 'binding' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productType">製本タイプ</Label>
                    <Select 
                      value={specs.productType}
                      onValueChange={(value) => handleInputChange('productType', value)}
                    >
                      <SelectTrigger id="productType">
                        <SelectValue placeholder="タイプを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {bindingProductTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bindingType">綴じ方</Label>
                    <Select 
                      value={specs.bindingType || 'perfect'}
                      onValueChange={(value) => handleInputChange('bindingType', value)}
                    >
                      <SelectTrigger id="bindingType">
                        <SelectValue placeholder="綴じ方を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {bindingTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pageCount">ページ数</Label>
                    <Input 
                      id="pageCount"
                      type="number"
                      value={specs.pageCount || 0}
                      onChange={(e) => handleNumberChange('pageCount', e.target.value)}
                      placeholder="ページ数を入力"
                      min={1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coverType">表紙タイプ</Label>
                    <Select 
                      value={specs.coverType || 'standard'}
                      onValueChange={(value) => handleInputChange('coverType', value)}
                    >
                      <SelectTrigger id="coverType">
                        <SelectValue placeholder="表紙タイプを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {coverTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
            
            {/* 物流サービス固有のフィールド */}
            {serviceType === 'logistics' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">重量 (kg)</Label>
                    <Input 
                      id="weight"
                      type="number"
                      value={specs.weight || 0}
                      onChange={(e) => handleNumberChange('weight', e.target.value)}
                      placeholder="重量を入力"
                      min={0.1}
                      step={0.1}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">寸法 (cmxcmxcm)</Label>
                    <Input 
                      id="dimensions"
                      type="text"
                      value={specs.dimensions || ''}
                      onChange={(e) => handleInputChange('dimensions', e.target.value)}
                      placeholder="例: 30x20x10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliverySpeed">配送速度</Label>
                  <Select 
                    value={specs.deliverySpeed || 'standard'}
                    onValueChange={(value) => handleInputChange('deliverySpeed', value)}
                  >
                    <SelectTrigger id="deliverySpeed">
                      <SelectValue placeholder="配送速度を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliverySpeeds.map((speed) => (
                        <SelectItem key={speed.value} value={speed.value}>
                          {speed.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">配送先住所</Label>
                  <Textarea 
                    id="deliveryAddress"
                    value={specs.deliveryAddress || ''}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    placeholder="配送先の住所を入力"
                    rows={2}
                  />
                </div>
              </>
            )}
            
            {/* 環境印刷サービス固有のフィールド */}
            {serviceType === 'eco-printing' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productType">印刷物タイプ</Label>
                    <Select 
                      value={specs.productType}
                      onValueChange={(value) => handleInputChange('productType', value)}
                    >
                      <SelectTrigger id="productType">
                        <SelectValue placeholder="タイプを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {printingProductTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="size">サイズ</Label>
                    <Select 
                      value={specs.size}
                      onValueChange={(value) => handleInputChange('size', value)}
                    >
                      <SelectTrigger id="size">
                        <SelectValue placeholder="サイズを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizeOptions.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="mb-2 block">環境素材 (複数選択可)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ecoMaterialOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`eco-material-${option.value}`}
                          checked={specs.ecoMaterials?.includes(option.value) || false}
                          onCheckedChange={(checked) => 
                            handleEcoMaterialChange(option.value, checked === true)
                          }
                        />
                        <Label 
                          htmlFor={`eco-material-${option.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="carbonOffset"
                    checked={specs.carbonOffset || false}
                    onCheckedChange={(checked) => 
                      handleInputChange('carbonOffset', checked === true)
                    }
                  />
                  <Label 
                    htmlFor="carbonOffset"
                    className="font-normal cursor-pointer"
                  >
                    カーボンオフセットを適用する
                  </Label>
                </div>
                
                <div className="space-y-2">
                  <Label className="mb-2 block">環境認証 (複数選択可)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {certificationOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`certification-${option.value}`}
                          checked={specs.certifications?.includes(option.value) || false}
                          onCheckedChange={(checked) => 
                            handleCertificationChange(option.value, checked === true)
                          }
                        />
                        <Label 
                          htmlFor={`certification-${option.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {/* 共通フィールド */}
            <div className="space-y-2">
              <Label htmlFor="quantity">数量</Label>
              <Input 
                id="quantity"
                type="number"
                value={specs.quantity}
                onChange={(e) => handleNumberChange('quantity', e.target.value)}
                placeholder="数量を入力"
                min={1}
              />
            </div>
            
            {(serviceType === 'printing' || serviceType === 'eco-printing') && (
              <>
                <div className="grid grid-cols-2 gap-4">
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
                        {paperTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="printColors">印刷色</Label>
                    <Select 
                      value={specs.printColors}
                      onValueChange={(value) => handleInputChange('printColors', value)}
                    >
                      <SelectTrigger id="printColors">
                        <SelectValue placeholder="印刷色を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="mb-2 block">仕上げオプション (複数選択可)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {finishingOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`finishing-${option.value}`}
                          checked={specs.finishing.includes(option.value)}
                          onCheckedChange={(checked) => 
                            handleFinishingChange(option.value, checked === true)
                          }
                        />
                        <Label 
                          htmlFor={`finishing-${option.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="customSpecs">追加仕様・要望</Label>
              <Textarea 
                id="customSpecs"
                value={specs.customSpecs || ''}
                onChange={(e) => handleInputChange('customSpecs', e.target.value)}
                placeholder="追加の仕様や特別な要望があればご記入ください"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex justify-between">
          <Button type="button" variant="outline">
            リセット
          </Button>
          <Button type="submit" className="gap-2">
            見積もりを計算 <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ServiceForm;
