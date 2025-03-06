
import { 
  Book, 
  Copy, 
  FileType, 
  Layers, 
  Palette, 
  RotateCw, 
  Scissors, 
  Sparkles, 
  Stamp 
} from 'lucide-react';
import { PrintSpecs } from '@/types';
import { 
  getProductTypeName, 
  getSizeName, 
  getPaperTypeName, 
  getPrintColorName, 
  getFinishingName 
} from '@/utils/quoteFormatters';

interface ProductSpecsProps {
  specs: PrintSpecs;
  turnaround: number;
}

const ProductSpecs = ({ specs, turnaround }: ProductSpecsProps) => {
  // Get icon for product type
  const getProductTypeIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'business-card': <FileType className="h-4 w-4 mr-2 text-primary" />,
      'flyer': <Copy className="h-4 w-4 mr-2 text-primary" />,
      'brochure': <Book className="h-4 w-4 mr-2 text-primary" />,
      'poster': <Layers className="h-4 w-4 mr-2 text-primary" />,
      'booklet': <Book className="h-4 w-4 mr-2 text-primary" />,
      'postcard': <FileType className="h-4 w-4 mr-2 text-primary" />,
      'stationery': <FileType className="h-4 w-4 mr-2 text-primary" />,
      'other': <FileType className="h-4 w-4 mr-2 text-primary" />,
    };
    return iconMap[type] || <FileType className="h-4 w-4 mr-2 text-primary" />;
  };

  // Get icon for print color
  const getPrintColorIcon = (color: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'black-and-white': <Palette className="h-4 w-4 mr-2 text-gray-800" />,
      'full-color-one-side': <Palette className="h-4 w-4 mr-2 text-blue-500" />,
      'full-color-both-sides': <Palette className="h-4 w-4 mr-2 text-indigo-500" />,
      'spot-color': <Palette className="h-4 w-4 mr-2 text-purple-500" />,
    };
    return iconMap[color] || <Palette className="h-4 w-4 mr-2 text-primary" />;
  };

  // Get icon for finishing type
  const getFinishingIcon = (finishing: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'none': null,
      'folding': <RotateCw className="h-4 w-4 mr-1 text-amber-500" />,
      'binding': <Book className="h-4 w-4 mr-1 text-amber-600" />,
      'lamination': <Layers className="h-4 w-4 mr-1 text-blue-500" />,
      'die-cutting': <Scissors className="h-4 w-4 mr-1 text-red-500" />,
      'embossing': <Stamp className="h-4 w-4 mr-1 text-green-600" />,
      'foil-stamping': <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />,
      'uv-coating': <Sparkles className="h-4 w-4 mr-1 text-purple-500" />,
    };
    return iconMap[finishing];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">商品タイプ</h4>
          <p className="text-sm font-medium flex items-center">
            {getProductTypeIcon(specs.productType)}
            {getProductTypeName(specs.productType)}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">サイズ</h4>
          <p className="text-sm font-medium">{getSizeName(specs.size)}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">数量</h4>
          <p className="text-sm font-medium flex items-center">
            <Copy className="h-4 w-4 mr-2 text-blue-500" />
            {specs.quantity}部
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">用紙タイプ</h4>
          <p className="text-sm font-medium flex items-center">
            <Layers className="h-4 w-4 mr-2 text-gray-500" />
            {getPaperTypeName(specs.paperType)}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">印刷色</h4>
          <p className="text-sm font-medium flex items-center">
            {getPrintColorIcon(specs.printColors)}
            {getPrintColorName(specs.printColors)}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">納期</h4>
          <p className="text-sm font-medium">約{turnaround}営業日</p>
        </div>
      </div>
      
      {specs.finishing.length > 0 && specs.finishing[0] !== 'none' && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">仕上げ</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {specs.finishing.map((finish) => (
              <div 
                key={finish}
                className="px-2 py-1 bg-secondary text-xs rounded-md flex items-center"
              >
                {getFinishingIcon(finish)}
                {getFinishingName(finish)}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {specs.customSpecs && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">特記事項</h4>
          <p className="text-sm font-medium">{specs.customSpecs}</p>
        </div>
      )}
    </div>
  );
};

export default ProductSpecs;
