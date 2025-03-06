
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuoteActionsProps {
  onNewQuote: () => void;
  isGenerated: boolean;
  onSave: () => void;
  isSaving: boolean;
}

const QuoteActions = ({ onNewQuote, isGenerated, onSave, isSaving }: QuoteActionsProps) => {
  return (
    <div className="flex flex-col gap-3 pt-2 pb-6">
      <div className="flex gap-3 w-full">
        <Button 
          className={cn(
            "flex-1 transition-all duration-300",
            isGenerated ? 
              "bg-green-600 hover:bg-green-700" : 
              "bg-primary/90 hover:bg-primary"
          )}
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              保存中...
            </>
          ) : isGenerated ? (
            <>
              <Printer className="h-4 w-4 mr-2" />
              見積書を印刷
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              見積もりを保存
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 transition-all duration-300"
        >
          <Download className="h-4 w-4 mr-2" />
          PDF出力
        </Button>
      </div>
      
      <Button 
        variant="link" 
        className="transition-all duration-300"
        onClick={onNewQuote}
      >
        別の見積もりを作成
      </Button>
    </div>
  );
};

export default QuoteActions;
