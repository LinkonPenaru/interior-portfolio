import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Ruler, Sparkles, FileSpreadsheet, ArrowUpRight } from 'lucide-react';
import { Project } from '../types/project';
import { projectService } from '../services/projectService';
import { ProjectCard } from '../components/ui/ProjectCard';

export const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getFeaturedProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Editorial Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 border-b border-stone-200/80 pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-8">
            {/* Academic Credential Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-200 text-xs tracking-super-wide uppercase text-stone-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
              <span>Rachana Sansad&apos;s Academy of Architecture, Mumbai</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl tracking-tight text-stone-900 font-light leading-[1.08]">
              Architectural clarity, tactile materials, and spatial narratives.
            </h1>

            {/* Editable Introduction Placeholder */}
            <div className="p-5 sm:p-6 bg-sand-50/70 border-l-2 border-stone-800 text-stone-700 space-y-2 max-w-2xl">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-extra-wide text-stone-500 font-mono">
                <span>Designer Statement</span>
                <span>Editable Profile</span>
              </div>
              <p className="text-base sm:text-lg font-light leading-relaxed text-stone-800">
                Hi, I am <strong className="font-semibold text-stone-950">Urvi G Eragola</strong>. I study Interior Design at Rachana Sansad&apos;s Academy of Architecture (B. Voc., Roll No: 14). My work focuses on balanced spatial planning, precise technical drafting, curated material palettes, and purposeful interior details.
              </p>
              <p className="text-xs text-stone-500 italic">
                (Designer note: This introduction is fully editable in Phase 2 via the upcoming admin dashboard.)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#showcase"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-stone-900 text-cream-50 text-xs uppercase tracking-super-wide hover:bg-stone-800 transition-colors shadow-sm"
              >
                <span>Explore Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-stone-300 bg-transparent text-stone-900 text-xs uppercase tracking-super-wide hover:border-stone-900 transition-colors"
              >
                <span>Design Philosophy</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Project Showcase */}
      <section id="showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs uppercase tracking-super-wide text-stone-500 font-mono">
              Academic & Studio Projects
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light mt-1">
              Verified Design Portfolio
            </h2>
          </div>
          <p className="text-sm text-stone-500 max-w-md font-light">
            Three comprehensive interior studies extracted directly from physical drafting sheets and technical schedules.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {loading ? (
            <div className="col-span-3 py-16 text-center text-sm text-stone-500">
              Loading verified architectural sheets...
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-800 text-xs uppercase tracking-extra-wide text-stone-900 hover:bg-stone-900 hover:text-cream-50 transition-colors"
          >
            <span>View All Architectural Drawings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Architectural Discipline & Technical Competencies */}
      <section className="bg-sand-100/60 border-y border-stone-200/90 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs uppercase tracking-super-wide text-stone-500 font-mono">
              Core Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light mt-1">
              Methodology & Technical Rigor
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-light mt-3">
              Each project demonstrates a continuous process from client brief to hand-drafted execution blueprints.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-cream-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-none bg-stone-100 flex items-center justify-center text-stone-800">
                <Ruler className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 font-medium">Spatial Layouts</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Precision floor plans at 1:10, 1:15, and 1:25 scales establishing clear circulation, functional zones, and dimensional tolerances.
              </p>
            </div>

            <div className="p-6 bg-cream-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-none bg-stone-100 flex items-center justify-center text-stone-800">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 font-medium">Joinery Details</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Detailed 1:2 joinery cross-sections for custom cabinetry, toe kicks, countertop drip grooves, and bespoke corner mechanisms.
              </p>
            </div>

            <div className="p-6 bg-cream-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-none bg-stone-100 flex items-center justify-center text-stone-800">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 font-medium">Appliance Scheduling</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Itemized specification schedules with verified manufacturer brands (Samsung, KitchenAid, Kohler, Jaquar), wattage, and market pricing.
              </p>
            </div>

            <div className="p-6 bg-cream-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-none bg-stone-100 flex items-center justify-center text-stone-800">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 font-medium">Materiality & Mood</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Thoughtful material curation pairing natural stones (Nero Marquina, green marble) with rich timbers, metals, and ambient lighting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Contact Teaser Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-cream-50 p-8 sm:p-14 lg:p-20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-super-wide text-stone-400 font-mono">
              Inquiries & Opportunities
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-cream-100">
              Interested in collaborating or discussing spatial design?
            </h2>
            <p className="text-sm text-stone-300 font-light max-w-lg">
              Open to internship opportunities, residential design inquiries, and technical drafting collaborations across Mumbai and remote formats.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cream-100 text-stone-900 text-xs uppercase tracking-super-wide hover:bg-white transition-colors"
            >
              <span>Get In Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
