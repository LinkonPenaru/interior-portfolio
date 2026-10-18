import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface UploadResult {
  url: string;
  path: string;
  isPdf?: boolean;
}

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const ALLOWED_DOC_MIME_TYPES = ['application/pdf', 'application/x-pdf'];
const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB for images
const MAX_PDF_SIZE_BYTES = 35 * 1024 * 1024;   // 35 MB for architectural drawing PDFs
const STORAGE_BUCKET = 'portfolio-images';

/**
 * Checks whether a given file is a PDF (by MIME type or extension)
 */
export const isPdfFile = (file: File): boolean => {
  return (
    ALLOWED_DOC_MIME_TYPES.includes(file.type.toLowerCase()) ||
    file.name.toLowerCase().endsWith('.pdf')
  );
};

/**
 * Checks whether a given file or URL is a PDF
 */
export const isPdfUrl = (url: string): boolean => {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return cleanUrl.endsWith('.pdf');
};

/**
 * Validates file type and size before upload (supporting both photos and PDF drawing sheets)
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string; isPdf?: boolean } => {
  const isPdf = isPdfFile(file);
  const isImage =
    ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|webp|avif|gif)$/i.test(file.name);

  if (!isPdf && !isImage) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type || file.name.split('.').pop() || 'unknown'}. Allowed formats: PDF drawings, JPEG, PNG, WebP.`,
    };
  }

  const maxAllowed = isPdf ? MAX_PDF_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  const maxLabel = isPdf ? '35.0 MB' : '15.0 MB';

  if (file.size > maxAllowed) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum size limit for this file is ${maxLabel}.`,
    };
  }

  return { valid: true, isPdf };
};

/**
 * Optimizes bitmap images client-side using Canvas before upload.
 * PDFs bypass this step and are uploaded intact to maintain vector precision.
 */
export const optimizeImageBeforeUpload = async (file: File, maxDimension = 2560): Promise<File> => {
  // If PDF, bypass image canvas processing entirely to preserve drawing vectors
  if (isPdfFile(file)) {
    return file;
  }

  // If not standard bitmap image (e.g. SVG), return original
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase())) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;

        // If dimensions are within bounds and file size is modest (< 2MB), keep original
        if (width <= maxDimension && height <= maxDimension && file.size <= 2 * 1024 * 1024) {
          return resolve(file);
        }

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP for modern efficiency
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const optimizedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          'image/webp',
          0.90 // High visual quality for architectural drawings
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

/**
 * Uploads an image or PDF to Supabase Storage bucket 'portfolio-images'
 */
export const uploadProjectImage = async (
  file: File,
  projectSlug = 'general'
): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const isPdf = isPdfFile(file);
  const processedFile = await optimizeImageBeforeUpload(file);

  // Generate collision-resistant unique file path
  const sanitizedSlug = projectSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const ext = isPdf ? 'pdf' : (processedFile.name.split('.').pop() || 'webp');
  const filePath = `projects/${sanitizedSlug}/${timestamp}-${randomSuffix}.${ext}`;

  if (!isSupabaseConfigured()) {
    // Graceful offline preview when Supabase is not configured yet
    const localBlobUrl = URL.createObjectURL(processedFile);
    return {
      url: localBlobUrl,
      path: filePath,
      isPdf,
    };
  }

  const contentType = isPdf ? 'application/pdf' : (processedFile.type || 'image/webp');

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, processedFile, {
      cacheControl: '31536000', // 1 year cache
      contentType,
      upsert: false,
    });

  if (uploadError) {
    console.error('Supabase storage upload error:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
    isPdf,
  };
};

/**
 * Deletes an image or file from Supabase Storage
 */
export const deleteProjectImage = async (filePath: string): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  
  // Only attempt deletion for files in Supabase Storage, not local /projects/ paths
  if (!filePath.startsWith('projects/')) return;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
  if (error) {
    console.warn('Storage deletion error:', error.message);
  }
};
