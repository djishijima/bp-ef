
export type PrintSpecs = {
  productType: string;
  size: string;
  quantity: number;
  paperType: string;
  printColors: string;
  finishing: string[];
  customSpecs?: string;
  deliveryDate?: Date;
  deliveryAddress?: string;
}

export type QuoteDetails = {
  id: string;
  specs: PrintSpecs;
  price: number;
  turnaround: number; // in days
  discountApplied?: number;
}

export type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
