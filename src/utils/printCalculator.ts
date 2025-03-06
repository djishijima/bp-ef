
import { PrintSpecs, QuoteDetails, ServiceType } from '@/types';

// Base prices for different product types
const baseProductPrices: Record<string, number> = {
  // 印刷商品
  'business-card': 2000,
  'flyer': 5000,
  'brochure': 10000,
  'poster': 8000,
  'booklet': 15000,
  'postcard': 3000,
  'stationery': 4000,
  // 製本商品
  'softcover-book': 12000,
  'hardcover-book': 20000,
  'spiral-bound': 8000,
  'perfect-bound': 15000,
  // その他
  'other': 10000,
};

// Paper type price multipliers
const paperMultipliers: Record<string, number> = {
  'standard': 1.0,
  'premium': 1.5,
  'recycled': 1.2,
  'glossy': 1.3,
  'matte': 1.2,
  'textured': 1.6,
  'eco-friendly': 1.4,
  'fsc-certified': 1.5,
};

// Print color price modifiers
const colorPriceModifiers: Record<string, number> = {
  'black-and-white': 0,
  'full-color-one-side': 3000,
  'full-color-both-sides': 5000,
  'spot-color': 2000,
  'pantone': 4000,
  'vegetable-ink': 3500,
};

// Finishing price additions
const finishingPrices: Record<string, number> = {
  'none': 0,
  'folding': 1000,
  'binding': 3000,
  'lamination': 2000,
  'die-cutting': 5000,
  'embossing': 4000,
  'foil-stamping': 3500,
  'uv-coating': 2500,
  'eco-varnish': 3000,
};

// Binding type prices
const bindingPrices: Record<string, number> = {
  'staple': 1000,
  'perfect': 3000,
  'hardcover': 10000,
  'spiral': 2000,
  'saddle-stitch': 1500,
  'case-bound': 12000,
};

// Logistics price modifiers
const logisticsModifiers: Record<string, number> = {
  'standard': 1.0,
  'express': 1.8,
  'same-day': 2.5,
  'international': 3.0,
  'fragile': 1.3,
  'carbon-neutral': 1.2,
};

// Eco-printing certifications prices
const certificationPrices: Record<string, number> = {
  'fsc': 2000,
  'pefc': 2000,
  'carbon-neutral': 5000,
  'rainforest-alliance': 3000,
  'nordic-swan': 2500,
};

// Quantity discount thresholds
const quantityDiscounts: [number, number][] = [
  [100, 0],
  [250, 0.05],
  [500, 0.1],
  [1000, 0.15],
  [2500, 0.2],
  [5000, 0.25],
];

// Calculate estimated turnaround time in days
const calculateTurnaround = (specs: PrintSpecs): number => {
  let baseDays = 5;
  
  // サービスタイプに基づいて基本日数を設定
  switch (specs.serviceType) {
    case 'printing':
      // 印刷商品の複雑さに基づいて日数を追加
      switch (specs.productType) {
        case 'business-card':
          baseDays = 3;
          break;
        case 'booklet':
          baseDays = 10;
          break;
        default:
          baseDays = 5;
          break;
      }
      break;
    case 'binding':
      // 製本タイプに基づいて日数を追加
      baseDays = 7;
      if (specs.bindingType === 'hardcover' || specs.bindingType === 'case-bound') {
        baseDays += 5;
      }
      if (specs.pageCount && specs.pageCount > 200) {
        baseDays += 3;
      }
      break;
    case 'logistics':
      // 配送速度に基づいて日数を設定
      if (specs.deliverySpeed === 'express') {
        baseDays = 2;
      } else if (specs.deliverySpeed === 'same-day') {
        baseDays = 1;
      } else if (specs.deliverySpeed === 'international') {
        baseDays = 14;
      } else {
        baseDays = 5;
      }
      break;
    case 'eco-printing':
      // 環境印刷は通常より時間がかかる
      baseDays = 7;
      if (specs.certifications && specs.certifications.length > 0) {
        baseDays += 2;
      }
      break;
    default:
      baseDays = 5;
  }
  
  // 仕上げオプションに基づいて日数を追加
  if (specs.finishing.includes('die-cutting') || specs.finishing.includes('embossing')) {
    baseDays += 3;
  } else if (specs.finishing.length > 0 && !specs.finishing.includes('none')) {
    baseDays += 1;
  }
  
  // 数量の多さに基づいて日数を追加
  if (specs.quantity > 1000) {
    baseDays += 2;
  }
  
  return baseDays;
};

