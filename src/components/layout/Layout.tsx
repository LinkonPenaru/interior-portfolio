import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { PortfolioChatbot } from '../chat/PortfolioChatbot';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-stone-800">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {/* Interactive AI Design & Portfolio Assistant */}
      <PortfolioChatbot />
    </div>
  );
};

export default Layout;
