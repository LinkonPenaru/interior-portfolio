import { Project, ProjectCategory, ProjectDbRow, mapDbRowToProject, mapProjectToDbRow } from '../types/project';
import { PROJECTS as STATIC_VERIFIED_PROJECTS } from '../data/projects';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Local storage key for demo / offline mode persistence
const LOCAL_STORAGE_PROJECTS_KEY = 'demo_portfolio_projects_v2';

const getLocalProjects = (): Project[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse local projects:', e);
  }
  return [...STATIC_VERIFIED_PROJECTS];
};

const saveLocalProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.warn('Failed to save local projects:', e);
  }
};

/**
 * Project Data Service Layer
 * 
 * Supports live Supabase PostgreSQL queries with Row Level Security (RLS).
 * Automatically falls back to verified PDF architectural projects if Supabase
 * is offline or not yet seeded.
 */
export const projectService = {
  /**
   * Public: Get published projects, optionally filtered by category
   */
  async getProjects(category?: ProjectCategory): Promise<Project[]> {
    if (!isSupabaseConfigured()) {
      let list = getLocalProjects().filter((p) => p.published);
      if (category && category !== 'all') {
        list = list.filter((p) => p.category === category);
      }
      return list.sort((a, b) => a.order - b.order);
    }

    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('Supabase query error, using local fallback:', error.message);
        return getLocalProjects().filter((p) => p.published);
      }

      const dbProjects = (data || []).map((row: ProjectDbRow) => mapDbRowToProject(row));
      
      // Merge with static verified projects so original studies (Kitchen, Master Suite, Kids Room)
      // are never lost when new projects are uploaded to the database
      const dbSlugs = new Set(dbProjects.map((p) => p.slug));
      const staticRemaining = STATIC_VERIFIED_PROJECTS.filter((p) => !dbSlugs.has(p.slug));
      
      let combined = [...dbProjects, ...staticRemaining].filter((p) => p.published);
      if (category && category !== 'all') {
        combined = combined.filter((p) => p.category === category);
      }
      return combined.sort((a, b) => a.order - b.order);
    } catch (err) {
      console.error('Failed to fetch projects from Supabase:', err);
      return getLocalProjects().filter((p) => p.published);
    }
  },

  /**
   * Public: Get featured projects for homepage showcase
   */
  async getFeaturedProjects(): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects.filter((p) => p.featured);
  },

  /**
   * Public: Get single project by slug
   */
  async getProjectBySlug(slug: string): Promise<Project | null> {
    if (!isSupabaseConfigured()) {
      const found = getLocalProjects().find((p) => p.slug === slug);
      return found || null;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) {
        // Fallback to local or static verified projects
        const found = getLocalProjects().find((p) => p.slug === slug) || STATIC_VERIFIED_PROJECTS.find((p) => p.slug === slug);
        return found || null;
      }

      return mapDbRowToProject(data as ProjectDbRow);
    } catch (err) {
      console.error('Failed to fetch project by slug:', err);
      const found = getLocalProjects().find((p) => p.slug === slug) || STATIC_VERIFIED_PROJECTS.find((p) => p.slug === slug);
      return found || null;
    }
  },

  /**
   * Public: Get previous and next project for navigation
   */
  async getAdjacentProjects(currentSlug: string): Promise<{ prev: Project | null; next: Project | null }> {
    const published = await this.getProjects();
    const currentIndex = published.findIndex((p) => p.slug === currentSlug);

    if (currentIndex === -1 || published.length === 0) {
      return { prev: null, next: null };
    }

    const prev = currentIndex > 0 ? published[currentIndex - 1] : published[published.length - 1];
    const next = currentIndex < published.length - 1 ? published[currentIndex + 1] : published[0];

    return { prev, next };
  },

  /**
   * Admin: Get all projects (published + draft)
   */
  async getAllProjectsForAdmin(): Promise<Project[]> {
    if (!isSupabaseConfigured()) {
      return getLocalProjects().sort((a, b) => a.order - b.order);
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('Admin fetch error, returning local:', error.message);
        return getLocalProjects().sort((a, b) => a.order - b.order);
      }

      const dbProjects = (data || []).map((row: ProjectDbRow) => mapDbRowToProject(row));
      const dbSlugs = new Set(dbProjects.map((p) => p.slug));
      const staticRemaining = STATIC_VERIFIED_PROJECTS.filter((p) => !dbSlugs.has(p.slug));
      return [...dbProjects, ...staticRemaining].sort((a, b) => a.order - b.order);
    } catch (err) {
      console.error('Failed to fetch admin projects:', err);
      return getLocalProjects().sort((a, b) => a.order - b.order);
    }
  },

  /**
   * Admin: Get project by UUID
   */
  async getProjectById(id: string): Promise<Project | null> {
    if (!isSupabaseConfigured()) {
      return getLocalProjects().find((p) => p.id === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        return (
          getLocalProjects().find((p) => p.id === id) ||
          STATIC_VERIFIED_PROJECTS.find((p) => p.id === id) ||
          null
        );
      }

      return mapDbRowToProject(data as ProjectDbRow);
    } catch (err) {
      console.error('Failed to fetch project by id:', err);
      return (
        getLocalProjects().find((p) => p.id === id) ||
        STATIC_VERIFIED_PROJECTS.find((p) => p.id === id) ||
        null
      );
    }
  },

  /**
   * Admin: Check if slug is unique
   */
  async isSlugUnique(slug: string, currentProjectId?: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const all = getLocalProjects();
      const conflict = all.find((p) => p.slug === slug && p.id !== currentProjectId);
      return !conflict;
    }

    try {
      let query = supabase.from('projects').select('id').eq('slug', slug);
      if (currentProjectId) {
        query = query.neq('id', currentProjectId);
      }
      const { data, error } = await query;
      if (error) return true;
      return !data || data.length === 0;
    } catch {
      return true;
    }
  },

  /**
   * Admin: Create a new project
   */
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    if (!isSupabaseConfigured()) {
      const newProject: Project = {
        ...project,
        id: `proj-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const all = getLocalProjects();
      all.push(newProject);
      saveLocalProjects(all);
      return newProject;
    }

    const row = mapProjectToDbRow(project as Project);
    delete row.id; // Let Postgres generate UUID

    const { data, error } = await supabase
      .from('projects')
      .insert(row)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return mapDbRowToProject(data as ProjectDbRow);
  },

  /**
   * Admin: Update an existing project
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (!isSupabaseConfigured()) {
      const all = getLocalProjects();
      const idx = all.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Project not found');
      
      all[idx] = {
        ...all[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveLocalProjects(all);
      return all[idx];
    }

    const rowUpdates = mapProjectToDbRow(updates);
    delete rowUpdates.id; // Do not update primary key

    const { data, error } = await supabase
      .from('projects')
      .update(rowUpdates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }

    return mapDbRowToProject(data as ProjectDbRow);
  },

  /**
   * Admin: Toggle project publication status
   */
  async togglePublish(id: string, published: boolean): Promise<void> {
    if (!isSupabaseConfigured()) {
      const all = getLocalProjects();
      const idx = all.findIndex((p) => p.id === id);
      if (idx !== -1) {
        all[idx].published = published;
        all[idx].updatedAt = new Date().toISOString();
        saveLocalProjects(all);
      }
      return;
    }

    const { error } = await supabase
      .from('projects')
      .update({ published })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to change publication status: ${error.message}`);
    }
  },

  /**
   * Admin: Delete project
   */
  async deleteProject(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      const all = getLocalProjects().filter((p) => p.id !== id);
      saveLocalProjects(all);
      return;
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  },

  /**
   * Admin: Reorder projects
   */
  async reorderProjects(orderedIds: string[]): Promise<void> {
    if (!isSupabaseConfigured()) {
      const all = getLocalProjects();
      orderedIds.forEach((id, index) => {
        const item = all.find((p) => p.id === id);
        if (item) item.order = index + 1;
      });
      saveLocalProjects(all);
      return;
    }

    // Update each project's sort_order in Supabase
    const updates = orderedIds.map((id, index) =>
      supabase
        .from('projects')
        .update({ sort_order: index + 1 })
        .eq('id', id)
    );

    await Promise.all(updates);
  },
};
