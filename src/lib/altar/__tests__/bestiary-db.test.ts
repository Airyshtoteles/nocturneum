import { describe, test, expect, beforeEach } from 'vitest';
import {
  saveBestiaryEntry,
  loadBestiaryEntries,
  searchBestiary,
  removeBestiaryEntry,
  purgeBestiary,
  checkBestiaryStorageMode,
} from '../bestiary-db';
import { BestiaryEntry } from '@/types';

describe('Bestiary DB Log Storage', () => {
  beforeEach(async () => {
    await purgeBestiary();
  });

  const sampleEntry: BestiaryEntry = {
    id: 'test-err-01',
    timestamp: 1700000000000,
    errorText: "TypeError: Cannot read properties of undefined (reading 'ignite')",
    detectedPattern: 'js-undefined-property',
    matchedLanguage: 'javascript',
  };

  test('saves and retrieves bestiary entry', async () => {
    await saveBestiaryEntry(sampleEntry);
    const entries = await loadBestiaryEntries(50);
    expect(entries.length).toBeGreaterThanOrEqual(1);
    const found = entries.find((e) => e.id === sampleEntry.id);
    expect(found).toBeDefined();
    expect(found?.errorText).toBe(sampleEntry.errorText);
  });

  test('returns entries sorted by timestamp descending', async () => {
    const entryOlder: BestiaryEntry = {
      id: 'older',
      timestamp: 1000,
      errorText: 'Old error',
      detectedPattern: null,
      matchedLanguage: null,
    };
    const entryNewer: BestiaryEntry = {
      id: 'newer',
      timestamp: 2000,
      errorText: 'New error',
      detectedPattern: null,
      matchedLanguage: null,
    };

    await saveBestiaryEntry(entryOlder);
    await saveBestiaryEntry(entryNewer);

    const entries = await loadBestiaryEntries(10);
    expect(entries[0].id).toBe('newer');
    expect(entries[1].id).toBe('older');
  });

  test('searches bestiary entries by error text or language', async () => {
    await saveBestiaryEntry(sampleEntry);
    const pyEntry: BestiaryEntry = {
      id: 'py-01',
      timestamp: 1700000005000,
      errorText: "NameError: name 'homunculus' is not defined",
      detectedPattern: 'py-name-not-defined',
      matchedLanguage: 'python',
    };
    await saveBestiaryEntry(pyEntry);

    const results = await searchBestiary('homunculus');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('py-01');

    const jsResults = await searchBestiary('javascript');
    expect(jsResults).toHaveLength(1);
    expect(jsResults[0].id).toBe(sampleEntry.id);
  });

  test('removes entry by id', async () => {
    await saveBestiaryEntry(sampleEntry);
    await removeBestiaryEntry(sampleEntry.id);
    const entries = await loadBestiaryEntries();
    expect(entries.find((e) => e.id === sampleEntry.id)).toBeUndefined();
  });

  test('checkBestiaryStorageMode reports active mode', () => {
    const mode = checkBestiaryStorageMode();
    expect(mode).toHaveProperty('isIndexedDB');
    expect(mode).toHaveProperty('fallbackActive');
  });
});
