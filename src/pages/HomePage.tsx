import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Ruler,
  Sparkles,
  FileSpreadsheet,
  ArrowUpRight,
  Camera,
  Layers,
  Award,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { Project } from '../types/project';
import { projectService } from '../services/projectService';
import { ProjectCard } from '../components/ui/ProjectCard';
import { designerConfig } from '../config/designer';
import { usePageMeta } from '../hooks/usePageMeta';
import { uploadProjectImage } from '../services/storageService';

export const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHeroTab, setActiveHeroTab] = useState<'perspective' | 'plan' | 'profile'>('perspective');
  
  // Custom designer photo support (stored in localStorage with fallback to default aesthetic portrait)
  const [designerPhoto, setDesignerPhoto] = useState<string | null>(() => {
    return localStorage.getItem('urvi_designer_photo') || null;
  });
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploading(true);
    try {
      // First preview immediately via object URL
      const localUrl = URL.createObjectURL(file);
      setDesignerPhoto(localUrl);
      localStorage.setItem('urvi_designer_photo', localUrl);

      // Attempt Supabase storage upload for permanent CDN URL
      const result = await uploadProjectImage(file, 'designer-profile');
      if (result?.url) {
        setDesignerPhoto(result.url);
        localStorage.setItem('urvi_designer_photo', result.url);
      }
    } catch (err) {
      console.warn('Photo saved locally (offline mode):', err);
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Full-Width Editorial Hero Section with Architectural Grid */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20 border-b border-stone-200/80 pb-16 lg:pb-24 architectural-grid-bg overflow-hidden">
        {/* Subtle ambient light gradient */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sand-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column (Typography, Narrative & Credentials) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 animate-fade-in-up">
              {/* Academic Credential Tag with Pulsing Status Indicator */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/90 backdrop-blur-sm border border-stone-200/90 shadow-sm text-xs tracking-super-wide uppercase text-stone-700 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                <span className="font-mono text-[11px]">{designerConfig.institution}</span>
              </div>

              {/* Grand Serif Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-stone-900 font-light leading-[1.08]">
                Architectural clarity, tactile materials, and spatial narratives.
              </h1>

              {/* Designer Statement Card */}
              <div className="p-5 sm:p-6 bg-sand-50/90 backdrop-blur-sm border-l-2 border-stone-800 text-stone-700 space-y-3 shadow-sm transition-all hover:bg-sand-50">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-extra-wide text-stone-500 font-mono">
                  <span className="flex items-center gap-1.5 font-semibold text-stone-700">
                    <Award className="w-3.5 h-3.5 text-stone-700" />
                    <span>Designer Statement</span>
                  </span>
                  <span>{designerConfig.academicClass} • Roll No: {designerConfig.rollNumber}</span>
                </div>
                <p className="text-base sm:text-lg font-light leading-relaxed text-stone-800">
                  Hi, I am <strong className="font-semibold text-stone-950">{designerConfig.fullName}</strong>. I study Interior Design at {designerConfig.institution}. My practice focuses on balanced spatial planning, precise technical drafting, curated material palettes, and purposeful interior details.
                </p>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  Focused on tactile materiality, ergonomic tolerances, and measured architectural drawing for residential and commercial environments.
                </p>
              </div>

              {/* Quick Architectural Credentials / Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-white/70 border border-stone-200 text-center">
                  <span className="block font-serif text-2xl font-light text-stone-900">03</span>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    Verified Projects
                  </span>
                </div>
                <div className="p-3 bg-white/70 border border-stone-200 text-center">
                  <span className="block font-serif text-2xl font-light text-stone-900">27</span>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    Drafting Sheets
                  </span>
                </div>
                <div className="p-3 bg-white/70 border border-stone-200 text-center">
                  <span className="block font-serif text-2xl font-light text-stone-900">1:10</span>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    Joinery Scales
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#showcase"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 bg-stone-900 text-cream-50 text-xs uppercase tracking-super-wide hover:bg-stone-800 transition-all duration-200 shadow-sm"
                >
                  <span>Explore Portfolio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-stone-300 bg-white/80 backdrop-blur-sm text-stone-900 text-xs uppercase tracking-super-wide hover:border-stone-900 transition-colors shadow-sm"
                >
                  <span>Design Philosophy</span>
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 text-xs uppercase tracking-wider text-stone-600 hover:text-stone-950 transition-colors"
                >
                  <span>Inquiries</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Architectural Visual & Designer Photo Showcase */}
            <div className="lg:col-span-5 animate-fade-in">
              <div className="relative bg-white border border-stone-300 shadow-xl p-3 sm:p-4 rounded-sm">
                
                {/* Visual Selector Tabs */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 gap-1 text-[11px] font-mono uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('perspective')}
                      className={`px-2.5 py-1 transition-colors ${
                        activeHeroTab === 'perspective'
                          ? 'bg-stone-900 text-cream-50 font-medium'
                          : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Perspective
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('plan')}
                      className={`px-2.5 py-1 transition-colors ${
                        activeHeroTab === 'plan'
                          ? 'bg-stone-900 text-cream-50 font-medium'
                          : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Floor Plan
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroTab('profile')}
                      className={`px-2.5 py-1 flex items-center gap-1 transition-colors ${
                        activeHeroTab === 'profile'
                          ? 'bg-stone-900 text-cream-50 font-medium'
                          : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Camera className="w-3 h-3" />
                      <span>Photo</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-stone-400 hidden sm:inline-block">
                    Studio Showcase
                  </span>
                </div>

                {/* Display Frame */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden border border-stone-200 group">
                  {activeHeroTab === 'perspective' && (
                    <>
                      <img
                        src="/projects/kitchen/kitchen-perspective-views.webp"
                        alt="Modern Contemporary Kitchen Perspective"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                        <div className="text-white">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block">
                            Scale 1:10 • Hand-Drafted 3D Perspective
                          </span>
                          <h4 className="font-serif text-lg font-normal text-cream-100">
                            Modern Contemporary Kitchen
                          </h4>
                        </div>
                      </div>
                    </>
                  )}

                  {activeHeroTab === 'plan' && (
                    <>
                      <img
                        src="/projects/master-bedroom/master-bedroom-presentation-floor-plan.webp"
                        alt="Thematic Master Bedroom Presentation Plan"
                        className="w-full h-full object-contain p-2 bg-stone-50 transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-4">
                        <div className="text-white">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block">
                            Scale 1:15 • Full Color Presentation Plan
                          </span>
                          <h4 className="font-serif text-lg font-normal text-cream-100">
                            Thematic Master Bedroom Suite
                          </h4>
                        </div>
                      </div>
                    </>
                  )}

                  {activeHeroTab === 'profile' && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-cream-100 text-center space-y-4">
                      {designerPhoto ? (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-stone-800 shadow-md">
                          <img
                            src={designerPhoto}
                            alt="Urvi G Eragola"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-sand-200 border-2 border-stone-300 flex items-center justify-center text-stone-700">
                          <span className="font-serif text-3xl font-light">UE</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <h4 className="font-serif text-xl font-normal text-stone-900">
                          Urvi G Eragola
                        </h4>
                        <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
                          {designerConfig.institution}
                        </p>
                      </div>

                      {/* Photo Upload Trigger */}
                      <div>
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="hero-photo-upload"
                        />
                        <label
                          htmlFor="hero-photo-upload"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-cream-50 text-[11px] uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer shadow-sm"
                        >
                          <Camera className="w-3 h-3" />
                          <span>{photoUploading ? 'Saving...' : designerPhoto ? 'Change Photo' : 'Upload Designer Photo'}</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Floating Animated Badges */}
                  <div className="absolute top-3 right-3 animate-float pointer-events-none">
                    <span className="px-2.5 py-1 bg-stone-900/85 backdrop-blur-md text-cream-100 text-[10px] font-mono uppercase tracking-wider shadow-sm border border-stone-700/50">
                      27 Verified Sheets
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 animate-float-delayed pointer-events-none">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-stone-900 text-[10px] font-mono uppercase tracking-wider shadow-sm border border-stone-300/80">
                      FYBVOC 14 • Mumbai
                    </span>
                  </div>
                </div>

                {/* Bottom Frame Detail Bar */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                  <span className="flex items-center gap-1 text-stone-700">
                    <Layers className="w-3.5 h-3.5 text-stone-600" />
                    <span>Architectural Joinery & Detailing</span>
                  </span>
                  <Link
                    to="/projects"
                    className="text-stone-800 hover:text-stone-950 underline font-sans text-xs"
                  >
                    View Project Index →
                  </Link>
                </div>
              </div>
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
