import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  GraduationCap,
  Layers,
  CheckCircle2,
  MapPin,
  Clock,
  ExternalLink,
  Award,
} from 'lucide-react';
import { designerConfig } from '../config/designer';
import { usePageMeta } from '../hooks/usePageMeta';
import { useDesignerPhoto } from '../services/profileService';
import { AboutProfile } from '../types/about';
import { aboutService } from '../services/aboutService';

export const AboutPage: React.FC = () => {
  const { photo } = useDesignerPhoto();
  const [profile, setProfile] = useState<AboutProfile | null>(null);
  const [localTime, setLocalTime] = useState<string | null>(null);

  usePageMeta({
    title: 'About & Design Philosophy',
    description: `Academic background and interior design philosophy of ${profile?.fullName || designerConfig.fullName} at ${designerConfig.institution}, Mumbai.`,
  });

  // Load profile data & listen for live updates from admin edits
  useEffect(() => {
    let mounted = true;
    aboutService.getProfile().then((data) => {
      if (mounted) setProfile(data);
    });

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AboutProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      } else {
        aboutService.getProfile().then((data) => {
          if (mounted) setProfile(data);
        });
      }
    };

    window.addEventListener('portfolio_about_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('portfolio_about_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Compute local time if valid IANA timezone exists
  useEffect(() => {
    if (!profile?.location?.timezone) {
      setLocalTime(null);
      return;
    }

    try {
      const updateClock = () => {
        try {
          const formatter = new Intl.DateTimeFormat([], {
            timeZone: profile.location!.timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          setLocalTime(formatter.format(new Date()));
        } catch {
          setLocalTime(null);
        }
      };

      updateClock();
      const interval = setInterval(updateClock, 30000);
      return () => clearInterval(interval);
    } catch {
      setLocalTime(null);
    }
  }, [profile?.location?.timezone]);

  const sortedEducation = aboutService.getSortedEducationForPublic(profile?.education);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[clamp(2.5rem,4vw,4.5rem)] space-y-[clamp(2.5rem,4vw,4.5rem)] overflow-x-hidden">
      
      {/* Editorial Header (Clean Public View) */}
      <div className="border-b border-stone-200 pb-8 sm:pb-10 space-y-3 sm:space-y-4 max-w-4xl">
        <span className="text-xs uppercase tracking-[0.12em] text-stone-500 font-mono">
          Architectural Background & Vision
        </span>
        <h1 className="font-serif text-[clamp(2.5rem,4.5vw,4.25rem)] text-stone-900 font-light leading-[1.14]">
          Spatial intention, tactile materiality, and rigorous architectural drafting.
        </h1>
      </div>

      {/* Main Biography & Academic Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Biography, Philosophy & Dynamic Education */}
        <div className="lg:col-span-7 space-y-8 text-stone-700 leading-relaxed font-light text-base sm:text-lg">
          
          {/* Main Statement Box */}
          <div className="p-6 bg-sand-50/80 border-l-2 border-stone-800 space-y-3.5">
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-stone-500 font-semibold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-stone-700" />
              <span>Designer Biography</span>
            </span>

            <p className="text-stone-900 font-light">
              I am <strong className="font-semibold text-stone-950">{profile?.fullName || designerConfig.fullName}</strong>
              {profile?.headline ? ` — ${profile.headline}` : ''}.
            </p>

            <p className="text-sm text-stone-700 leading-relaxed font-light whitespace-pre-wrap break-words">
              {profile?.bio ||
                'My design work centers on the dialogue between functional daily living and sensory atmosphere. I believe that an interior space is an emotional container—shaped by natural textures, calculated lighting levels, and thoughtful joinery detailing.'}
            </p>

            {/* Location & Timezone Details (Only shown if location set) */}
            {profile?.location?.displayText && (
              <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-stone-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span className="break-words">
                    {profile.location.showExactLocation
                      ? profile.location.displayText
                      : `${profile.location.city || profile.location.displayText.split(',')[0].trim()}${
                          profile.location.country ? `, ${profile.location.country}` : ''
                        }`}
                  </span>
                </div>

                {/* Local Time Display (only if IANA timezone is valid) */}
                {localTime && (
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Local time: {localTime}</span>
                  </div>
                )}

                {/* Map Link (only if showExactLocation is true and coordinates exist) */}
                {profile.location.showExactLocation &&
                  profile.location.latitude !== undefined &&
                  profile.location.longitude !== undefined && (
                    <a
                      href={`https://www.google.com/maps?q=${profile.location.latitude},${profile.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-stone-800 hover:underline"
                    >
                      <span>View Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
              </div>
            )}
          </div>

          {/* Design Philosophy */}
          <div className="space-y-4 text-stone-700">
            <h2 className="font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] text-stone-900 font-light leading-[1.18]">
              Design Philosophy
            </h2>
            {designerConfig.designPhilosophy.map((para, idx) => (
              <p key={idx} className="text-sm sm:text-base font-light text-stone-700 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* DYNAMIC EDUCATION SECTION (Hides completely if no entries exist) */}
          {sortedEducation.length > 0 && (
            <div className="pt-6 space-y-6 border-t border-stone-200">
              <div>
                <span className="text-xs uppercase tracking-[0.12em] text-stone-500 font-mono block">
                  Academic Trajectory & Diplomas
                </span>
                <h2 className="font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] text-stone-900 font-light leading-[1.18] mt-1">
                  Education & Credentials
                </h2>
              </div>

              <div className="space-y-4">
                {sortedEducation.map((edu) => {
                  const yearsDisplay = edu.isOngoing
                    ? `${edu.startYear} – Present`
                    : `${edu.startYear} – ${edu.endYear || edu.startYear}`;

                  let formattedGrade = '';
                  if (edu.showGrade && edu.gradeValue) {
                    if (edu.gradeSystem === 'cgpa' || edu.gradeSystem === 'gpa') {
                      formattedGrade = `${edu.gradeSystem.toUpperCase()} ${edu.gradeValue}${
                        edu.gradeScale ? ` / ${edu.gradeScale}` : ''
                      }`;
                    } else if (edu.gradeSystem === 'percentage') {
                      formattedGrade = `${edu.gradeValue}%`;
                    } else {
                      formattedGrade = edu.gradeValue;
                    }
                  }

                  return (
                    <div
                      key={edu.id}
                      className="p-5 bg-sand-50/70 border border-stone-200 space-y-2 transition-transform hover:-translate-y-0.5 duration-200"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-stone-900 text-cream-50 font-mono text-[10px] uppercase tracking-wider">
                            {edu.level}
                          </span>
                          <h3 className="font-serif text-lg text-stone-900 font-medium break-words">
                            {edu.institution}
                          </h3>
                        </div>

                        <span className="text-xs font-mono text-stone-500">
                          {yearsDisplay}
                        </span>
                      </div>

                      {edu.program && (
                        <p className="text-xs sm:text-sm text-stone-700 font-light break-words">
                          {edu.program}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-stone-600 pt-1">
                        {edu.location && (
                          <span className="flex items-center gap-1 text-stone-500">
                            <MapPin className="w-3 h-3" />
                            <span>{edu.location}</span>
                          </span>
                        )}

                        {/* Grade line (Only shown when showGrade is true) */}
                        {formattedGrade && (
                          <span className="text-stone-800">
                            Standing: <strong className="font-semibold text-stone-950">{formattedGrade}</strong>
                          </span>
                        )}

                        {edu.honors && (
                          <span className="text-amber-800 font-light italic">
                            ★ {edu.honors}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Technical Proficiencies Breakdown */}
          <div className="pt-6 space-y-4 border-t border-stone-200">
            <h2 className="font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] text-stone-900 font-light leading-[1.18]">
              Technical Competencies & Studio Practices
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {designerConfig.technicalProficiencies.map((group, idx) => (
                <div key={idx} className="p-4 bg-sand-50 border border-stone-200 space-y-2">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-stone-900 font-semibold">
                    {group.category}
                  </h3>
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
            <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-stone-800 shadow-md bg-stone-200 flex items-center justify-center shrink-0">
              {photo ? (
                <img
                  src={photo}
                  alt={profile?.fullName || designerConfig.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-sand-200 text-stone-700 font-serif text-4xl font-light">
                  UE
                </div>
              )}
            </div>

            <div className="space-y-1 pt-1">
              <h2 className="font-serif text-2xl text-stone-900 font-medium">
                {profile?.fullName || designerConfig.fullName}
              </h2>
              <p className="text-xs uppercase font-mono tracking-wider text-stone-500">
                {designerConfig.academicClass} • Roll No: {designerConfig.rollNumber}
              </p>
              <p className="text-xs text-stone-600 font-light">
                {designerConfig.institution}
              </p>
              {profile?.location?.displayText && (
                <p className="text-[11px] font-mono text-stone-500 pt-1 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{profile.location.displayText}</span>
                </p>
              )}
            </div>
          </div>

          {/* Academic Foundation Quick Facts Card */}
          <div className="bg-sand-100/70 border border-stone-200 p-8 space-y-6">
            <h2 className="font-serif text-2xl text-stone-900 font-medium pb-3 border-b border-stone-300">
              Academic Foundation
            </h2>

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
                    Class {designerConfig.academicClass} • Roll No: {designerConfig.rollNumber} • {profile?.location?.displayText || designerConfig.location}
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

          {/* Project Catalog CTA */}
          <div className="p-6 bg-stone-900 text-cream-50 space-y-4">
            <h3 className="font-serif text-xl font-normal text-cream-100">
              Explore the Project Portfolio
            </h3>
            <p className="text-xs text-stone-400 font-light">
              Inspect the documented projects including hand-drafted execution blueprints, joinery cross-sections, and verified schedules.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-cream-100 border-b border-stone-600 pb-1 hover:border-cream-100 transition-colors"
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
