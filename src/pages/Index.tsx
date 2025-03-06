
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PrintForm from '@/components/PrintForm';
import QuoteDetails from '@/components/QuoteDetails';
import AIChat from '@/components/AIChat';
import { QuoteDetails as QuoteDetailsType, ServiceType } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isApiKeySet } from '@/services/ai';

const Index = () => {
  const [quote, setQuote] = useState<QuoteDetailsType | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType>('printing');
  const [apiConfigured, setApiConfigured] = useState(isApiKeySet());
  
  useEffect(() => {
    // Check if API key is set on component mount
    setApiConfigured(isApiKeySet());
  }, []);
  
  const handleQuoteGenerated = (newQuote: QuoteDetailsType) => {
    setQuote(newQuote);
  };
  
  const handleNewQuote = () => {
    setQuote(null);
  };
  
  const handleServiceSelect = (serviceType: ServiceType) => {
    setSelectedService(serviceType);
  };

  // Handle API configuration completion
  const handleApiConfigured = () => {
    setApiConfigured(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 w-full">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <section className="mb-12 text-center animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground mb-4">
                印刷業界向けAIソリューション
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
                スマートな印刷見積もり
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                AIとの対話で簡単に見積もり。正確な見積もりをAIとの会話でスムーズに取得できます。
              </p>
            </div>
          </section>
          
          <section className="relative" id="quote-generation">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
              {/* AIチャット部分 */}
              <div className="w-full lg:w-1/2 animate-fade-in">
                <div className="bg-card rounded-lg shadow-md border border-border/60 overflow-hidden h-full">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">AIと会話して見積もり作成</h2>
                    <p className="text-muted-foreground mb-6">
                      質問に答えるだけで、最適な印刷見積もりを提案します。特別な要件や質問があればお気軽にどうぞ。
                    </p>
                    <AIChat 
                      onQuoteGenerated={handleQuoteGenerated} 
                      onServiceSelect={handleServiceSelect}
                      initialApiConfigured={apiConfigured}
                      onApiConfigured={handleApiConfigured}
                    />
                  </div>
                </div>
              </div>
              
              {/* 見積もり部分 */}
              <div className="w-full lg:w-1/2 animate-fade-in">
                {quote ? (
                  <QuoteDetails quote={quote} onNewQuote={handleNewQuote} />
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="mb-6 flex justify-center">
                        <div className="service-selector-container">
                          <div className="inline-flex rounded-md border p-1 bg-muted/50 whitespace-nowrap">
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
                    </div>
                    <PrintForm 
                      onQuoteGenerated={handleQuoteGenerated} 
                      serviceType={selectedService}
                    />
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
