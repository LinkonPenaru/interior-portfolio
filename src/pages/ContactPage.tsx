import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Clock, MessageSquare, ExternalLink } from 'lucide-react';
import { designerConfig } from '../config/designer';
import { usePageMeta } from '../hooks/usePageMeta';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Residential Interior Design',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);

  usePageMeta({
    title: 'Inquiries & Contact',
    description: `Connect with interior designer Urvi G Eragola (${designerConfig.institution}, Mumbai) for residential spatial design, technical drafting, and joinery consultation.`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    setTimeout(() => {
      setSubmittedData({ ...formData });
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        projectType: 'Residential Interior Design',
        message: '',
      });
    }, 400);
  };

  const getMailtoLink = () => {
    if (!submittedData) return `mailto:${designerConfig.contactEmail}`;
    const subject = encodeURIComponent(`[Portfolio Inquiry] ${submittedData.projectType} — from ${submittedData.name}`);
    const body = encodeURIComponent(
      `Hi ${designerConfig.shortName},\n\n` +
      `Name: ${submittedData.name}\n` +
      `Email: ${submittedData.email}\n` +
      `Inquiry Topic: ${submittedData.projectType}\n\n` +
      `Message:\n${submittedData.message}\n`
    );
    return `mailto:${designerConfig.contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 pb-28">
      {/* Header */}
      <div className="border-b border-stone-200 pb-10 space-y-4 max-w-3xl">
        <span className="text-xs uppercase tracking-super-wide text-stone-500 font-mono">
          Inquiries & Professional Collaboration
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-light">
          Get in Touch
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
          Open to interior architecture opportunities, studio internships, technical CAD drafting assignments, and residential spatial planning collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-cream-50 border border-stone-200 p-8 sm:p-10">
          <h2 className="font-serif text-2xl text-stone-900 font-medium mb-6">
            Send an Inquiry
          </h2>

          {status === 'success' && submittedData ? (
            <div className="p-6 bg-stone-100 border border-stone-300 text-stone-900 space-y-4">
              <div className="flex items-center gap-2 text-stone-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>Inquiry Prepared</span>
              </div>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                Thank you, <strong className="text-stone-900">{submittedData.name}</strong>. Your note regarding <em>{submittedData.projectType}</em> has been composed. Click below to deliver it via your default mail client, or copy the details to reach {designerConfig.shortName} directly.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={getMailtoLink()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-cream-50 text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send via Email Client</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="px-4 py-2.5 border border-stone-300 text-stone-700 text-xs uppercase tracking-wider hover:bg-stone-200 transition-colors"
                >
                  Compose Another Note
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="inquiry-name" className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                  Your Full Name <span className="text-stone-400">*</span>
                </label>
                <input
                  id="inquiry-name"
                  type="text"
                  required
                  placeholder="e.g. Architect / Client Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-900 text-sm focus:border-stone-800 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="inquiry-email" className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                  Your Email Address <span className="text-stone-400">*</span>
                </label>
                <input
                  id="inquiry-email"
                  type="email"
                  required
                  placeholder="name@studio.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-900 text-sm focus:border-stone-800 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="inquiry-topic" className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                  Inquiry Topic
                </label>
                <select
                  id="inquiry-topic"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-900 text-sm focus:border-stone-800 focus:outline-none transition-colors"
                >
                  <option value="Residential Interior Design">Residential Interior Design</option>
                  <option value="Kitchen Architecture & Joinery">Kitchen Architecture & Joinery</option>
                  <option value="Technical CAD Drafting">Technical CAD Drafting / Section Details</option>
                  <option value="Studio Internship / Role">Studio Internship / Hiring</option>
                  <option value="General Spatial Consultation">General Spatial Consultation</option>
                </select>
              </div>

              <div>
                <label htmlFor="inquiry-message" className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                  Message Details <span className="text-stone-400">*</span>
                </label>
                <textarea
                  id="inquiry-message"
                  required
                  rows={5}
                  placeholder="Describe your project, spatial scope, or timeline..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-900 text-sm focus:border-stone-800 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 text-cream-50 text-xs uppercase tracking-super-wide hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{status === 'submitting' ? 'Preparing Note...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Channels & Academic Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-sand-100/70 border border-stone-200 p-8 space-y-6">
            <h3 className="font-serif text-2xl text-stone-900 font-medium pb-2 border-b border-stone-300">
              Direct Contact
            </h3>

            <div className="space-y-5 text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-stone-600 shrink-0 mt-1" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-mono">Location & Practice</span>
                  <span className="text-stone-900 font-medium">{designerConfig.location}</span>
                  <span className="text-xs text-stone-500 block">{designerConfig.institution}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-stone-600 shrink-0 mt-1" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-mono">Response Window</span>
                  <span className="text-stone-900 font-medium">Within 24 to 48 hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-stone-600 shrink-0 mt-1" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-mono">Direct Email</span>
                  <a
                    href={`mailto:${designerConfig.contactEmail}`}
                    className="text-stone-900 font-mono text-xs hover:underline"
                  >
                    {designerConfig.contactEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Profile Card */}
          <div className="p-6 bg-cream-50 border border-stone-200 text-xs text-stone-600 space-y-2">
            <div className="flex items-center gap-2 text-stone-800 font-semibold uppercase tracking-wider font-mono">
              <MessageSquare className="w-4 h-4 text-stone-700" />
              <span>Studio & Portfolio Notice</span>
            </div>
            <p className="font-light leading-relaxed">
              This portfolio represents academic studio work completed at {designerConfig.institution}. All drawing scales, material schedules, and appliance specifications reflect verified drafting sheet submissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
