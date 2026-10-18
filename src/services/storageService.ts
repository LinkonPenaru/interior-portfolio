import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface UploadResult {
  url: string;
  path: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const STORAGE_BUCKET = 'portfolio-images';

/**
 * Validates file type and size before upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type || 'unknown'}. Allowed formats: JPEG, PNG, WebP.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). Maximum upload size limit is 5.0 MB.`,
    };
  }

  return { valid: true };
};

/**
 * Optimizes an image client-side using Canvas to ensure it does not exceed 2560px
 * and compresses it to clean WebP/JPEG format while preserving crisp architectural quality.
 */
export const optimizeImageBeforeUpload = async (file: File, maxDimension = 2560): Promise<File> => {
  return new Promise((resolve) => {
    // If not a standard bitmap image (e.g. SVG), skip canvas processing
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return resolve(file);
    }

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
 * Uploads an image to Supabase Storage bucket 'portfolio-images'
 */
export const uploadProjectImage = async (
  file: File,
  projectSlug = 'general'
): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const processedFile = await optimizeImageBeforeUpload(file);

  // Generate collision-resistant unique file path
  const sanitizedSlug = projectSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const ext = processedFile.name.split('.').pop() || 'webp';
  const filePath = `projects/${sanitizedSlug}/${timestamp}-${randomSuffix}.${ext}`;

  if (!isSupabaseConfigured()) {
    // Graceful offline preview when Supabase is not configured yet
    const localBlobUrl = URL.createObjectURL(processedFile);
    return {
      url: localBlobUrl,
      path: filePath,
    };
  }

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, processedFile, {
      cacheControl: '31536000', // 1 year cache
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
  };
};

/**
 * Deletes an image from Supabase Storage
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
