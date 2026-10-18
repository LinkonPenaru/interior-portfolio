import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand Statement */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="font-serif text-2xl lg:text-3xl text-cream-100 font-light tracking-wide">
              Urvi G Eragola
            </h2>
            <p className="text-xs uppercase tracking-super-wide text-stone-400">
              Spatial Planning • Interior Architecture • Technical Drafting
            </p>
            <p className="text-sm text-stone-400 leading-relaxed font-light max-w-sm pt-2">
              Portfolio of academic and conceptual interior architecture projects from Rachana Sansad&apos;s Academy of Architecture, Mumbai. Exploring tactile materiality, spatial harmony, and detailed drafting precision.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs uppercase tracking-super-wide text-stone-400 font-semibold">
              Exploration
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-stone-300 hover:text-cream-100 transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-stone-300 hover:text-cream-100 transition-colors">
                  All Projects (3)
                </Link>
              </li>
              <li>
                <Link to="/projects/modern-contemporary-kitchen" className="text-stone-300 hover:text-cream-100 transition-colors">
                  Modern Kitchen
                </Link>
              </li>
              <li>
                <Link to="/projects/thematic-master-bedroom-suite" className="text-stone-300 hover:text-cream-100 transition-colors">
                  Thematic Master Suite
                </Link>
              </li>
              <li>
                <Link to="/projects/a-sky-bedroom-kids-room" className="text-stone-300 hover:text-cream-100 transition-colors">
                  A Sky Bedroom
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-300 hover:text-cream-100 transition-colors">
                  About & Drafting Principles
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Inquiries */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs uppercase tracking-super-wide text-stone-400 font-semibold">
              Academic & Inquiries
            </h3>
            <div className="space-y-2 text-sm text-stone-400">
              <p className="text-cream-200">
                Rachana Sansad&apos;s Academy of Architecture
              </p>
              <p>B. Voc. (Interior Design) — FYBVOC (Roll No: 14)</p>
              <p>Mumbai, Maharashtra, India</p>
            </div>

            <div className="pt-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-extra-wide text-cream-100 border-b border-stone-600 pb-1 hover:border-cream-100 hover:text-white transition-colors"
              >
                <span>Initiate a Conversation</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Urvi G Eragola. All interior designs and architectural drawings reserved.</p>
          <div className="flex items-center space-x-6 text-[11px] tracking-wider uppercase">
            <span>Phase 1 Portfolio Build</span>
            <span>•</span>
            <span>Supabase Ready</span>
            <span>•</span>
            <span>Cloudflare Pages</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
