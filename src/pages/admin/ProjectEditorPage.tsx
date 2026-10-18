import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  AlertCircle,
  CheckCircle2,
  X,
  FileImage,
  Sparkles,
} from 'lucide-react';
import { Project, ProjectCategory, ProjectImage } from '../../types/project';
import { projectService } from '../../services/projectService';
import { uploadProjectImage } from '../../services/storageService';

export const ProjectEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('kitchen');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [conceptPhilosophy, setConceptPhilosophy] = useState('');
  const [sheetScale, setSheetScale] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([]);
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(1);

  // Status & UI State
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (!isEditing && (!slug || slug === generateSlug(title))) {
      setSlug(generateSlug(val));
    }
  };

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  // Load existing project if editing
  useEffect(() => {
    if (!id) return;

    const loadExisting = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const found = await projectService.getProjectById(id);
        if (!found) {
          setErrorMsg('Project not found.');
          return;
        }

        setTitle(found.title);
        setSlug(found.slug);
        setSubtitle(found.subtitle || '');
        setCategory(found.category);
        setShortDescription(found.shortDescription);
        setDescription(found.description);
        setConceptPhilosophy(found.conceptPhilosophy || '');
        setSheetScale(found.sheetScale || '');
        setCompletionDate(found.completionDate || '');
        setCoverImage(found.coverImage);
        setGalleryImages(found.galleryImages || []);
        setPublished(found.published);
        setFeatured(found.featured);
        setOrder(found.order);
      } catch (err: unknown) {
        setErrorMsg((err as Error).message || 'Failed to retrieve project details.');
      } finally {
        setLoading(false);
      }
    };

    loadExisting();
  }, [id]);

  // Handle Cover Image Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverUploading(true);
    setErrorMsg(null);
    try {
      const result = await uploadProjectImage(file, slug || 'cover');
      setCoverImage(result.url);
      setIsDirty(true);
      setSuccessMsg('Cover image uploaded successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Cover upload failed.');
    } finally {
      setCoverUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Handle Multiple Gallery Images Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGalleryUploading(true);
    setErrorMsg(null);
    try {
      const uploadPromises = Array.from(files).map((file, idx) =>
        uploadProjectImage(file, slug || 'gallery').then((res) => ({
          id: `sheet-${Date.now()}-${idx}`,
          url: res.url,
          title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          sheetType: 'render' as const,
          caption: 'Architectural drafting sheet presentation.',
          sourcePage: galleryImages.length + idx + 1,
        }))
      );

      const newSheets = await Promise.all(uploadPromises);
      setGalleryImages((prev) => [...prev, ...newSheets]);
      setIsDirty(true);
      setSuccessMsg(`Added ${newSheets.length} sheet(s) to gallery.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Gallery upload failed.');
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  // Gallery Sheet Controls
  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== index));
    setIsDirty(true);
  };

  const handleMoveSheet = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === galleryImages.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...galleryImages];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setGalleryImages(reordered);
    setIsDirty(true);
  };

  const handleUpdateSheet = (
    index: number,
    field: keyof ProjectImage,
    value: string | number
  ) => {
    setGalleryImages((prev) =>
      prev.map((img, idx) => (idx === index ? { ...img, [field]: value } : img))
    );
    setIsDirty(true);
  };

  // Save Project Handler
  const handleSave = async (publishImmediate = published) => {
    setErrorMsg(null);

    // Validation
    if (!title.trim()) {
      setErrorMsg('Please enter a project title.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Please enter a unique URL slug.');
      return;
    }
    if (!shortDescription.trim()) {
      setErrorMsg('Please enter a short project description.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter a comprehensive project description.');
      return;
    }
    if (!coverImage.trim()) {
      setErrorMsg('Please select or upload a cover image.');
      return;
    }

    // Slug uniqueness check
    const isUnique = await projectService.isSlugUnique(slug, id);
    if (!isUnique) {
      setErrorMsg(`The slug "${slug}" is already in use by another project.`);
      return;
    }

    setSaving(true);
    try {
      const payload: Omit<Project, 'id'> = {
        slug: slug.trim(),
        title: title.trim(),
        subtitle: subtitle.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        conceptPhilosophy: conceptPhilosophy.trim() || undefined,
        sheetScale: sheetScale.trim() || undefined,
        completionDate: completionDate.trim() || undefined,
        category,
        coverImage: coverImage.trim(),
        galleryImages,
        published: publishImmediate,
        featured,
        order: Number(order) || 1,
        sourcePdf: 'Custom Project (Admin Created)',
        institution: "Rachana Sansad's Academy of Architecture, Mumbai",
        academicClass: 'FYBVOC (Roll No: 14)',
      };

      if (isEditing && id) {
        await projectService.updateProject(id, payload);
        setSuccessMsg('Project updated successfully.');
      } else {
        await projectService.createProject(payload);
        setSuccessMsg('Project created successfully.');
      }

      setIsDirty(false);
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-stone-500 font-mono">
        Loading project editor...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="p-2 text-stone-600 hover:text-stone-900 border border-stone-300 bg-white"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-light">
              {isEditing ? `Edit: ${title || 'Project'}` : 'Create New Project'}
            </h1>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              {isEditing ? `ID: ${id}` : 'Drafting new architectural showcase'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-300 bg-white text-stone-700 text-xs uppercase tracking-wider hover:bg-stone-50"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-800 bg-white text-stone-900 text-xs uppercase tracking-wider hover:bg-stone-50 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 text-cream-50 text-xs uppercase tracking-wider hover:bg-stone-800 disabled:opacity-50 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{published ? 'Update & Publish' : 'Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isDirty && (
        <div className="p-3 bg-amber-50/80 border border-amber-200 text-[11px] font-mono text-amber-900 flex items-center justify-between">
          <span>You have unsaved changes in this project.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Details and Narrative */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Info Box */}
          <div className="bg-white p-6 border border-stone-200 shadow-sm space-y-5">
            <h2 className="font-serif text-xl text-stone-900 font-medium pb-2 border-b border-stone-100">
              Project Identity
            </h2>

            <div>
              <label htmlFor="proj-title" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                id="proj-title"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Minimalist Japanese Tea Pavilion"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:bg-white focus:border-stone-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="proj-slug" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 font-mono text-xs">
                    /
                  </span>
                  <input
                    id="proj-slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlug(generateSlug(e.target.value));
                      setIsDirty(true);
                    }}
                    placeholder="tea-pavilion-design"
                    className="w-full pl-6 pr-4 py-2 bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono focus:bg-white focus:border-stone-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="proj-cat" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="proj-cat"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as ProjectCategory);
                    setIsDirty(true);
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-stone-900 text-xs uppercase tracking-wider focus:bg-white focus:border-stone-800 focus:outline-none"
                >
                  <option value="kitchen">Kitchen Design</option>
                  <option value="bedroom">Master Bedroom</option>
                  <option value="kids">Kids Bedroom</option>
                  <option value="all">General Spatial</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="proj-subtitle" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                Subtitle / Architectural Tagline
              </label>
              <input
                id="proj-subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => {
                  setSubtitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="e.g. Natural Timber Joinery & Acoustic Planning"
                className="w-full px-4 py-2 bg-stone-50 border border-stone-300 text-stone-900 text-sm focus:bg-white focus:border-stone-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Narrative & Descriptions */}
          <div className="bg-white p-6 border border-stone-200 shadow-sm space-y-5">
            <h2 className="font-serif text-xl text-stone-900 font-medium pb-2 border-b border-stone-100">
              Editorial Descriptions
            </h2>

            <div>
              <label htmlFor="proj-short" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                Short Description (Cards & Teasers) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="proj-short"
                rows={2}
                required
                value={shortDescription}
                onChange={(e) => {
                  setShortDescription(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="One or two sentences highlighting the core concept and materials..."
                className="w-full px-4 py-2 bg-stone-50 border border-stone-300 text-stone-900 text-xs leading-relaxed focus:bg-white focus:border-stone-800 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="proj-full" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                Full Project Narrative <span className="text-red-500">*</span>
              </label>
              <textarea
                id="proj-full"
                rows={5}
                required
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Comprehensive architectural description detailing spatial zoning, human ergonomics, materials, and drafting..."
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 text-stone-900 text-xs leading-relaxed focus:bg-white focus:border-stone-800 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="proj-concept" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                Atmospheric & Concept Philosophy
              </label>
              <textarea
                id="proj-concept"
                rows={3}
                value={conceptPhilosophy}
                onChange={(e) => {
                  setConceptPhilosophy(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Conceptual intent, lighting psychology, color palette rationale..."
                className="w-full px-4 py-2 bg-stone-50 border border-stone-300 text-stone-900 text-xs leading-relaxed focus:bg-white focus:border-stone-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="proj-scale" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                  Drafting Scales
                </label>
                <input
                  id="proj-scale"
                  type="text"
                  value={sheetScale}
                  onChange={(e) => {
                    setSheetScale(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="e.g. 1:10 (Plan) / 1:2 (Joinery)"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-300 text-stone-900 text-xs font-mono focus:bg-white focus:border-stone-800 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="proj-date" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                  Academic Term / Completion Date
                </label>
                <input
                  id="proj-date"
                  type="text"
                  value={completionDate}
                  onChange={(e) => {
                    setCompletionDate(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="e.g. Academic Year 2026"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-300 text-stone-900 text-xs focus:bg-white focus:border-stone-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Gallery Sheets Section */}
          <div className="bg-white p-6 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
              <div>
                <h2 className="font-serif text-xl text-stone-900 font-medium">
                  Architectural Drawing Gallery ({galleryImages.length} Sheets)
                </h2>
                <p className="text-xs text-stone-500 font-light">
                  Upload plans, elevations, sections, and schedules. Drag or click up/down to order sheets.
                </p>
              </div>

              <div>
                <input
                  ref={galleryInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleGalleryUpload}
                  className="hidden"
                  id="gallery-file-input"
                />
                <label
                  htmlFor="gallery-file-input"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 bg-stone-800 text-cream-50 text-xs uppercase tracking-wider hover:bg-stone-900 cursor-pointer ${
                    galleryUploading ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{galleryUploading ? 'Uploading...' : 'Upload Sheets'}</span>
                </label>
              </div>
            </div>

            {/* Gallery Images List */}
            {galleryImages.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-stone-300 p-6 space-y-2">
                <FileImage className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs text-stone-600">No gallery sheets attached yet.</p>
                <p className="text-[11px] text-stone-400">
                  Upload PDF renders, CAD drawings, or material boards (JPEG, PNG, WebP up to 5MB).
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {galleryImages.map((sheet, index) => (
                  <div
                    key={sheet.id || index}
                    className="p-4 bg-stone-50 border border-stone-200 flex flex-col sm:flex-row gap-4 items-start"
                  >
                    {/* Sheet Thumbnail */}
                    <div className="w-28 sm:w-36 aspect-[16/11] bg-stone-200 border border-stone-300 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={sheet.url}
                        alt={sheet.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Sheet Form Fields */}
                    <div className="flex-grow space-y-3 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-8">
                          <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-mono mb-1">
                            Sheet Title
                          </label>
                          <input
                            type="text"
                            value={sheet.title}
                            onChange={(e) =>
                              handleUpdateSheet(index, 'title', e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-mono mb-1">
                            Sheet Type
                          </label>
                          <select
                            value={sheet.sheetType}
                            onChange={(e) =>
                              handleUpdateSheet(index, 'sheetType', e.target.value)
                            }
                            className="w-full px-2 py-1.5 bg-white border border-stone-300 text-xs uppercase tracking-wider text-stone-800 focus:outline-none"
                          >
                            <option value="render">Render</option>
                            <option value="plan">Plan</option>
                            <option value="elevation">Elevation</option>
                            <option value="detail">Detail</option>
                            <option value="schedule">Schedule</option>
                            <option value="material-board">Material Board</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-stone-500 font-mono mb-1">
                          Caption / Annotation
                        </label>
                        <input
                          type="text"
                          value={sheet.caption}
                          onChange={(e) =>
                            handleUpdateSheet(index, 'caption', e.target.value)
                          }
                          placeholder="Brief technical or spatial description..."
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                        />
                      </div>
                    </div>

                    {/* Sheet Controls */}
                    <div className="flex sm:flex-col gap-1 items-center justify-end self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveSheet(index, 'up')}
                        disabled={index === 0}
                        aria-label="Move sheet earlier"
                        className="p-1.5 text-stone-500 hover:text-stone-900 disabled:opacity-20"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono text-stone-400">
                        {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMoveSheet(index, 'down')}
                        disabled={index === galleryImages.length - 1}
                        aria-label="Move sheet later"
                        className="p-1.5 text-stone-500 hover:text-stone-900 disabled:opacity-20"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="p-1.5 text-stone-400 hover:text-red-700 transition-colors ml-2 sm:ml-0"
                        title="Remove sheet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Settings & Cover Image */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication Box */}
          <div className="bg-white p-6 border border-stone-200 shadow-sm space-y-5">
            <h3 className="font-serif text-lg text-stone-900 font-medium pb-2 border-b border-stone-100">
              Visibility & Ordering
            </h3>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => {
                    setPublished(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-600"
                />
                <div>
                  <span className="text-xs font-semibold text-stone-900 block">
                    Published Live
                  </span>
                  <span className="text-[11px] text-stone-500 block leading-tight">
                    When checked, this project is publicly visible in the portfolio gallery.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => {
                    setFeatured(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-600"
                />
                <div>
                  <span className="text-xs font-semibold text-stone-900 block">
                    Homepage Featured
                  </span>
                  <span className="text-[11px] text-stone-500 block leading-tight">
                    Feature prominently in the curated overview showcase.
                  </span>
                </div>
              </label>

              <div>
                <label htmlFor="proj-order" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1">
                  Display Sort Order
                </label>
                <input
                  id="proj-order"
                  type="number"
                  min={1}
                  value={order}
                  onChange={(e) => {
                    setOrder(parseInt(e.target.value, 10) || 1);
                    setIsDirty(true);
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Cover Image Box */}
          <div className="bg-white p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg text-stone-900 font-medium pb-2 border-b border-stone-100">
              Cover Image <span className="text-red-500">*</span>
            </h3>

            {coverImage ? (
              <div className="space-y-3">
                <div className="aspect-[16/10] bg-stone-100 border border-stone-300 overflow-hidden relative group">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label
                      htmlFor="cover-file-input"
                      className="px-3 py-1.5 bg-white text-stone-900 text-[11px] uppercase tracking-wider cursor-pointer hover:bg-cream-100"
                    >
                      Replace
                    </label>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-stone-500 truncate">
                  {coverImage}
                </div>
              </div>
            ) : (
              <div className="aspect-[16/10] bg-stone-50 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center p-4 text-center space-y-2">
                <FileImage className="w-8 h-8 text-stone-400" />
                <span className="text-xs text-stone-600">No cover image selected</span>
                <span className="text-[10px] text-stone-400">
                  Recommended size: 1600x1000px WebP or JPEG
                </span>
              </div>
            )}

            <div className="space-y-2">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverUpload}
                className="hidden"
                id="cover-file-input"
              />
              <label
                htmlFor="cover-file-input"
                className={`w-full flex items-center justify-center gap-1.5 py-2.5 bg-stone-900 text-cream-50 text-xs uppercase tracking-wider hover:bg-stone-800 cursor-pointer ${
                  coverUploading ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{coverUploading ? 'Uploading Cover...' : 'Upload Cover Image'}</span>
              </label>

              <div className="pt-2 border-t border-stone-100">
                <label htmlFor="cover-url-input" className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                  Or direct image path / URL
                </label>
                <input
                  id="cover-url-input"
                  type="text"
                  value={coverImage}
                  onChange={(e) => {
                    setCoverImage(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="/projects/kitchen/kitchen-sheet-01.webp"
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 text-xs font-mono text-stone-800 focus:bg-white focus:outline-none focus:border-stone-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm"
        >
          <div className="bg-cream-50 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-stone-300 shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-stone-900 text-cream-100 px-6 py-3.5 flex items-center justify-between border-b border-stone-800 z-10">
              <span className="text-xs uppercase tracking-super-wide font-mono">
                Live Public Site Simulation Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest px-2.5 py-0.5 bg-stone-900 text-cream-100 font-mono">
                  {category}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light">
                  {title || 'Untitled Project'}
                </h1>
                {subtitle && (
                  <p className="text-stone-500 uppercase tracking-widest text-xs italic">
                    {subtitle}
                  </p>
                )}
                <p className="text-stone-700 text-sm font-light leading-relaxed max-w-2xl">
                  {description || 'No description provided.'}
                </p>
              </div>

              {coverImage && (
                <div className="aspect-[16/10] bg-stone-900 overflow-hidden">
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {galleryImages.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-stone-200">
                  <h3 className="font-serif text-2xl text-stone-900 font-normal">
                    Gallery Sheets ({galleryImages.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="border border-stone-200 bg-white p-2">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="aspect-[16/11] object-contain w-full bg-stone-100"
                        />
                        <div className="mt-2 text-xs font-serif text-stone-900">
                          {img.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
