
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import PrintForm from '@/components/PrintForm';
import QuoteDetails from '@/components/QuoteDetails';
import AIChat from '@/components/AIChat';
import { QuoteDetails as QuoteDetailsType, ServiceType } from '@/types';
import { MessageSquare, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('form');
  const [quote, setQuote] = useState<QuoteDetailsType | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>('printing');
  
  const handleQuoteGenerated = (newQuote: QuoteDetailsType) => {
    setQuote(newQuote);
    setActiveTab('result');
  };
  
  const handleNewQuote = () => {
    setQuote(null);
    setActiveTab('form');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <section className="mb-20 text-center animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground mb-4">
                印刷業界向けAIソリューション
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
                スマートな印刷見積もり・<br className="hidden sm:inline" />AI対応チャットサポート
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                最新技術で印刷業務をもっと簡単に。正確な見積もりと24時間対応のAIアシスタントで、お客様のニーズにすばやく対応します。
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  className="gap-2 px-5 py-6 font-medium transition-all duration-300"
                  onClick={() => setActiveTab('form')}
                >
                  今すぐ見積もりを取得 
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 px-5 py-6 font-medium transition-all duration-300"
                  onClick={() => setActiveTab('chat')}
                >
                  AIアシスタントに質問
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
          
          <section className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none opacity-60 z-10 hidden md:block" />
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="max-w-6xl mx-auto"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 w-full max-w-md">
                  <TabsTrigger 
                    value="form"
                    className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    <FileText className="h-4 w-4" />
                    見積もりフォーム
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chat"
                    className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    <MessageSquare className="h-4 w-4" />
                    AIチャット
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent 
                value="form" 
                className={cn(
                  "mt-0 focus-visible:outline-none focus-visible:ring-0",
                  "data-[state=active]:animate-fade-in"
                )}
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
                  <div className="w-full mb-6">
                    <div className="mb-6 flex justify-center">
                      <div className="inline-flex rounded-md border p-1 bg-muted/50">
                        <Button 
                          variant={selectedService === 'printing' ? 'default' : 'ghost'} 
                          className="text-sm px-3"
                          onClick={() => setSelectedService('printing')}
                        >
                          印刷
                        </Button>
                        <Button 
                          variant={selectedService === 'binding' ? 'default' : 'ghost'} 
                          className="text-sm px-3"
                          onClick={() => setSelectedService('binding')}
                        >
                          製本
                        </Button>
                        <Button 
                          variant={selectedService === 'logistics' ? 'default' : 'ghost'} 
                          className="text-sm px-3"
                          onClick={() => setSelectedService('logistics')}
                        >
                          物流
                        </Button>
                        <Button 
                          variant={selectedService === 'eco-printing' ? 'default' : 'ghost'} 
                          className="text-sm px-3"
                          onClick={() => setSelectedService('eco-printing')}
                        >
                          環境印刷
                        </Button>
                        <Button 
                          variant={selectedService === 'sdgs-consulting' ? 'default' : 'ghost'} 
                          className="text-sm px-3"
                          onClick={() => setSelectedService('sdgs-consulting')}
                        >
                          SDGs
                        </Button>
                        <Button 
                          variant={selectedService === 'sustainability-report' ? 'default' : 'ghost'} 
                          className="text-sm px-3"
                          onClick={() => setSelectedService('sustainability-report')}
                        >
                          サステナビリティ
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {!quote ? (
                    <PrintForm 
                      onQuoteGenerated={handleQuoteGenerated} 
                      serviceType={selectedService}
                    />
                  ) : (
                    <QuoteDetails quote={quote} onNewQuote={handleNewQuote} />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent 
                value="chat" 
                className={cn(
                  "mt-0 focus-visible:outline-none focus-visible:ring-0",
                  "data-[state=active]:animate-fade-in"
                )}
              >
                <div className="flex justify-center">
                  <AIChat initialMessage="こんにちは！印刷物に関するご質問やお見積もりのお手伝いをさせていただきます。お気軽にお問い合わせください。" />
                </div>
              </TabsContent>
              
              <TabsContent 
                value="result" 
                className={cn(
                  "mt-0 focus-visible:outline-none focus-visible:ring-0",
                  "data-[state=active]:animate-fade-in"
                )}
              >
                {quote && (
                  <div className="flex justify-center">
                    <QuoteDetails quote={quote} onNewQuote={handleNewQuote} />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </section>
          
          <section className="py-12 max-w-6xl mx-auto" id="features">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">主な機能</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                印刷業務の効率化と顧客満足度向上のための包括的なソリューション
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-6 rounded-xl border border-border/60 bg-white/50 shadow-sm",
                    "transition-all duration-300 hover:shadow-md hover:border-primary/20",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="py-12 max-w-6xl mx-auto" id="how-it-works">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">ご利用の流れ</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                簡単3ステップでスピーディーにお見積りが完了します
              </p>
            </div>
            
            <div className="relative">
              <div className="hidden md:block absolute left-0 right-0 top-1/2 h-0.5 bg-border/60 -translate-y-1/2 z-0" />
              
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border border-border shadow-sm text-xl font-bold text-primary mb-6 relative">
                      {index + 1}
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-border/60 -translate-y-1/2 z-0" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          <section className="py-16 max-w-6xl mx-auto" id="pricing">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">料金プラン</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                ビジネスニーズに合わせた柔軟な料金体系
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-6 rounded-xl border bg-card shadow-sm",
                    "transition-all duration-300 hover:shadow-md hover:border-primary/30",
                    plan.featured ? "border-primary/30 relative" : "border-border/60",
                    "flex flex-col h-full"
                  )}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      おすすめ
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                    <div className="flex items-end mb-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1 mb-1">円/月</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.billingDescription}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <svg 
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={plan.featured ? "w-full" : "w-full bg-secondary hover:bg-secondary/80"}
                    variant={plan.featured ? "default" : "secondary"}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <footer className="py-12 bg-secondary/30 border-t border-border/60">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">P</span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  PrintEstimatorAI
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                印刷業界向けの革新的なAI見積もりソリューション。
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">サービス</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">オンライン見積もり</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AIチャットサポート</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">印刷サービス</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">デザインサービス</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">会社情報</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">会社概要</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">プライバシーポリシー</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">利用規約</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">お問い合わせ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">お問い合わせ</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">〒100-0001</p>
                <p className="text-sm text-muted-foreground">東京都千代田区1-1-1</p>
                <p className="text-sm text-muted-foreground">example@printestimator.ai</p>
                <p className="text-sm text-muted-foreground">03-1234-5678</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border/60 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PrintEstimatorAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Features section data
const features = [
  {
    icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>,
    title: "正確な見積もり計算",
    description: "用紙、印刷方法、数量などを考慮した高精度な見積もりを即時に生成します。"
  },
  {
    icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>,
    title: "AIチャットサポート",
    description: "印刷に関する質問に24時間対応するインテリジェントなチャットボットで、顧客サポートを強化します。"
  },
  {
    icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>,
    title: "見積書PDF出力",
    description: "プロフェッショナルな見積書をPDF形式で簡単に作成し、顧客にすぐに共有できます。"
  },
  {
    icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>,
    title: "多様な支払いオプション",
    description: "クレジットカード、銀行振込、後払いなど、顧客に合わせた柔軟な支払い方法を提供します。"
  },
  {
    icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>,
    title: "顧客管理システム",
    description: "過去の注文履歴や顧客情報を一元管理し、リピート注文を簡単に行えます。"
  },
  {
    icon: <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>,
    title: "分析・レポート",
    description: "詳細な分析とレポート機能で、ビジネスの成長トレンドを把握し、意思決定を支援します。"
  }
];

// How it works steps
const steps = [
  {
    title: "印刷仕様を入力",
    description: "商品タイプ、サイズ、数量、用紙の種類など、必要な仕様を入力してください。"
  },
  {
    title: "即時見積もり生成",
    description: "AIがすべての仕様を考慮し、最適な価格と納期の見積もりを即座に生成します。"
  },
  {
    title: "注文または相談",
    description: "見積もりに満足したら注文を確定するか、AIチャットで詳細を相談できます。"
  }
];

// Pricing plans
const pricingPlans = [
  {
    name: "ベーシック",
    description: "スモールビジネス向けの基本プラン",
    price: "9,800",
    billingDescription: "年間契約で月額換算（税抜）",
    features: [
      "基本的な見積もり機能",
      "AIチャットサポート（営業時間内）",
      "PDFエクスポート",
      "クライアント管理 (50件まで)",
      "Eメールサポート"
    ],
    buttonText: "プランを選択",
    featured: false,
  },
  {
    name: "プロフェッショナル",
    description: "成長中の企業向けの充実プラン",
    price: "19,800",
    billingDescription: "年間契約で月額換算（税抜）",
    features: [
      "高度な見積もり機能",
      "24時間AIチャットサポート",
      "カスタムブランディング",
      "クライアント管理 (無制限)",
      "優先サポート",
      "高度な分析レポート"
    ],
    buttonText: "プランを選択",
    featured: true,
  },
  {
    name: "エンタープライズ",
    description: "大規模企業向けのカスタムプラン",
    price: "39,800",
    billingDescription: "年間契約で月額換算（税抜）",
    features: [
      "完全カスタマイズ可能な見積もり",
      "専用AIアシスタント",
      "高度なセキュリティ",
      "API連携",
      "専任アカウントマネージャー",
      "カスタムワークフロー統合"
    ],
    buttonText: "お問い合わせ",
    featured: false,
  }
];

export default Index;
