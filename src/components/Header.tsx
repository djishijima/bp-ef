
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
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

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-out-expo",
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">P</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight animate-fade-in">
            PrintEstimatorAI
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="#features" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#pricing" 
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Pricing
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button 
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
              "bg-primary text-primary-foreground shadow hover:bg-primary/90",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            )}
          >
            お問い合わせ
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
