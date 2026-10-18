import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory } from '../types/project';
import { projectService } from '../services/projectService';
import { ProjectCard } from '../components/ui/ProjectCard';
import { EmptyState } from '../components/ui/EmptyState';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [loading, setLoading] = useState(true);

  const categories: { label: string; value: ProjectCategory }[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'Kitchen Design', value: 'kitchen' },
    { label: 'Master Suite', value: 'bedroom' },
    { label: "Kids Bedroom", value: 'kids' },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await projectService.getProjects(selectedCategory);
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="border-b border-stone-200 pb-10 space-y-4 max-w-3xl">
        <span className="text-xs uppercase tracking-super-wide text-stone-500 font-mono">
          Rachana Sansad&apos;s Academy of Architecture • FYBVOC Portfolio
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-light">
          Spatial & Technical Works
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
          The three projects below are directly extracted from physical drafting sheets and specification schedules. Each project features hand-drafted layouts, joinery sections, electrical looping, and verified material/appliance schedules.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-all duration-200 ${
              selectedCategory === cat.value
                ? 'bg-stone-900 text-cream-50 font-medium'
                : 'bg-transparent text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-24 text-center text-sm text-stone-500 font-mono">
          Loading portfolio projects...
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No Projects in this Category"
          message="There are currently no projects matching this category."
          actionText="Show All Projects"
          actionHref="/projects"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
