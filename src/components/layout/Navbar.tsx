import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'About & Vision', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-cream-50/95 backdrop-blur-md border-b border-stone-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Designer Mark */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-600 rounded-sm"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-stone-900 font-semibold group-hover:text-stone-700 transition-colors">
              URVI G ERAGOLA
            </span>
            <span className="text-[10px] sm:text-xs tracking-super-wide uppercase text-stone-500 font-medium -mt-1 group-hover:text-stone-700 transition-colors">
              Interior Design & Spatial Architecture
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`text-xs uppercase tracking-super-wide transition-all duration-200 pb-1 relative ${
                    isActive
                      ? 'text-stone-950 font-semibold'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-stone-900 animate-fadeIn" />
                  )}
                </NavLink>
              );
            })}
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-800 text-xs uppercase tracking-wider text-stone-900 hover:bg-stone-900 hover:text-cream-50 transition-all duration-200"
            >
              <span>Inquire</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 text-stone-700 hover:text-stone-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-600 rounded-sm"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-stone-200 bg-cream-50 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-fadeIn">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`text-sm uppercase tracking-extra-wide py-2 px-3 rounded transition-colors ${
                    isActive
                      ? 'bg-stone-200/60 text-stone-950 font-semibold'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                  }`}
                >
                  {link.label}
                </NavLink>
              );
            })}
            <div className="pt-2">
              <Link
                to="/contact"
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 py-3 bg-stone-900 text-cream-50 text-xs uppercase tracking-wider"
              >
                <span>Get In Touch</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
