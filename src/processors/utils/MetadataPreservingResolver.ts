import type { Resolver } from '@asyncapi/parser/esm/resolver';
import type Uri from 'urijs';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import yaml from 'js-yaml';
import { Logger } from '../../utils';

/**
 * Creates a custom resolver that preserves file path metadata during AsyncAPI parsing.
 *
 * When the AsyncAPI parser resolves external $ref references, it normally loses the
 * original file path information. This resolver injects custom extensions to preserve
 * that metadata so we can use filenames for model naming.
 *
 * Injected extensions:
 * - x-modelgen-source-file: The filename without extension (e.g., "UserPreferences")
 * - x-modelgen-source-path: The full file path
 * - title: Set to filename if not already present
 *
 * @returns A Resolver that can be used with AsyncAPI parser's __unstable.resolver option
 */
export function createMetadataPreservingResolver(): Resolver {
  return {
    schema: 'file',
    order: -100, // Negative order for highest priority (lower numbers run first)

    canRead: (uri: Uri) => {
      const uriString = uri.toString();
      return (
        uriString.startsWith('file://') &&
        (uriString.endsWith('.yaml') ||
          uriString.endsWith('.yml') ||
          uriString.endsWith('.json'))
      );
    },

    read: async (uri: Uri) => {
      try {
        const filePath = fileURLToPath(uri.toString());
        Logger.debug(`Reading file with metadata preservation: ${filePath}`);

        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const content = await fs.readFile(filePath, 'utf8');

        // Determine if YAML or JSON
        const isYaml = filePath.endsWith('.yaml') || filePath.endsWith('.yml');
        let parsed: any;

        try {
          parsed = isYaml ? yaml.load(content) : JSON.parse(content);
        } catch (parseError) {
          Logger.error(`Failed to parse file ${filePath}:`, parseError);
          return undefined;
        }

        // Only inject metadata if it's an object (not array or primitive)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const filename = path.basename(filePath, path.extname(filePath));

          // Add custom extension with source file info
          // These will be preserved through the parsing process
          parsed['x-modelgen-source-file'] = filename;
          parsed['x-modelgen-source-path'] = filePath;

          Logger.debug(
            `Injected metadata for ${filename}: x-modelgen-source-file="${filename}"`
          );

          // If no title is present, suggest the filename as title
          // This provides a fallback naming strategy
          if (!parsed.title) {
            parsed.title = filename;
            Logger.debug(`Injected title for ${filename}: title="${filename}"`);
          } else {
            Logger.debug(
              `Preserving existing title for ${filename}: title="${parsed.title}"`
            );
          }
        }

        // Return serialized content
        return isYaml ? yaml.dump(parsed) : JSON.stringify(parsed);
      } catch (error: any) {
        Logger.error(`Error reading file ${uri.toString()}:`, error);
        return undefined;
      }
    }
  };
}

/**
 * Extracts the source filename from a schema that was processed by the metadata-preserving resolver.
 *
 * @param schemaJson The JSON representation of the schema
 * @returns The source filename if available, undefined otherwise
 */
export function extractSourceFilename(schemaJson: any): string | undefined {
  if (!schemaJson || typeof schemaJson !== 'object') {
    return undefined;
  }

  return schemaJson['x-modelgen-source-file'];
}

/**
 * Extracts the source file path from a schema that was processed by the metadata-preserving resolver.
 *
 * @param schemaJson The JSON representation of the schema
 * @returns The source file path if available, undefined otherwise
 */
export function extractSourcePath(schemaJson: any): string | undefined {
  if (!schemaJson || typeof schemaJson !== 'object') {
    return undefined;
  }

  return schemaJson['x-modelgen-source-path'];
}
