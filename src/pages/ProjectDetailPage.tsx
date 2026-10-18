import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Calendar,
  Building,
  Ruler,
  FileText,
  AlertCircle,
  Layers,
  ShoppingBag,
  Palette,
} from 'lucide-react';
import { Project } from '../types/project';
import { projectService } from '../services/projectService';
import { Lightbox } from '../components/ui/Lightbox';
import { NotFoundPage } from './NotFoundPage';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [adjacent, setAdjacent] = useState<{ prev: Project | null; next: Project | null }>({
    prev: null,
    next: null,
  });
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    const loadProject = async () => {
      setLoading(true);
      try {
        const found = await projectService.getProjectBySlug(slug);
        setProject(found);
        if (found) {
          const adj = await projectService.getAdjacentProjects(slug);
          setAdjacent(adj);
        }
      } catch (err) {
        console.error('Failed to load project details', err);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-stone-500 font-mono text-sm">
        Retrieving verified architectural project data...
      </div>
    );
  }

  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <div className="pb-28">
      {/* Top Back Navigation */}
      <div className="border-b border-stone-200 bg-cream-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-super-wide text-stone-600 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <section className="pt-12 sm:pt-16 pb-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-super-wide px-3 py-1 bg-stone-900 text-cream-100 font-medium">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  {project.galleryImages.length} Technical Sheets
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-stone-900 font-light tracking-tight">
                {project.title}
              </h1>

              <p className="text-stone-500 uppercase tracking-widest text-xs sm:text-sm italic font-medium">
                {project.subtitle}
              </p>

              <p className="text-stone-700 text-base sm:text-lg font-light leading-relaxed pt-2 max-w-3xl">
                {project.description}
              </p>
            </div>

            {/* Verified Project Metadata Card */}
            <div className="lg:col-span-4 bg-sand-100/70 border border-stone-200 p-6 space-y-4 text-xs">
              <h3 className="uppercase tracking-super-wide text-stone-900 font-semibold font-mono pb-2 border-b border-stone-300">
                Verified Sheet Metadata
              </h3>

              <div className="space-y-3 text-stone-700">
                <div className="flex items-start gap-2.5">
                  <Building className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-stone-500 text-[10px] uppercase tracking-wider">Institution</span>
                    <span className="font-medium">{project.institution}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-stone-500 text-[10px] uppercase tracking-wider">Source Document</span>
                    <span className="font-mono text-stone-800">{project.sourcePdf}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Ruler className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-stone-500 text-[10px] uppercase tracking-wider">Drafting Scales</span>
                    <span>{project.sheetScale || 'Awaiting scale verification'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-stone-500 text-[10px] uppercase tracking-wider">Academic Term</span>
                    <span>{project.completionDate || '2025 – 2026'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="relative bg-stone-900 overflow-hidden border border-stone-200 group cursor-pointer"
          onClick={() => setLightboxIndex(0)}
          title="Click to zoom sheet in high-resolution viewer"
        >
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-auto max-h-[75vh] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute bottom-4 right-4 bg-stone-900/90 backdrop-blur-sm text-cream-50 text-xs px-3 py-1.5 flex items-center gap-1.5 uppercase tracking-wider">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Click to Expand Sheet</span>
          </div>
        </div>
      </section>

      {/* Concept & Color Palette Section (when supported) */}
      {(project.conceptPhilosophy || project.colorPalette) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-stone-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-super-wide text-stone-500 font-mono">
                <Palette className="w-4 h-4 text-stone-700" />
                <span>Design Concept & Atmospheric Intent</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-light">
                Materiality & Space Dynamics
              </h2>
              <p className="text-stone-700 text-sm sm:text-base font-light leading-relaxed">
                {project.conceptPhilosophy}
              </p>
            </div>

            {/* Color Palette Swatches */}
            {project.colorPalette && (
              <div className="lg:col-span-6 space-y-4">
                <span className="block text-xs uppercase tracking-super-wide text-stone-500 font-mono">
                  Verified Color & Texture Palette
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.colorPalette.map((palette, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-cream-50 border border-stone-200 flex items-center gap-4"
                    >
                      <div
                        className="w-12 h-12 rounded-none border border-stone-300 shrink-0 shadow-sm"
                        style={{ backgroundColor: palette.colorCode }}
                        aria-hidden="true"
                      />
                      <div className="space-y-0.5">
                        <span className="font-serif text-base text-stone-900 font-medium block">
                          {palette.name}
                        </span>
                        {palette.description && (
                          <span className="text-[11px] text-stone-500 font-light block leading-tight">
                            {palette.description}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Complete Technical Sheet Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-super-wide text-stone-500 font-mono">
              <Layers className="w-4 h-4 text-stone-700" />
              <span>Technical Documentation</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light mt-1">
              Architectural Drawings & Layouts
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Click any sheet to inspect millimeter dimensions and annotations in detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.galleryImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className="group bg-cream-50 border border-stone-200 hover:border-stone-400 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[16/11] bg-stone-100 overflow-hidden flex items-center justify-center">
                <img
                  src={img.url}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-stone-900/85 text-cream-100 tracking-wider">
                    {img.sheetType}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-cream-50 text-[11px] px-2.5 py-1 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  <span>Inspect</span>
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span>Sheet {idx + 1} of {project.galleryImages.length}</span>
                    <span>Page {img.sourcePage}</span>
                  </div>
                  <h4 className="font-serif text-lg text-stone-900 font-medium mt-1 group-hover:text-stone-700 transition-colors">
                    {img.title}
                  </h4>
                  <p className="text-xs text-stone-600 font-light mt-1 leading-relaxed">
                    {img.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Itemized Specification Schedule (when supported by PDF) */}
      {project.appliances && project.appliances.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-stone-200">
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-super-wide text-stone-500 font-mono">
              <ShoppingBag className="w-4 h-4 text-stone-700" />
              <span>Specification Schedule</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-light">
              Verified Fixtures & Appliances
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              Exact manufacturers, model codes, dimensions, and estimated market rates from the source technical sheet.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto border border-stone-200 bg-cream-50">
            <table className="w-full text-left text-xs sm:text-sm text-stone-800">
              <thead className="bg-sand-100/90 text-stone-700 uppercase tracking-wider text-[11px] font-mono border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Brand / Manufacturer</th>
                  <th className="py-3 px-4">Model / Ref</th>
                  <th className="py-3 px-4">Dimensions / Rating</th>
                  <th className="py-3 px-4 text-right">Estimated Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80 font-light">
                {project.appliances.map((item, idx) => (
                  <tr key={idx} className="hover:bg-sand-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-900">{item.item}</td>
                    <td className="py-3 px-4">{item.brand}</td>
                    <td className="py-3 px-4 font-mono text-stone-600">{item.model || '—'}</td>
                    <td className="py-3 px-4 text-stone-600">{item.dimensions || '—'}</td>
                    <td className="py-3 px-4 text-right font-mono text-stone-800">{item.price || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Awaiting Designer Input Section */}
      {project.pendingDesignerNotes && project.pendingDesignerNotes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="p-6 bg-amber-50/60 border border-amber-200/80 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-super-wide font-mono text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Awaiting Designer Input</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed font-light">
              To preserve authentic documentation, the following details are not fabricated and await the designer&apos;s direct input:
            </p>
            <ul className="list-disc list-inside text-xs text-amber-950 space-y-1 font-light pt-1">
              {project.pendingDesignerNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Previous / Next Project Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-stone-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {adjacent.prev && (
            <Link
              to={`/projects/${adjacent.prev.slug}`}
              className="p-6 bg-cream-50 border border-stone-200 hover:border-stone-500 transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-stone-500 mb-2">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Previous Project</span>
              </div>
              <h4 className="font-serif text-xl text-stone-900 group-hover:text-stone-700 font-normal">
                {adjacent.prev.title}
              </h4>
            </Link>
          )}

          {adjacent.next && (
            <Link
              to={`/projects/${adjacent.next.slug}`}
              className="p-6 bg-cream-50 border border-stone-200 hover:border-stone-500 transition-all group flex flex-col justify-between text-right"
            >
              <div className="flex items-center justify-end gap-2 text-[11px] uppercase tracking-wider text-stone-500 mb-2">
                <span>Next Project</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-serif text-xl text-stone-900 group-hover:text-stone-700 font-normal">
                {adjacent.next.title}
              </h4>
            </Link>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        images={project.galleryImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </div>
  );
};
