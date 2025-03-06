
// Helper functions for display names
export function getProductTypeName(type: string): string {
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

export function getSizeName(size: string): string {
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

export function getPaperTypeName(type: string): string {
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

export function getPrintColorName(color: string): string {
  const printColors: Record<string, string> = {
    'black-and-white': 'モノクロ',
    'full-color-one-side': 'フルカラー（片面）',
    'full-color-both-sides': 'フルカラー（両面）',
    'spot-color': '特色',
  };
  return printColors[color] || color;
}

export function getFinishingName(finishing: string): string {
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

// Format Japanese Yen
export function formatPrice(price: number) {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0
  }).format(price);
}

// Calculate discounted amount if applicable
export function getDiscountAmount(price: number, discountApplied?: number) {
  if (!discountApplied) return null;
  
  const originalPrice = Math.round(price / (1 - discountApplied));
  const discountAmount = originalPrice - price;
  
  return {
    discountPercentage: discountApplied * 100,
    discountAmount
  };
}
