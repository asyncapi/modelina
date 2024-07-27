import { ConstrainedMetaModel } from '../models';

/**
 * Function to make it easier to render JS/TS dependencies based on module system
 *
 * @param toImport
 * @param fromModule
 * @param moduleSystem
 */
export function renderJavaScriptDependency(
  toImport: string,
  fromModule: string,
  moduleSystem: 'CJS' | 'ESM',
  importType: 'type' | 'value' = 'value'
): string {
  const importValueStatement =
    moduleSystem === 'CJS'
      ? `const ${toImport} = require('${fromModule}');`
      : `import ${toImport} from '${fromModule}';`;
  const importTypeStatement =
    moduleSystem === 'CJS'
      ? `const ${toImport} = require('${fromModule}');`
      : `import type ${toImport} from '${fromModule}';`;
  return importType === 'type' ? importTypeStatement : importValueStatement;
}

/**
 * Function to make an array of ConstrainedMetaModels only contain unique values (ignores different in memory instances)
 *
 * @param array to make unique
 */
export function makeUnique(
  array: ConstrainedMetaModel[]
): ConstrainedMetaModel[] {
  const seen: Set<string> = new Set();

  return array.filter((item: ConstrainedMetaModel) => {
    const naiveIdentifier = item.name + item.type;
    return seen.has(naiveIdentifier) ? false : seen.add(naiveIdentifier);
  });
}
