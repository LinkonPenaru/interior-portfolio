import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory } from '../types/project';
import { projectService } from '../services/projectService';
import { ProjectCard } from '../components/ui/ProjectCard';
import { EmptyState } from '../components/ui/EmptyState';
import { usePageMeta } from '../hooks/usePageMeta';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Architectural Projects & Spatial Portfolio',
    description: 'Explore verified architectural projects including contemporary kitchen layouts, thematic master suites, and celestial kids bedroom interior designs.',
  });

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

  const totalSheets = projects.reduce((acc, p) => acc + (p.galleryImages?.length || 9), 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[clamp(2.5rem,4vw,4.5rem)] space-y-[clamp(2rem,3.5vw,3.5rem)]">
      {/* Balanced Hero Header */}
      <div className="border-b border-stone-200 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-200 text-[11px] font-mono uppercase tracking-[0.12em] text-stone-600">
              <span>Rachana Sansad&apos;s Academy of Architecture</span>
              <span>•</span>
              <span>FYBVOC</span>
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,4.5vw,4.25rem)] text-stone-900 font-light leading-[1.12]">
              Spatial & Technical Works
            </h1>
            <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
              Comprehensive architectural studies and execution portfolios extracted directly from physical drafting sheets. Each project features hand-drafted layouts, joinery sections, electrical looping, and verified specification schedules.
            </p>
          </div>

          {/* Right Column: Architectural Technical Sheet Index / Supporting Spec Card */}
          <div className="lg:col-span-5 bg-sand-100/70 border border-stone-300/80 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-300/70 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-stone-700 font-medium">
                Technical Index & Documentation
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                {projects.length} Active Studies
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
              <div>
                <span className="block font-serif text-2xl text-stone-900 font-light">
                  {String(projects.length).padStart(2, '0')}
                </span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  Projects
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl text-stone-900 font-light">
                  {totalSheets}
                </span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  Sheets
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl text-stone-900 font-light">
                  1:10
                </span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  Min Scale
                </span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 font-light leading-relaxed border-t border-stone-300/70 pt-3">
              Conforms to architectural drafting standards, ISO projection conventions, and itemized material schedules.
            </p>
          </div>
        </div>
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
