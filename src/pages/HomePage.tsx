import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Ruler,
  Sparkles,
  FileSpreadsheet,
  ArrowUpRight,
  Award,
} from 'lucide-react';
import { Project } from '../types/project';
import { projectService } from '../services/projectService';
import { ProjectCard } from '../components/ui/ProjectCard';
import { designerConfig } from '../config/designer';
import { usePageMeta } from '../hooks/usePageMeta';

export const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Editorial Spatial Architecture & Drafting Portfolio',
    description: "Portfolio of interior architect Urvi G Eragola (Rachana Sansad's Academy of Architecture, Mumbai). Contemporary kitchen design, thematic master suite, and celestial kids bedroom architecture.",
  });

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
      {/* Editorial Full-Width Hero Section (Stretched to Full Container Width) */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 border-b border-stone-200/80 pb-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          
          {/* Top Status & Credential Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-stone-100/90 border border-stone-200 text-xs tracking-super-wide uppercase text-stone-700 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="font-mono text-[11px]">{designerConfig.institution}</span>
            </div>

            <div className="text-xs font-mono uppercase tracking-widest text-stone-400 hidden sm:block">
              {designerConfig.academicClass} • Roll No: {designerConfig.rollNumber} • Mumbai, India
            </div>
          </div>

          {/* Grand Stretched Headline (Spans Across the Full Width) */}
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-stone-900 font-light leading-[1.04] w-full">
              Architectural clarity, tactile materials, and spatial narratives.
            </h1>
          </div>

          {/* Full-Width Stretched Designer Statement Card */}
          <div
            className="w-full p-6 sm:p-8 lg:p-10 bg-sand-50/80 border-l-2 border-stone-800 text-stone-700 shadow-sm transition-all hover:bg-sand-50 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Narrative Column (8 columns) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-extra-wide text-stone-500 font-mono">
                  <span className="flex items-center gap-1.5 font-semibold text-stone-800">
                    <Award className="w-3.5 h-3.5 text-stone-700" />
                    <span>Designer Statement</span>
                  </span>
                  <span className="sm:hidden">{designerConfig.academicClass} • Roll No: {designerConfig.rollNumber}</span>
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed text-stone-900">
                  Hi, I am <strong className="font-semibold text-stone-950">{designerConfig.fullName}</strong>. I study Interior Design at {designerConfig.institution}. My practice focuses on balanced spatial planning, precise technical drafting, curated material palettes, and purposeful interior details.
                </p>
                <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                  Focused on tactile materiality, ergonomic tolerances, and measured architectural drawing for residential and commercial environments.
                </p>
              </div>

              {/* Verified Metrics / Pillars (4 columns) */}
              <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-stone-200 lg:pl-8">
                <div className="space-y-0.5">
                  <span className="block font-serif text-2xl sm:text-3xl font-light text-stone-900">03</span>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-stone-500">
                    Verified Studies
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="block font-serif text-2xl sm:text-3xl font-light text-stone-900">27</span>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-stone-500">
                    Drafting Sheets
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="block font-serif text-2xl sm:text-3xl font-light text-stone-900">1:10</span>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-stone-500">
                    Joinery Scales
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons & Links */}
          <div
            className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <a
              href="#showcase"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-cream-50 text-xs uppercase tracking-super-wide hover:bg-stone-800 transition-all duration-200 shadow-sm"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-4 border border-stone-300 bg-white/70 text-stone-900 text-xs uppercase tracking-super-wide hover:border-stone-900 transition-colors shadow-sm"
            >
              <span>Design Philosophy</span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-4 text-xs uppercase tracking-super-wide text-stone-600 hover:text-stone-950 transition-colors"
            >
              <span>Inquiries</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
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
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-800 text-xs uppercase tracking-extra-wide text-stone-900 hover:bg-stone-900 hover:text-cream-50 transition-colors shadow-sm"
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
            <div className="p-6 bg-cream-50 border border-stone-200 space-y-3 transition-transform hover:-translate-y-1 duration-200">
              <div className="w-10 h-10 rounded-none bg-stone-100 flex items-center justify-center text-stone-800">
                <Ruler className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 font-medium">Spatial Layouts</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Precision floor plans at 1:10, 1:15, and 1:25 scales establishing clear circulation, functional zones, and dimensional tolerances.
              </p>
            </div>

            <div className="p-6 bg-cream-50 border border-stone-200 space-y-3 transition-transform hover:-translate-y-1 duration-200">
              <div className="w-10 h-10 rounded-none bg-stone-100 flex items-center justify-center text-stone-800">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 font-medium">Joinery Details</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Detailed 1:2 joinery cross-sections for custom cabinetry, toe kicks, countertop drip grooves, and bespoke corner mechanisms.
              </p>
            </div>

            <div className="p-6 bg-cream-50 border border-stone-200 space-y-3 transition-transform hover:-translate-y-1 duration-200">
              <div className="w-10 h-10 rounded-none bg-stone-100 flex items-center justify-center text-stone-800">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 font-medium">Appliance Scheduling</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Itemized specification schedules with verified manufacturer brands (Samsung, KitchenAid, Kohler, Jaquar), wattage, and market pricing.
              </p>
            </div>

            <div className="p-6 bg-cream-50 border border-stone-200 space-y-3 transition-transform hover:-translate-y-1 duration-200">
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
              Open to residential design inquiries, technical drafting collaborations, and professional opportunities across Mumbai and remote formats.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cream-100 text-stone-900 text-xs uppercase tracking-super-wide hover:bg-white transition-colors shadow-sm"
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
