
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const HeaderNav = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link to="/mypage">
        <Button variant="ghost" className="gap-2 text-sm font-normal">
          <User className="h-4 w-4" />
          マイページ
        </Button>
      </Link>
    </div>
  );
};

export default HeaderNav;
