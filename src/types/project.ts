export type ProjectCategory = 'kitchen' | 'bedroom' | 'kids' | 'all';

export interface ProjectImage {
  id: string;
  url: string;
  title: string;
  sheetType: 'render' | 'plan' | 'elevation' | 'detail' | 'material-board' | 'schedule';
  caption: string;
  sourcePage: number;
}

export interface MaterialSpecification {
  name: string;
  brand?: string;
  specifications?: string;
  price?: string;
  category: 'cabinetry' | 'flooring' | 'hardware' | 'surface' | 'sanitaryware' | 'lighting';
}

export interface ApplianceSpecification {
  item: string;
  brand: string;
  model?: string;
  dimensions?: string;
  price?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  galleryImages: ProjectImage[];
  category: ProjectCategory;
  published: boolean;
  featured: boolean;
  order: number;
  
  // Architectural metadata supported by the PDF source files
  sourcePdf: string;
  institution: string;
  academicClass: string;
  sheetScale?: string;
  completionDate?: string;
  
  // Detailed verified architectural elements
  conceptPhilosophy?: string;
  colorPalette?: { name: string; colorCode: string; description?: string }[];
  materials?: MaterialSpecification[];
  appliances?: ApplianceSpecification[];
  keyHighlights?: string[];
  
  // Specific sections awaiting designer input
  pendingDesignerNotes?: string[];

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectDbRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  short_description: string;
  description: string;
  category: ProjectCategory;
  cover_image: string;
  gallery_images: ProjectImage[];
  published: boolean;
  featured: boolean;
  sort_order: number;
  source_pdf: string | null;
  institution: string | null;
  academic_class: string | null;
  sheet_scale: string | null;
  completion_date: string | null;
  concept_philosophy: string | null;
  color_palette: { name: string; colorCode: string; description?: string }[] | null;
  materials: MaterialSpecification[] | null;
  appliances: ApplianceSpecification[] | null;
  key_highlights: string[] | null;
  pending_designer_notes: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export const mapDbRowToProject = (row: ProjectDbRow): Project => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  subtitle: row.subtitle || '',
  shortDescription: row.short_description,
  description: row.description,
  coverImage: row.cover_image,
  galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
  category: row.category,
  published: row.published,
  featured: row.featured,
  order: row.sort_order,
  sourcePdf: row.source_pdf || '',
  institution: row.institution || "Rachana Sansad's Academy of Architecture, Mumbai",
  academicClass: row.academic_class || 'FYBVOC (Roll No: 14)',
  sheetScale: row.sheet_scale || undefined,
  completionDate: row.completion_date || undefined,
  conceptPhilosophy: row.concept_philosophy || undefined,
  colorPalette: row.color_palette || undefined,
  materials: row.materials || undefined,
  appliances: row.appliances || undefined,
  keyHighlights: row.key_highlights || undefined,
  pendingDesignerNotes: row.pending_designer_notes || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapProjectToDbRow = (project: Partial<Project>): Partial<ProjectDbRow> => {
  const row: Partial<ProjectDbRow> = {};
  if (project.id !== undefined) row.id = project.id;
  if (project.slug !== undefined) row.slug = project.slug;
  if (project.title !== undefined) row.title = project.title;
  if (project.subtitle !== undefined) row.subtitle = project.subtitle;
  if (project.shortDescription !== undefined) row.short_description = project.shortDescription;
  if (project.description !== undefined) row.description = project.description;
  if (project.category !== undefined) row.category = project.category;
  if (project.coverImage !== undefined) row.cover_image = project.coverImage;
  if (project.galleryImages !== undefined) row.gallery_images = project.galleryImages;
  if (project.published !== undefined) row.published = project.published;
  if (project.featured !== undefined) row.featured = project.featured;
  if (project.order !== undefined) row.sort_order = project.order;
  if (project.sourcePdf !== undefined) row.source_pdf = project.sourcePdf;
  if (project.institution !== undefined) row.institution = project.institution;
  if (project.academicClass !== undefined) row.academic_class = project.academicClass;
  if (project.sheetScale !== undefined) row.sheet_scale = project.sheetScale;
  if (project.completionDate !== undefined) row.completion_date = project.completionDate;
  if (project.conceptPhilosophy !== undefined) row.concept_philosophy = project.conceptPhilosophy;
  if (project.colorPalette !== undefined) row.color_palette = project.colorPalette;
  if (project.materials !== undefined) row.materials = project.materials;
  if (project.appliances !== undefined) row.appliances = project.appliances;
  if (project.keyHighlights !== undefined) row.key_highlights = project.keyHighlights;
  if (project.pendingDesignerNotes !== undefined) row.pending_designer_notes = project.pendingDesignerNotes;
  return row;
};
