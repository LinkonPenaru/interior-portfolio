import { useState, useEffect } from 'react';
import { designerConfig } from '../config/designer';
import { uploadProjectImage } from './storageService';

const STORAGE_KEY = 'urvi_designer_photo';
const PROFILE_CHANGE_EVENT = 'urvi_profile_photo_changed';

/**
 * Retrieves the currently saved designer photo URL (from localStorage or designerConfig)
 */
export const getDesignerPhoto = (): string | null => {
  if (typeof window === 'undefined') return designerConfig.avatarUrl || null;
  return localStorage.getItem(STORAGE_KEY) || designerConfig.avatarUrl || null;
};

/**
 * Saves a new photo URL to localStorage and notifies all components across the app
 */
export const setDesignerPhoto = (url: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, url);
  window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: url }));
};

/**
 * Clears the custom photo
 */
export const removeDesignerPhoto = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: null }));
};

/**
 * Uploads a photo file and updates the profile photo across the site
 */
export const uploadDesignerPhoto = async (file: File): Promise<string> => {
  // First generate instant local blob preview
  const localUrl = URL.createObjectURL(file);
  setDesignerPhoto(localUrl);

  try {
    // Attempt permanent cloud upload via Supabase storage
    const uploadRes = await uploadProjectImage(file, 'profile');
    if (uploadRes?.url) {
      setDesignerPhoto(uploadRes.url);
      return uploadRes.url;
    }
  } catch (err) {
    console.warn('Permanent cloud upload failed, maintaining local photo preview:', err);
  }

  return localUrl;
};

/**
 * React hook to subscribe to real-time designer photo updates across all pages
 */
export const useDesignerPhoto = () => {
  const [photo, setPhoto] = useState<string | null>(getDesignerPhoto);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      setPhoto(customEvent.detail ?? null);
    };

    window.addEventListener(PROFILE_CHANGE_EVENT, handleUpdate);
    window.addEventListener('storage', () => {
      setPhoto(getDesignerPhoto());
    });

    return () => {
      window.removeEventListener(PROFILE_CHANGE_EVENT, handleUpdate);
    };
  }, []);

  return {
    photo,
    setPhoto: setDesignerPhoto,
    removePhoto: removeDesignerPhoto,
    uploadPhoto: uploadDesignerPhoto,
  };
};
