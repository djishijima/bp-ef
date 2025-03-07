
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        "fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 ease-out-expo",
        scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90" 
          : "bg-transparent"
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-base">文</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            文唱堂印刷株式会社
          </h1>
        </div>
        
        {/* ヘッダー右側 - 管理者リンク */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/admin">
            <Button 
              variant="ghost"
              className="whitespace-nowrap flex items-center gap-1"
            >
              <ShieldCheck className="h-4 w-4" />
              管理者ページ
            </Button>
          </Link>
        </div>
        
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
      
      {/* Mobile Navigation Menu - ボタン削除済み */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border/60 px-4 py-5 animate-in slide-in-from-top">
          <nav className="flex flex-col space-y-4">
            {/* モバイルナビゲーション */}
            <Link to="/admin">
              <Button 
                className="w-full"
                variant="ghost"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                管理者ページ
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
