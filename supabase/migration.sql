-- ============================================================================
-- SUPABASE MIGRATION: INTERIOR DESIGN PORTFOLIO (PHASE 2)
-- ============================================================================
-- Description: Creates the 'admin_users' allowlist, the 'projects' table,
-- automatic updated_at timestamp trigger, Row Level Security (RLS) policies,
-- and Supabase Storage bucket policies for 'portfolio-images'.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ADMIN USERS ALLOWLIST TABLE
-- Only user IDs in this table are granted administrative privileges.
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. SECURITY DEFINER HELPER FUNCTION
-- Checks whether the currently executing session belongs to an authorized admin.
-- Using SECURITY DEFINER bypasses RLS during the check to prevent infinite recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
    );
$$;

-- RLS Policy for admin_users:
-- Admins can view the admin list; users can check their own entry.
CREATE POLICY "admin_users_select_policy"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('kitchen', 'bedroom', 'kids', 'all')),
    cover_image TEXT NOT NULL,
    gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
    published BOOLEAN NOT NULL DEFAULT false,
    featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Architectural & Academic metadata derived from verified drafting sheets
    source_pdf TEXT,
    institution TEXT,
    academic_class TEXT,
    sheet_scale TEXT,
    completion_date TEXT,
    concept_philosophy TEXT,
    color_palette JSONB DEFAULT '[]'::jsonb,
    materials JSONB DEFAULT '[]'::jsonb,
    appliances JSONB DEFAULT '[]'::jsonb,
    key_highlights JSONB DEFAULT '[]'::jsonb,
    pending_designer_notes JSONB DEFAULT '[]'::jsonb,

    -- Audit timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 5. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS projects_slug_idx ON public.projects(slug);
CREATE INDEX IF NOT EXISTS projects_published_idx ON public.projects(published);
CREATE INDEX IF NOT EXISTS projects_sort_order_idx ON public.projects(sort_order);
CREATE INDEX IF NOT EXISTS projects_category_idx ON public.projects(category);

-- 6. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 7. ROW LEVEL SECURITY (RLS) FOR PROJECTS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Rule 1: Public SELECT
-- Anyone (authenticated or anonymous) can view published projects.
-- Admins can view both published and draft projects.
CREATE POLICY "projects_select_policy"
ON public.projects
FOR SELECT
USING (published = true OR public.is_admin());

-- Rule 2: Admin INSERT
-- Only explicitly verified admins can create new projects.
CREATE POLICY "projects_insert_policy"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Rule 3: Admin UPDATE
-- Only explicitly verified admins can update projects.
CREATE POLICY "projects_update_policy"
ON public.projects
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Rule 4: Admin DELETE
-- Only explicitly verified admins can delete projects.
CREATE POLICY "projects_delete_policy"
ON public.projects
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ============================================================================
-- 8. SUPABASE STORAGE SETUP: 'portfolio-images' BUCKET
-- ============================================================================

-- Create public storage bucket if it does not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-images',
    'portfolio-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- Storage RLS Policies
-- Anyone can view portfolio images
CREATE POLICY "Public Read Portfolio Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

-- Only admins can upload images
CREATE POLICY "Admin Upload Portfolio Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'portfolio-images' AND
    public.is_admin()
);

-- Only admins can update images
CREATE POLICY "Admin Update Portfolio Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'portfolio-images' AND
    public.is_admin()
);

-- Only admins can delete images
CREATE POLICY "Admin Delete Portfolio Images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'portfolio-images' AND
    public.is_admin()
);
