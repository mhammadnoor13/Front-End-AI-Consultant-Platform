import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, FileText, UserPlus, Users, Upload } from 'lucide-react';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-primary">
              منصة الاستشارات الذكية
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-reverse space-x-4">
            {!isAuthenticated ? (
              // Non-registered user navigation
              <>
                <Button
                  asChild
                  variant={isActive('/') ? 'default' : 'ghost'}
                >
                  <Link to="/" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    إرسال حالة
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={isActive('/register') ? 'default' : 'ghost'}
                >
                  <Link to="/register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    التسجيل
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={isActive('/login') ? 'default' : 'ghost'}
                >
                  <Link to="/login">
                    تسجيل الدخول
                  </Link>
                </Button>
              </>
            ) : user?.role === 'admin' ? (
              // Admin navigation
              <>
                <Button
                  asChild
                  variant={isActive('/admin/consultants') ? 'default' : 'ghost'}
                >
                  <Link to="/admin/consultants" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    مراجعة المستشارين
                  </Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              // Registered consultant navigation
              <>
                <Button
                  asChild
                  variant={isActive('/cases') ? 'default' : 'ghost'}
                >
                  <Link to="/cases" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    مراجعة الحالات
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={isActive('/references') ? 'default' : 'ghost'}
                >
                  <Link to="/references" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    إضافة مراجع
                  </Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;