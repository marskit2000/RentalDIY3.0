import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { convertToImage } from '../src/convertToImage';
import {
  defaultPdfInputValues,
  generatePDF,
  type PdfGenerationParams,
} from '../src/utils/pdfGenerator';

vi.mock('../src/convertToImage', () => ({
  convertToImage: vi.fn(),
}));

describe('PDF generation integration', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('generates a multi-page PDF and renders preview images', async () => {
    const template = await readFile(
      join(process.cwd(), 'src', 'assets', 'Tenancy_Agreement_Template_20250311.pdf'),
    );
    const font = await readFile(
      join(process.cwd(), 'src', 'assets', 'fonts', 'NotoSansTC-Regular.ttf'),
    );
    const assets = new Map([
      ['/src/assets/Tenancy_Agreement_Template_20250311.pdf', template],
      ['/src/assets/fonts/NotoSansTC-Regular.ttf', font],
    ]);
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const asset = assets.get(String(input));
      if (!asset) {
        throw new Error(`Unexpected PDF asset request: ${String(input)}`);
      }
      return new Response(asset);
    });
    let generatedBlob: Blob | undefined;
    const createObjectURL = vi.fn((blob: Blob) => {
      generatedBlob = blob;
      return 'blob:generated-pdf';
    });
    const setImageLoading = vi.fn();
    const setImageError = vi.fn();
    const setImages = vi.fn();

    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('window', {
      URL: { createObjectURL },
      alert: vi.fn(),
    });
    vi.mocked(convertToImage).mockResolvedValue(['data:image/png;base64,preview']);

    const params: PdfGenerationParams = {
      ...defaultPdfInputValues,
      isPreview: true,
      inputDate2: '2025-03-11',
      inputText1: '12 Example Street',
      inputText2: 'Landlord Example',
      inputText3: 'Tenant Example',
      inputText4: 'Landlord address',
      inputText5: 'Tenant address',
      rentAmount: '12000',
      securityDeposit: '24000',
      dateFrom: '2025-04-01',
      dateTo: '2026-03-31',
      remarksFields: ['租約附加條款', 'Keep this clause'],
      language: 'en',
      t: (_language, key) => key,
      setImageLoading,
      setImageError,
      setImages,
    };

    const result = await generatePDF(params);

    expect(result).toBe('blob:generated-pdf');
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(convertToImage).toHaveBeenCalledWith('blob:generated-pdf');
    expect(setImageLoading.mock.calls).toEqual([[true], [false]]);
    expect(setImageError).toHaveBeenCalledWith(null);
    expect(setImages).toHaveBeenNthCalledWith(1, []);
    expect(setImages).toHaveBeenLastCalledWith(['data:image/png;base64,preview']);

    expect(generatedBlob).toBeInstanceOf(Blob);
    if (!generatedBlob) {
      throw new Error('PDF generation did not create a blob.');
    }
    expect(generatedBlob.type).toBe('application/pdf');
    const generatedPdf = await PDFDocument.load(await generatedBlob.arrayBuffer());
    expect(generatedPdf.getPageCount()).toBe(4);
  }, 30_000);
});