// Get discount percentage based on quantity
const getQuantityDiscount = (quantity: number): number => {
  let discountRate = 0;
  
  for (const [threshold, rate] of quantityDiscounts) {
    if (quantity >= threshold) {
      discountRate = rate;
    } else {
      break;
    }
  }
  
  return discountRate;
};

export const calculateQuote = (specs: PrintSpecs): QuoteDetails => {
  // サービスタイプごとに異なる価格計算を行う
  let price = 0;
  
  switch (specs.serviceType) {
    case 'printing':
      price = calculatePrintingPrice(specs);
      break;
    case 'binding':
      price = calculateBindingPrice(specs);
      break;
    case 'logistics':
      price = calculateLogisticsPrice(specs);
      break;
    case 'eco-printing':
      price = calculateEcoPrintingPrice(specs);
      break;
    default:
      price = calculatePrintingPrice(specs);
  }
  
  // 数量割引を適用
  const discountRate = getQuantityDiscount(specs.quantity);
  const discountAmount = price * discountRate;
  price = price - discountAmount;
  
  // 納期を計算
  const turnaround = calculateTurnaround(specs);
  
  // 価格を100円単位に丸める
  price = Math.ceil(price / 100) * 100;
  
  return {
    id: `Q-${Date.now().toString(36)}`,
    specs,
    price,
    turnaround,
    discountApplied: discountRate > 0 ? discountRate : undefined,
  };
};

// 印刷サービスの価格計算
const calculatePrintingPrice = (specs: PrintSpecs): number => {
  // 基本価格
  let basePrice = baseProductPrices[specs.productType] || baseProductPrices.other;
  
  // 用紙タイプの乗数を適用
  const paperMultiplier = paperMultipliers[specs.paperType] || paperMultipliers.standard;
  let price = basePrice * paperMultiplier;
  
  // 印刷色のコストを追加
  price += colorPriceModifiers[specs.printColors] || 0;
  
  // 仕上げコストを追加
  let finishingCost = 0;
  specs.finishing.forEach(finish => {
    finishingCost += finishingPrices[finish] || 0;
  });
  price += finishingCost;
  
  // 数量に基づくスケーリング（基本的な線形スケーリング、最小数量50）
  const effectiveQuantity = Math.max(50, specs.quantity);
  price = price * (effectiveQuantity / 100);
  
  return price;
};

// 製本サービスの価格計算
const calculateBindingPrice = (specs: PrintSpecs): number => {
  // 基本価格（製本タイプに基づく）
  let price = bindingPrices[specs.bindingType || 'staple'] || bindingPrices.staple;
  
  // ページ数による追加料金
  if (specs.pageCount) {
    // 50ページごとに基本価格の10%を追加
    price += price * (Math.floor(specs.pageCount / 50) * 0.1);
  }
  
  // カバータイプによる追加料金
  if (specs.coverType === 'hardcover') {
    price += 5000;
  } else if (specs.coverType === 'premium') {
    price += 3000;
  }
  
  // 仕上げオプションの追加
  specs.finishing.forEach(finish => {
    price += finishingPrices[finish] || 0;
  });
  
  // 数量に基づくスケーリング
  const effectiveQuantity = Math.max(10, specs.quantity);
  price = price * (effectiveQuantity / 10);
  
  return price;
};

// 物流サービスの価格計算
const calculateLogisticsPrice = (specs: PrintSpecs): number => {
  // 基本配送価格
  let basePrice = 5000;
  
  // 重量による追加料金
  if (specs.weight) {
    basePrice += specs.weight * 100; // 1kgあたり100円
  }
  
  // 配送速度による乗数
  const speedMultiplier = logisticsModifiers[specs.deliverySpeed || 'standard'] || logisticsModifiers.standard;
  let price = basePrice * speedMultiplier;
  
  // 数量による追加料金（配送個数）
  price = price * Math.max(1, Math.ceil(specs.quantity / 100));
  
  return price;
};

// 環境印刷サービスの価格計算
const calculateEcoPrintingPrice = (specs: PrintSpecs): number => {
  // 基本的な印刷価格を計算
  let price = calculatePrintingPrice(specs);
  
  // エコ素材による追加料金
  if (specs.ecoMaterials && specs.ecoMaterials.length > 0) {
    price *= 1.2; // エコ素材は20%増し
  }
  
  // カーボンオフセットによる追加料金
  if (specs.carbonOffset) {
    price += 3000;
  }
  
  // 認証による追加料金
  if (specs.certifications) {
    specs.certifications.forEach(cert => {
      price += certificationPrices[cert] || 0;
    });
  }
  
  return price;
};
