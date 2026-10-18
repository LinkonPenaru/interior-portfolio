import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, GraduationCap, Award, BookOpen, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20 pb-28">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-12 space-y-4 max-w-4xl">
        <span className="text-xs uppercase tracking-super-wide text-stone-500 font-mono">
          Architectural Background & Vision
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-stone-900 font-light leading-tight">
          Spatial intention, tactile materiality, and rigorous architectural drafting.
        </h1>
      </div>

      {/* Main Biography & Academic Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Bio */}
        <div className="lg:col-span-7 space-y-8 text-stone-700 leading-relaxed font-light text-base sm:text-lg">
          <div className="p-6 bg-sand-50/80 border-l-2 border-stone-800 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-extra-wide text-stone-500 block">
              Designer Biography (Editable Placeholder)
            </span>
            <p className="text-stone-800">
              I am <strong className="font-semibold text-stone-950">Urvi G Eragola</strong>, an interior design practitioner enrolled in the Bachelor of Vocational Studies (B. Voc. Interior Design) at <strong>Rachana Sansad&apos;s Academy of Architecture</strong> in Mumbai, Maharashtra.
            </p>
            <p className="text-sm text-stone-600">
              My design work centers on the dialogue between functional daily living and sensory atmosphere. I believe that an interior space is an emotional container—shaped by natural textures, calculated lighting levels, and thoughtful joinery detailing.
            </p>
          </div>

          <div className="space-y-4 text-stone-700">
            <h3 className="font-serif text-2xl text-stone-900 font-medium">Design Philosophy</h3>
            <p>
              In my academic studio projects at Rachana Sansad, I prioritize foundational hand drafting and physical spatial awareness before digital execution. Drawing plans, elevations, sections, and electrical loops manually builds an intimate understanding of scale, clearance tolerances, and structural junctions.
            </p>
            <p>
              Whether crafting a contemporary olive-and-copper kitchen, an intense theatrical master suite, or a joyful cloud-inspired bedroom for a child, my focus remains constant: human comfort, functional efficiency, and honest materiality.
            </p>
          </div>

          {/* Designer Input Notice */}
          <div className="p-4 bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-1 font-mono">
            <p className="font-semibold text-stone-800 uppercase tracking-wider">
              [Editable Section Awaiting Designer Confirmation]
            </p>
            <p className="font-sans text-stone-600">
              This biography section can be customized directly by Urvi via the Phase 2 admin dashboard to add personal awards, internship histories, or software proficiencies.
            </p>
          </div>
        </div>

        {/* Right Academic & Technical Facts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-sand-100/70 border border-stone-200 p-8 space-y-6">
            <h3 className="font-serif text-2xl text-stone-900 font-medium pb-3 border-b border-stone-300">
              Academic Foundation
            </h3>

            <div className="space-y-4 text-sm text-stone-800">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-900">
                    B. Voc. (Interior Design)
                  </span>
                  <span className="text-stone-600 text-xs block">
                    Rachana Sansad&apos;s Academy of Architecture
                  </span>
                  <span className="text-stone-500 text-xs block">
                    Class FYBVOC • Roll No: 14 • Mumbai, India
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-900">
                    Drafting & Technical Drawing
                  </span>
                  <span className="text-stone-600 text-xs block">
                    Scales 1:2, 1:10, 1:15, 1:20, 1:25
                  </span>
                  <span className="text-stone-500 text-xs block">
                    Joinery details, false ceiling plans, electrical looping
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Layers className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-900">
                    Material Specification
                  </span>
                  <span className="text-stone-600 text-xs block">
                    Natural stones, timbers, ceramics, acoustics
                  </span>
                  <span className="text-stone-500 text-xs block">
                    Kohler, Jaquar, Amtico, Samsung, KitchenAid
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-stone-900 text-cream-50 space-y-4">
            <h4 className="font-serif text-xl font-normal text-cream-100">
              Explore the Project Portfolio
            </h4>
            <p className="text-xs text-stone-400 font-light">
              Inspect the three documented projects: Modern Contemporary Kitchen, Thematic Master Bedroom, and A Sky Bedroom.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-super-wide text-cream-100 border-b border-stone-600 pb-1 hover:border-cream-100 transition-colors"
            >
              <span>Go to Project Index</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
