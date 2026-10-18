import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export const NotFoundPage: React.FC = () => {
  usePageMeta({
    title: '404 Drawing Not Found',
    description: 'The requested architectural sheet or portfolio route does not exist.',
  });
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center space-y-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sand-100 text-stone-700 mb-2">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-3">
        <span className="text-xs uppercase tracking-super-wide text-stone-500 font-mono block">
          Error 404 • Spatial Coordinate Uncharted
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-stone-900 font-light">
          Drawing Not Found
        </h1>
        <p className="text-stone-600 font-light text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          The architectural sheet or page you requested does not exist or may have been relocated within the portfolio index.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-cream-50 text-xs uppercase tracking-super-wide hover:bg-stone-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-900 text-xs uppercase tracking-super-wide hover:border-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Projects</span>
        </Link>
      </div>
    </div>
  );
};
