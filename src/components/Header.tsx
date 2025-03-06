
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ease-out-expo",
        scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90" 
          : "bg-transparent"
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-base">P</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            PrintEstimatorAI
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#features" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            特徴
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            ご利用方法
          </a>
          <a 
            href="#pricing" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            料金プラン
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button 
            className="hidden md:inline-flex"
            variant="default"
          >
            無料で見積もり
          </Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="メニュー"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border/60 px-4 py-5 animate-in slide-in-from-top">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-sm font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              特徴
            </a>
            <a 
              href="#how-it-works" 
              className="text-sm font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ご利用方法
            </a>
            <a 
              href="#pricing" 
              className="text-sm font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              料金プラン
            </a>
            <Button 
              className="w-full mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              無料で見積もり
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
