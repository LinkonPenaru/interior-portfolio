import { useEffect } from 'react';

interface PageMetaOptions {
  title?: string;
  description?: string;
  ogImage?: string;
}

export function usePageMeta({ title, description, ogImage }: PageMetaOptions = {}) {
  useEffect(() => {
    // 1. Update Title
    const baseTitle = 'Urvi G Eragola — Interior Architecture & Spatial Design';
    document.title = title ? `${title} | Urvi G Eragola` : baseTitle;

    // 2. Update Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      }
    }

    // 3. Update OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title ? `${title} | Urvi G Eragola` : baseTitle);
    }

    // 4. Update OG Image if specified
    if (ogImage) {
      let ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) {
        ogImg.setAttribute('content', ogImage);
      }
    }
  }, [title, description, ogImage]);
}
