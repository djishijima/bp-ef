
import { useState, useEffect } from 'react';
import { ServiceType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Printer, BookOpen, Truck, Leaf, BarChart4, LineChart } from 'lucide-react';

interface ServiceSelectorProps {
  selectedService: ServiceType;
  onServiceChange: (service: ServiceType) => void;
}

const ServiceSelector = ({ selectedService, onServiceChange }: ServiceSelectorProps) => {
  useEffect(() => {
    // 初期選択を'printing'に設定
    if (!selectedService) {
      onServiceChange('printing');
    }
  }, [selectedService, onServiceChange]);

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <RadioGroup 
          value={selectedService} 
          onValueChange={(value) => onServiceChange(value as ServiceType)}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div className="flex items-center justify-between space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="printing" id="printing" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <Printer className="h-5 w-5 text-primary" />
                <Label htmlFor="printing" className="font-medium">印刷</Label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="binding" id="binding" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <Label htmlFor="binding" className="font-medium">製本</Label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="logistics" id="logistics" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <Label htmlFor="logistics" className="font-medium">物流</Label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="eco-printing" id="eco-printing" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                <Label htmlFor="eco-printing" className="font-medium">環境印刷</Label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sdgs-consulting" id="sdgs-consulting" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <BarChart4 className="h-5 w-5 text-blue-600" />
                <Label htmlFor="sdgs-consulting" className="font-medium">SDGsコンサルティング</Label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sustainability-report" id="sustainability-report" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <LineChart className="h-5 w-5 text-teal-600" />
                <Label htmlFor="sustainability-report" className="font-medium">サステナビリティレポート</Label>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ServiceSelector;
