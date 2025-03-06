
import { PrintSpecs, QuoteDetails } from '@/types';

// Base prices for different product types
const baseProductPrices: Record<string, number> = {
  'business-card': 2000,
  'flyer': 5000,
  'brochure': 10000,
  'poster': 8000,
  'booklet': 15000,
  'postcard': 3000,
  'stationery': 4000,
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
};

// Print color price modifiers
const colorPriceModifiers: Record<string, number> = {
  'black-and-white': 0,
  'full-color-one-side': 3000,
  'full-color-both-sides': 5000,
  'spot-color': 2000,
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
  
  // Add days based on product complexity
  switch (specs.productType) {
    case 'business-card':
      baseDays = 3;
      break;
    case 'booklet':
      baseDays = 10;
      break;
    default:
      break;
  }
  
  // Add days for finishing options
  if (specs.finishing.includes('die-cutting') || specs.finishing.includes('embossing')) {
    baseDays += 3;
  } else if (specs.finishing.length > 0 && !specs.finishing.includes('none')) {
    baseDays += 1;
  }
  
  // Add days for large quantities
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
  // Start with base price for product type
  let basePrice = baseProductPrices[specs.productType] || baseProductPrices.other;
  
  // Apply paper multiplier
  const paperMultiplier = paperMultipliers[specs.paperType] || paperMultipliers.standard;
  let price = basePrice * paperMultiplier;
  
  // Add color printing costs
  price += colorPriceModifiers[specs.printColors] || 0;
  
  // Add finishing costs
  let finishingCost = 0;
  specs.finishing.forEach(finish => {
    finishingCost += finishingPrices[finish] || 0;
  });
  price += finishingCost;
  
  // Scale by quantity (basic linear scaling with minimum quantity of 50)
  const effectiveQuantity = Math.max(50, specs.quantity);
  price = price * (effectiveQuantity / 100);
  
  // Apply quantity discount
  const discountRate = getQuantityDiscount(specs.quantity);
  const discountAmount = price * discountRate;
  price = price - discountAmount;
  
  // Calculate turnaround time
  const turnaround = calculateTurnaround(specs);
  
  // Round price to nearest 100 yen
  price = Math.ceil(price / 100) * 100;
  
  return {
    id: `Q-${Date.now().toString(36)}`,
    specs,
    price,
    turnaround,
    discountApplied: discountRate > 0 ? discountRate : undefined,
  };
};
