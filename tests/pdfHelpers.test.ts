import { describe, expect, it } from 'vitest';
import {
  formatDate,
  getDateNumber,
  getDayWithOrdinal,
  getMonthInEnglish,
  getMonthNumber,
  getYear,
  hasChinese,
  joinRemarks,
  splitRemarks,
} from '../src/utils/pdfHelpers';

describe('PDF formatting helpers', () => {
  it('formats dates consistently', () => {
    const date = '2025-03-11T12:00:00';

    expect(formatDate(date)).toBe('11/03/2025');
    expect(getMonthInEnglish(date)).toBe('March, 2025');
    expect(getDayWithOrdinal(date)).toBe('11th');
    expect(getMonthNumber(date)).toBe('03');
    expect(getDateNumber(date)).toBe('11');
    expect(getYear(date)).toBe('2025');
    expect(formatDate('')).toBe('');
  });

  it.each([
    ['2025-01-01T12:00:00', '1st'],
    ['2025-01-02T12:00:00', '2nd'],
    ['2025-01-03T12:00:00', '3rd'],
    ['2025-01-11T12:00:00', '11th'],
    ['2025-01-21T12:00:00', '21st'],
  ])('formats the ordinal day for %s', (date, expected) => {
    expect(getDayWithOrdinal(date)).toBe(expected);
  });

  it('detects Chinese text and leaves non-Chinese text unmatched', () => {
    expect(hasChinese('租約條款')).toBe(true);
    expect(hasChinese('Rental agreement')).toBe(false);
    expect(hasChinese('')).toBe(false);
  });

  it('splits and joins remarks at the requested chunk size', () => {
    expect(splitRemarks('abcdefgh', 3)).toEqual(['abc', 'def', 'gh']);
    expect(joinRemarks('abcdefgh', 3)).toBe('abc\ndef\ngh');
    expect(splitRemarks('', 3)).toEqual([]);
  });
});
