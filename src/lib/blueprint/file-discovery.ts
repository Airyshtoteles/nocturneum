/**
 * File Discovery System for Alchemist's Blueprint
 * Discovers and parses specification files from .kiro directories (.kiro/specs, .kiro/steering, .kiro/hooks).
 * Validates Requirements 5.2, 5.3, 5.4, 5.13, 5.14
 */

import { SpecDocument, DocumentCategory } from '@/types';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Scan a directory recursively for documentation files (.md, .json).
 */
function scanDirectory(
  dirPath: string,
  category: DocumentCategory,
  basePath: string = ''
): SpecDocument[] {
  const documents: SpecDocument[] = [];
  if (!fs.existsSync(dirPath)) return documents;

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        documents.push(...scanDirectory(fullPath, category, relativePath));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ext === '.md' || ext === '.json') {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            documents.push({
              path: relativePath,
              name: entry.name,
              category,
              content,
              type: ext === '.json' ? 'json' : 'markdown',
            });
          } catch (err) {
            console.warn(`[Nocturneum Blueprint] Failed reading file: ${fullPath}`, err);
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[Nocturneum Blueprint] Error scanning directory: ${dirPath}`, err);
  }

  return documents;
}

/**
 * Discover all .kiro specification documents across specs, steering, and hooks directories.
 * Returns empty array if .kiro directory does not exist.
 * Validates Requirements 5.2, 5.3, 5.4, 5.13
 */
export function discoverKiroDocuments(workspaceRoot?: string): {
  exists: boolean;
  documents: SpecDocument[];
} {
  const root = workspaceRoot || process.cwd();
  const kiroDir = path.join(root, '.kiro');

  if (!fs.existsSync(kiroDir)) {
    return { exists: false, documents: [] };
  }

  const documents: SpecDocument[] = [];

  // 1. Scan .kiro/specs (Requirement 5.2)
  const specsDir = path.join(kiroDir, 'specs');
  documents.push(...scanDirectory(specsDir, 'specs', 'specs'));

  // 2. Scan .kiro/steering (Requirement 5.3)
  const steeringDir = path.join(kiroDir, 'steering');
  documents.push(...scanDirectory(steeringDir, 'steering', 'steering'));

  // 3. Scan .kiro/hooks (Requirement 5.4)
  const hooksDir = path.join(kiroDir, 'hooks');
  documents.push(...scanDirectory(hooksDir, 'hooks', 'hooks'));

  return {
    exists: true,
    documents,
  };
}

/**
 * Generate a static JSON manifest representation of all discovered spec documents.
 */
export function generateSpecManifest(workspaceRoot?: string): string {
  const result = discoverKiroDocuments(workspaceRoot);
  return JSON.stringify(result.documents, null, 2);
}
