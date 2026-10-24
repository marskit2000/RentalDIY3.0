import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  defaultPdfInputValues,
  loadPdfInputValues,
  resetPdfInputValues,
  updatePdfInputValues,
} from '../src/utils/pdfGenerator';

vi.mock('../src/convertToImage', () => ({
  convertToImage: vi.fn(),
}));

const createStorage = (): Storage => {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  };
};

describe('PDF input persistence', () => {
  const storage = createStorage();

  afterEach(() => {
    storage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('loads defaults when there is no saved form', () => {
    vi.stubGlobal('window', { localStorage: storage });
    vi.stubGlobal('localStorage', storage);

    expect(loadPdfInputValues()).toEqual(defaultPdfInputValues);
  });

  it('saves, reloads, updates, and resets form values', () => {
    vi.stubGlobal('window', { localStorage: storage });
    vi.stubGlobal('localStorage', storage);

    updatePdfInputValues({
      inputText1: 'Saved address',
      remarksFields: ['Saved clause'],
    });
    expect(loadPdfInputValues()).toEqual({
      ...defaultPdfInputValues,
      inputText1: 'Saved address',
      remarksFields: ['Saved clause'],
    });

    updatePdfInputValues({ rentAmount: '9000' });
    expect(loadPdfInputValues()).toMatchObject({
      inputText1: 'Saved address',
      rentAmount: '9000',
      remarksFields: ['Saved clause'],
    });

    expect(resetPdfInputValues()).toEqual(defaultPdfInputValues);
    expect(loadPdfInputValues()).toEqual(defaultPdfInputValues);
  });

  it('falls back to defaults when saved JSON is malformed', () => {
    vi.stubGlobal('window', { localStorage: storage });
    vi.stubGlobal('localStorage', storage);
    storage.setItem('pdfInputValues', '{invalid');
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(loadPdfInputValues()).toEqual(defaultPdfInputValues);
    expect(console.error).toHaveBeenCalled();
  });
});
