import * as pdfjsLib from 'pdfjs-dist'

// Set the worker source
if (typeof window !== 'undefined') {
    // Use a web worker from the same origin
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();
  }

export const convertToImage = async (pdfPath: string) => {
    try {
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ url: pdfPath });
        const pdf = await loadingTask.promise;
        
        const numPages = pdf.numPages;
        const imagePromises: Promise<string>[] = [];
        
        // Convert each page to an image
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });
          
          // Create a canvas for rendering
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            throw new Error('Could not create canvas context');
          }
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          // Render the PDF page to the canvas
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          
          await page.render(renderContext).promise;
          
          // Convert the canvas to a data URL
          const imageData = canvas.toDataURL('image/png');
          imagePromises.push(Promise.resolve(imageData));
        }
        
        // Wait for all images to be processed
        const convertedImages = await Promise.all(imagePromises);
        console.log(convertedImages);
        return convertedImages;
      } catch (err) {
        console.error('Error converting PDF to images:', err);
        return null;
      }
}
  