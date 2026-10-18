import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  AlertTriangle,
  FolderOpen,
  CheckCircle,
  ExternalLink,
  Camera,
} from 'lucide-react';
import { Project } from '../../types/project';
import { projectService } from '../../services/projectService';
import { useDesignerPhoto } from '../../services/profileService';
import { designerConfig } from '../../config/designer';

export const AdminDashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { photo, uploadPhoto, removePhoto } = useDesignerPhoto();
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = React.useRef<HTMLInputElement>(null);

  const handleProfilePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    setActionError(null);
    try {
      await uploadPhoto(file);
      setActionSuccess('Designer profile photo updated across the website.');
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      setActionError((err as Error).message || 'Failed to update profile photo.');
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const data = await projectService.getAllProjectsForAdmin();
      setProjects(data);
    } catch (err: unknown) {
      setActionError((err as Error).message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const totalCount = projects.length;
  const publishedCount = projects.filter((p) => p.published).length;
  const draftCount = totalCount - publishedCount;

  // Filter projects based on search query, publication status, and category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.subtitle && project.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'published'
        ? project.published
        : !project.published;

    const matchesCategory =
      categoryFilter === 'all' ? true : project.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleTogglePublish = async (project: Project) => {
    try {
      const newStatus = !project.published;
      await projectService.togglePublish(project.id, newStatus);
      
      // Optimistic state update
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: newStatus } : p))
      );
      
      setActionSuccess(
        `Project "${project.title}" ${newStatus ? 'published live' : 'moved to drafts'}.`
      );
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      setActionError((err as Error).message || 'Failed to update publication status.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...projects];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);

    // Update order property
    reordered.forEach((p, idx) => {
      p.order = idx + 1;
    });

    setProjects(reordered);

    try {
      await projectService.reorderProjects(reordered.map((p) => p.id));
      setActionSuccess('Project display order updated.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: unknown) {
      setActionError((err as Error).message || 'Failed to update order in database.');
      loadProjects(); // Rollback on failure
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    setActionError(null);

    try {
      await projectService.deleteProject(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setActionSuccess(`Project "${projectToDelete.title}" deleted.`);
      setProjectToDelete(null);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      setActionError((err as Error).message || 'Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Bar with Title & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-light">
            Portfolio Project Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
            Manage public architectural presentations, publish drafts, and update project details.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-cream-50 text-xs uppercase tracking-super-wide hover:bg-stone-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Designer Profile Photo Management Card */}
      <div className="bg-white p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-800 bg-sand-200 shrink-0 shadow-sm flex items-center justify-center">
            {photo ? (
              <img src={photo} alt={designerConfig.fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif text-2xl font-light text-stone-700">UE</span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-medium">
                {designerConfig.fullName}
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-stone-100 border border-stone-300 text-stone-700 font-semibold">
                Designer Profile Photo
              </span>
            </div>
            <p className="text-xs text-stone-600 font-light">
              {designerConfig.institution} • Class {designerConfig.academicClass} Roll No: {designerConfig.rollNumber}
            </p>
            <p className="text-[11px] text-stone-400">
              This photo displays live across your Homepage hero and About & Vision page.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleProfilePhotoSelect}
            className="hidden"
            id="admin-profile-photo-upload"
          />
          <label
            htmlFor="admin-profile-photo-upload"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 text-cream-50 text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{photoUploading ? 'Uploading...' : photo ? 'Change Photo' : 'Upload Photo'}</span>
          </label>
          {photo && (
            <button
              type="button"
              onClick={removePhoto}
              className="px-3.5 py-2.5 border border-stone-300 text-stone-600 hover:text-red-700 hover:border-red-300 text-xs uppercase tracking-wider transition-colors"
            >
              Remove Photo
            </button>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-mono block">
              Total Projects
            </span>
            <span className="font-serif text-3xl text-stone-900 font-normal mt-1 block">
              {totalCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
            <FolderOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-mono block">
              Published Live
            </span>
            <span className="font-serif text-3xl text-stone-900 font-normal mt-1 block">
              {publishedCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-700 font-mono block">
              Drafts & Unpublished
            </span>
            <span className="font-serif text-3xl text-stone-900 font-normal mt-1 block">
              {draftCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by title, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 text-stone-900 text-xs focus:bg-white focus:border-stone-800 focus:outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Pills */}
          <div className="inline-flex rounded-sm border border-stone-300 p-0.5 bg-stone-50 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-sm uppercase tracking-wider text-[11px] ${
                statusFilter === 'all'
                  ? 'bg-stone-900 text-white font-medium'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-sm uppercase tracking-wider text-[11px] ${
                statusFilter === 'published'
                  ? 'bg-stone-900 text-white font-medium'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-sm uppercase tracking-wider text-[11px] ${
                statusFilter === 'draft'
                  ? 'bg-stone-900 text-white font-medium'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-300 text-stone-700 text-xs uppercase tracking-wider focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="kitchen">Kitchen</option>
            <option value="bedroom">Master Bedroom</option>
            <option value="kids">Kids Bedroom</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-stone-500 font-mono">
            Loading project catalog...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <p className="font-serif text-xl text-stone-700">No matching projects found</p>
            <p className="text-xs text-stone-500">
              Try adjusting your search query or create a new project.
            </p>
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-wider mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-sand-50/80 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-mono text-[10px]">
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4 w-20">Preview</th>
                  <th className="py-3.5 px-4">Project Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Sheets</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProjects.map((project, index) => (
                  <tr key={project.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Reorder Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          aria-label="Move project up in display order"
                          className="p-1 text-stone-400 hover:text-stone-900 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-[11px] text-stone-500 font-semibold">
                          {project.order}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === filteredProjects.length - 1}
                          aria-label="Move project down in display order"
                          className="p-1 text-stone-400 hover:text-stone-900 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-16 h-12 bg-stone-100 overflow-hidden border border-stone-200 flex items-center justify-center">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Title and Details */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="font-serif text-base text-stone-950 font-normal hover:text-stone-700 transition-colors"
                        >
                          {project.title}
                        </Link>
                        <div className="text-[11px] font-mono text-stone-500 flex items-center gap-2">
                          <span>/{project.slug}</span>
                          {project.sourcePdf && (
                            <span className="text-[10px] text-stone-400">
                              • {project.sourcePdf}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 uppercase tracking-wider text-[11px] text-stone-600 font-mono">
                      {project.category}
                    </td>

                    {/* Sheets Count */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-600">
                        <Layers className="w-3 h-3 text-stone-400" />
                        <span>{project.galleryImages?.length || 0}</span>
                      </span>
                    </td>

                    {/* Publication Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(project)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider font-mono font-medium rounded-full transition-colors ${
                          project.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {project.published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Live Link */}
                        {project.published && (
                          <Link
                            to={`/projects/${project.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
                            title="View on public site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        {/* Edit */}
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="p-1.5 text-stone-600 hover:text-stone-950 transition-colors"
                          title="Edit project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          className="p-1.5 text-stone-400 hover:text-red-700 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm"
        >
          <div className="bg-white max-w-md w-full p-6 border border-stone-300 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-700">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-stone-900 font-medium">
                Confirm Project Deletion
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Are you sure you want to delete <strong className="text-stone-900 font-semibold">{projectToDelete.title}</strong>? This will remove the project from the public portfolio and Supabase database.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-stone-300 text-stone-700 text-xs uppercase tracking-wider hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-700 text-white text-xs uppercase tracking-wider hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Project</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
