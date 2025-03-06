
import { formatPrice, getDiscountAmount } from '@/utils/quoteFormatters';

interface PriceSummaryProps {
  price: number;
  discountApplied?: number;
}

const PriceSummary = ({ price, discountApplied }: PriceSummaryProps) => {
  const discountInfo = getDiscountAmount(price, discountApplied);

  return (
    <div className="rounded-md border border-gray-100 bg-gray-50/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">小計</span>
        <span className="text-sm">
          {discountInfo 
            ? formatPrice(Math.round(price / (1 - (discountApplied || 0))))
            : formatPrice(price)
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
        <span className="text-sm font-bold">{formatPrice(price)}</span>
      </div>
      
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm font-medium">消費税 (10%)</span>
        <span className="text-sm">{formatPrice(Math.round(price * 0.1))}</span>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
        <span className="font-medium">合計 (税込)</span>
        <span className="font-bold">{formatPrice(Math.round(price * 1.1))}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
