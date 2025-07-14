import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;