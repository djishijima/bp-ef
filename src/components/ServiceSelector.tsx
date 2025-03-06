
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ServiceType } from '@/types';
import { Printer, BookOpen, Truck, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceSelectorProps {
  selectedService: ServiceType;
  onServiceChange: (service: ServiceType) => void;
}

const ServiceSelector = ({ selectedService, onServiceChange }: ServiceSelectorProps) => {
  const services = [
    { 
      id: 'printing' as ServiceType, 
      name: '印刷', 
      icon: <Printer className="h-5 w-5" />,
      description: '名刺、チラシ、ポスターなどの印刷サービス'
    },
    { 
      id: 'binding' as ServiceType, 
      name: '製本', 
      icon: <BookOpen className="h-5 w-5" />,
      description: '冊子、書籍、マニュアルなどの製本サービス'
    },
    { 
      id: 'logistics' as ServiceType, 
      name: '物流', 
      icon: <Truck className="h-5 w-5" />,
      description: '配送、梱包、保管などの物流サービス'
    },
    { 
      id: 'eco-printing' as ServiceType, 
      name: '環境印刷', 
      icon: <Leaf className="h-5 w-5" />,
      description: '環境に配慮した用紙・インクを使用する印刷サービス'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full mb-6">
      {services.map((service) => (
        <Button
          key={service.id}
          type="button"
          variant={selectedService === service.id ? "default" : "outline"}
          className={cn(
            "flex flex-col h-auto py-4 gap-2 transition-all duration-300",
            selectedService === service.id 
              ? "border-primary/30 bg-primary text-primary-foreground" 
              : "hover:border-primary/30"
          )}
          onClick={() => onServiceChange(service.id)}
        >
          <div className="flex items-center justify-center">
            {service.icon}
            <span className="ml-2 font-medium">{service.name}</span>
          </div>
          <p className="text-xs font-normal opacity-80 line-clamp-2">
            {service.description}
          </p>
        </Button>
      ))}
    </div>
  );
};

export default ServiceSelector;
