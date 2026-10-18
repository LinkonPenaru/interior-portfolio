import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, GraduationCap, Layers, CheckCircle2, Camera } from 'lucide-react';
import { designerConfig } from '../config/designer';
import { usePageMeta } from '../hooks/usePageMeta';
import { useDesignerPhoto } from '../services/profileService';

export const AboutPage: React.FC = () => {
  const { photo, uploadPhoto } = useDesignerPhoto();
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  usePageMeta({
    title: 'About & Design Philosophy',
    description: `Academic background and interior design philosophy of Urvi G Eragola at ${designerConfig.institution}, Mumbai.`,
  });

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      await uploadPhoto(file);
    } catch (err) {
      console.warn('Failed to upload photo:', err);
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

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
              Designer Biography
            </span>
            <p className="text-stone-800">
              I am <strong className="font-semibold text-stone-950">{designerConfig.fullName}</strong>, an interior design practitioner enrolled in the {designerConfig.academicCredential} at <strong>{designerConfig.institution}</strong> in {designerConfig.institutionLocation}.
            </p>
            <p className="text-sm text-stone-600">
              My design work centers on the dialogue between functional daily living and sensory atmosphere. I believe that an interior space is an emotional container—shaped by natural textures, calculated lighting levels, and thoughtful joinery detailing.
            </p>
          </div>

          <div className="space-y-4 text-stone-700">
            <h3 className="font-serif text-2xl text-stone-900 font-medium">Design Philosophy</h3>
            {designerConfig.bioParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Technical Proficiencies Breakdown */}
          <div className="pt-4 space-y-4">
            <h3 className="font-serif text-2xl text-stone-900 font-medium">
              Technical Competencies & Studio Practices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {designerConfig.technicalProficiencies.map((group, idx) => (
                <div key={idx} className="p-4 bg-sand-50 border border-stone-200 space-y-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-stone-900 font-semibold">
                    {group.category}
                  </h4>
                  <ul className="space-y-1 text-xs text-stone-600 font-light">
                    {group.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Academic & Technical Facts with Designer Photo Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Designer Portrait Card */}
          <div className="bg-sand-50/90 border border-stone-200 p-8 space-y-4 text-center flex flex-col items-center shadow-sm">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-stone-800 shadow-md bg-stone-200 flex items-center justify-center group transition-transform hover:scale-105">
              {photo ? (
                <img
                  src={photo}
                  alt={designerConfig.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-sand-200 text-stone-700 font-serif text-4xl font-light">
                  UE
                </div>
              )}
              {/* Photo upload on hover */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
                id="about-designer-photo-input"
              />
              <label
                htmlFor="about-designer-photo-input"
                title="Click to Upload / Change Designer Photo"
                className="absolute inset-0 rounded-full bg-stone-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-cream-50 text-[10px] uppercase font-mono tracking-wider cursor-pointer text-center p-2 shadow-md"
              >
                <Camera className="w-5 h-5 mb-1" />
                <span>{photoUploading ? 'Saving...' : photo ? 'Change' : 'Upload Photo'}</span>
              </label>
            </div>

            <div className="space-y-1 pt-1">
              <h3 className="font-serif text-2xl text-stone-900 font-medium">
                {designerConfig.fullName}
              </h3>
              <p className="text-xs uppercase font-mono tracking-wider text-stone-500">
                {designerConfig.academicClass} • Roll No: {designerConfig.rollNumber}
              </p>
              <p className="text-xs text-stone-600 font-light">
                {designerConfig.institution}
              </p>
            </div>
          </div>

          <div className="bg-sand-100/70 border border-stone-200 p-8 space-y-6">
            <h3 className="font-serif text-2xl text-stone-900 font-medium pb-3 border-b border-stone-300">
              Academic Foundation
            </h3>

            <div className="space-y-5 text-sm text-stone-800">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-stone-900">
                    {designerConfig.academicCredential}
                  </span>
                  <span className="text-stone-600 text-xs block">
                    {designerConfig.institution}
                  </span>
                  <span className="text-stone-500 text-xs block font-mono">
                    Class {designerConfig.academicClass} • Roll No: {designerConfig.rollNumber} • {designerConfig.location}
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
