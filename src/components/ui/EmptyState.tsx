import React from 'react';
import { FolderX, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Projects Found',
  message = 'No architectural projects match the selected criteria.',
  actionText = 'View All Projects',
  actionHref = '/projects',
}) => {
  return (
    <div className="py-20 px-6 text-center border border-dashed border-stone-300 bg-cream-50/60 max-w-xl mx-auto my-12">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 text-stone-600 mb-4">
        <FolderX className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-2xl text-stone-900 font-normal mb-2">{title}</h3>
      <p className="text-sm text-stone-600 font-light mb-6">{message}</p>
      {actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-cream-50 text-xs uppercase tracking-extra-wide hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
};
