import { describe, test, expect } from 'vitest';
import { discoverKiroDocuments, generateSpecManifest } from '../file-discovery';
import path from 'node:path';

describe('Blueprint File Discovery', () => {
  test('discovers all .kiro documentation files correctly', () => {
    const result = discoverKiroDocuments();
    expect(result.exists).toBe(true);
    expect(result.documents.length).toBeGreaterThanOrEqual(3);

    const docNames = result.documents.map((d) => d.name);
    expect(docNames).toContain('design.md');
    expect(docNames).toContain('tasks.md');
    expect(docNames).toContain('gothic-alchemist-rules.md');

    // Check categories
    const categories = new Set(result.documents.map((d) => d.category));
    expect(categories.has('specs')).toBe(true);
    expect(categories.has('steering')).toBe(true);

    // Verify document contents are non-empty
    for (const doc of result.documents) {
      expect(doc.path).toBeTruthy();
      expect(doc.name).toBeTruthy();
      expect(doc.category).toMatch(/^(specs|steering|hooks)$/);
      expect(doc.content).toBeDefined();
    }
  });

  test('gracefully handles missing directory', () => {
    const fakeDir = path.join(process.cwd(), 'non_existent_folder_xyz');
    const result = discoverKiroDocuments(fakeDir);
    expect(result.exists).toBe(false);
    expect(result.documents).toHaveLength(0);
  });

  test('generateSpecManifest returns valid JSON string', () => {
    const manifest = generateSpecManifest();
    expect(typeof manifest).toBe('string');
    const parsed = JSON.parse(manifest);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThanOrEqual(3);
  });
});
