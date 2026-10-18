import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, FileText } from 'lucide-react';
import { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
  layout?: 'standard' | 'featured';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, layout = 'standard' }) => {
  const isFeatured = layout === 'featured';

  const categoryLabels: Record<string, string> = {
    kitchen: 'Culinary Architecture',
    bedroom: 'Thematic Master Suite',
    kids: "Children's Spatial Design",
  };

  return (
    <article className="group bg-cream-50 border border-stone-200/90 rounded-none overflow-hidden transition-all duration-300 hover:border-stone-400 hover:shadow-lg flex flex-col">
      {/* Image Container with subtle zoom */}
      <Link
        to={`/projects/${project.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-stone-100"
        aria-label={`View details for ${project.title}`}
      >
        <img
          src={project.coverImage}
          alt={`Architectural representation of ${project.title}`}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-stone-950/10 group-hover:bg-transparent transition-colors duration-300" />
        
        {/* Category Pill */}
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 bg-stone-900/85 backdrop-blur-sm text-cream-100 text-[10px] uppercase tracking-super-wide font-medium">
            {categoryLabels[project.category] || project.category}
          </span>
        </div>

        {/* Sheet Count Badge */}
        <div className="absolute bottom-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cream-50/90 backdrop-blur-sm text-stone-800 text-[11px] font-mono tracking-wider">
            <Layers className="w-3 h-3 text-stone-600" />
            <span>{project.galleryImages.length} Sheets</span>
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-extra-wide text-stone-500 font-medium">
            <span>{project.institution.split(',')[0]}</span>
            <span>•</span>
            <span>{project.academicClass}</span>
          </div>

          <h3 className={`font-serif text-stone-900 group-hover:text-stone-700 transition-colors ${
            isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          } font-normal tracking-tight`}>
            <Link to={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p className="text-xs uppercase tracking-wider text-stone-500 font-medium italic">
            {project.subtitle}
          </p>

          <p className="text-sm text-stone-600 font-light leading-relaxed line-clamp-3">
            {project.shortDescription}
          </p>
        </div>

        {/* Card Footer Link */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-mono">
            <FileText className="w-3.5 h-3.5" />
            <span>{project.sourcePdf}</span>
          </span>

          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-extra-wide text-stone-900 group-hover:text-stone-950 font-semibold transition-colors"
          >
            <span>Explore Design</span>
            <ArrowRight className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};
