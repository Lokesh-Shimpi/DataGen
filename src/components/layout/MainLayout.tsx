/**
 * MainLayout Component
 * ====================
 * Main layout wrapper with navbar and footer.
 */

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1" role="main">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default MainLayout;