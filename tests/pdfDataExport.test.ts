import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  exportPdfDataToJson,
  importPdfDataFromJson,
  validatePdfDataJson,
} from '../src/utils/pdfDataExport';
import {
  defaultPdfInputValues,
  type PdfInputValues,
} from '../src/utils/pdfGenerator';

vi.mock('../src/convertToImage', () => ({
  convertToImage: vi.fn(),
}));

describe('PDF data export and import', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exports metadata and round-trips all form values', () => {
    const values: PdfInputValues = {
      ...defaultPdfInputValues,
      inputText1: '12 Example Street',
      inputText2: 'Landlord',
      rentAmount: '12000',
      securityDeposit: '24000',
      remarksFields: ['First clause', 'Second clause'],
    };

    const parsed = JSON.parse(exportPdfDataToJson(values));

    expect(parsed.version).toBe('1.0');
    expect(parsed.timestamp).toEqual(expect.any(String));
    expect(importPdfDataFromJson(JSON.stringify(parsed))).toEqual(values);
    expect(validatePdfDataJson(JSON.stringify(parsed))).toEqual({ isValid: true });
  });

  it('fills missing fields with defaults when importing older data', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const imported = importPdfDataFromJson(JSON.stringify({ inputText1: 'Saved address' }));

    expect(imported).toEqual({
      ...defaultPdfInputValues,
      inputText1: 'Saved address',
    });
  });

  it('rejects invalid JSON and reports validation errors', () => {
    expect(() => importPdfDataFromJson('{not valid json')).toThrow(
      'Failed to import PDF data from JSON',
    );

    const validation = validatePdfDataJson('{not valid json');
    expect(validation.isValid).toBe(false);
    expect(validation.error).toContain('Failed to import PDF data from JSON');
  });
});
