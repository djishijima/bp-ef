
export type ServiceType = 'printing' | 'binding' | 'logistics' | 'eco-printing' | 'sdgs-consulting' | 'sustainability-report';

export type PrintSpecs = {
  serviceType: ServiceType;
  productType: string;
  size: string;
  quantity: number;
  paperType: string;
  printColors: string;
  finishing: string[];
  customSpecs?: string;
  deliveryDate?: Date;
  deliveryAddress?: string;
  // 製本特有のフィールド
  bindingType?: string;
  pageCount?: number;
  coverType?: string;
  // 物流特有のフィールド
  weight?: number;
  dimensions?: string;
  deliverySpeed?: string;
  // 環境印刷特有のフィールド
  ecoMaterials?: string[];
  carbonOffset?: boolean;
  certifications?: string[];
  // SDGsコンサルティング特有のフィールド
  companySize?: string;
  industryType?: string;
  currentSdgsInitiatives?: string[];
  targetGoals?: string[];
  consultingScope?: string;
  // サステナビリティレポート特有のフィールド
  reportType?: string;
  reportLength?: number;
  includedData?: string[];
  designComplexity?: string;
  previousReports?: boolean;
  // ファイルアップロード
  uploadedFiles?: File[];
  fileUrls?: string[];
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
  attachments?: string[]; // URLs to attached files
  relatedTo?: string; // Reference to a specific form field the message is about
}
