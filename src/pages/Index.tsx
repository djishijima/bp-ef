
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import PrintForm from '@/components/PrintForm';
import QuoteDetails from '@/components/QuoteDetails';
import { QuoteDetails as QuoteDetailsType, ServiceType } from '@/types';
import { FileText, MessageSquare } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 w-full">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <section className="mb-20 text-center animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground mb-4">
                印刷業界向けAIソリューション
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
                スマートな印刷見積もり
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                最新技術で印刷業務をもっと簡単に。正確な見積もりですばやく対応します。
              </p>
            </div>
          </section>
          
          <section className="relative mb-16" id="form">            
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
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="w-full mb-6">
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
                  
                  <div className="w-full max-w-3xl">
                    {!quote ? (
                      <PrintForm 
                        onQuoteGenerated={handleQuoteGenerated} 
                        serviceType={selectedService}
                      />
                    ) : (
                      <QuoteDetails quote={quote} onNewQuote={handleNewQuote} />
                    )}
                  </div>
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
                  <div className="flex justify-center w-full">
                    <div className="w-full max-w-3xl">
                      <QuoteDetails quote={quote} onNewQuote={handleNewQuote} />
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
