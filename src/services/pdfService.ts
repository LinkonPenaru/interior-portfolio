import * as pdfjsLib from 'pdfjs-dist';
// Configure PDF.js worker using Vite's ?url asset loader
// Fallback to official cdnjs worker if worker bundle resolution varies across environments
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
} catch {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ExtractedPage {
  file: File;
  pageNumber: number;
  width: number;
  height: number;
}

export interface PdfProgressCallback {
  (current: number, total: number, status: string): void;
}

/**
 * Checks whether a given file is a PDF document
 */
export const isPdfDocument = (file: File): boolean => {
  return (
    file.type === 'application/pdf' ||
    file.type === 'application/x-pdf' ||
    file.name.toLowerCase().endsWith('.pdf')
  );
};

/**
 * Extracts each page of a multi-page PDF into an individual high-resolution WebP image file.
 * Preserves high vector resolution (2.0x scale) for millimeter-precise architectural drawings.
 */
export const extractPdfPagesToImages = async (
  file: File,
  onProgress?: PdfProgressCallback
): Promise<ExtractedPage[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@' + pdfjsLib.version + '/cmaps/',
    cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const extracted: ExtractedPage[] = [];

  const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress?.(pageNum, numPages, `Splitting page ${pageNum} of ${numPages}...`);

    const page = await pdf.getPage(pageNum);
    
    // Scale 2.0 gives crisp architectural blueprint detail (approx 1600-2400px width)
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error(`Failed to create 2D canvas context for page ${pageNum}`);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Render the PDF page into canvas
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      canvas: canvas,
    };

    await page.render(renderContext).promise;

    // Convert canvas directly to high-quality WebP
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', 0.92);
    });

    if (!blob) {
      throw new Error(`Failed to convert PDF page ${pageNum} to WebP image.`);
    }

    const pageFileName = `${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-sheet-${pageNum}.webp`;
    const imageFile = new File([blob], pageFileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    extracted.push({
      file: imageFile,
      pageNumber: pageNum,
      width: canvas.width,
      height: canvas.height,
    });
  }

  return extracted;
};
