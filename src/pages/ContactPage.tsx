import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Residential Design',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        projectType: 'Residential Design',
        message: '',
      });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 pb-28">
      {/* Header */}
      <div className="border-b border-stone-200 pb-10 space-y-4 max-w-3xl">
        <span className="text-xs uppercase tracking-super-wide text-stone-500 font-mono">
          Inquiries & Collaboration
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-light">
          Get in Touch
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
          Open to interior architecture internships, technical drafting assignments, and residential spatial planning collaborations. Leave a message below to connect.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-cream-50 border border-stone-200 p-8 sm:p-10">
          <h2 className="font-serif text-2xl text-stone-900 font-medium mb-6">
            Send an Inquiry
          </h2>

          {status === 'success' ? (
            <div className="p-6 bg-stone-100 border border-stone-300 text-stone-900 space-y-3">
              <div className="flex items-center gap-2 text-stone-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-stone-700" />
                <span>Message Received</span>
              </div>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                Thank you for reaching out. In this Phase 1 preview, inquiry submissions are handled locally. In Phase 2, messages will be delivered directly to the designer&apos;s Supabase inbox.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-2 text-xs uppercase tracking-wider underline text-stone-800 hover:text-stone-950"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                  Your Full Name <span className="text-stone-400">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-900 text-sm focus:border-stone-800 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                  Your Email Address <span className="text-stone-400">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-900 text-sm focus:border-stone-800 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                  Inquiry Topic
                </label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-900 text-sm focus:border-stone-800 focus:outline-none transition-colors"
                >
                  <option value="Residential Design">Residential Interior Design</option>
                  <option value="Kitchen Architecture">Kitchen & Joinery Planning</option>
                  <option value="Technical Drafting">Technical Drafting / CAD Consultation</option>
                  <option value="Internship / Studio Role">Studio Internship / Hiring</option>
                  <option value="Other">General Inquiries</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                  Message <span className="text-stone-400">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Share project details, room dimensions, or collaborative opportunities..."
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
                <span>{status === 'submitting' ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Channels & Academic Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-sand-100/70 border border-stone-200 p-8 space-y-6">
            <h3 className="font-serif text-2xl text-stone-900 font-medium pb-2 border-b border-stone-300">
              Professional Details
            </h3>

            <div className="space-y-4 text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-mono">Location</span>
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-mono">Response Window</span>
                  <span>Typically within 24 to 48 hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-stone-500 font-mono">Email Inquiries</span>
                  <span className="text-stone-500 italic font-mono text-xs">
                    (Contact placeholder awaiting designer email configuration)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Editable Placeholder Notice */}
          <div className="p-6 bg-cream-50 border border-stone-200 text-xs text-stone-600 space-y-2">
            <div className="flex items-center gap-2 text-stone-800 font-semibold uppercase tracking-wider font-mono">
              <AlertCircle className="w-4 h-4 text-stone-600" />
              <span>Privacy & Contact Placeholder</span>
            </div>
            <p className="font-light leading-relaxed">
              In accordance with project guidelines, personal phone numbers and private email addresses are intentionally withheld in this public portfolio build. In Phase 2, the designer can configure authenticated contact endpoints via Supabase without touching code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
