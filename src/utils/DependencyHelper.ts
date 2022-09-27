import { ConstrainedMetaModel, ConstrainedReferenceModel } from '../models';

/**
 * Function to make it easier to render JS/TS dependencies based on module system
 * 
 * @param toImport 
 * @param fromModule 
 * @param moduleSystem 
 */
export function renderJavaScriptDependency(toImport: string, fromModule: string, moduleSystem: 'CJS' | 'ESM'): string {
  return moduleSystem === 'CJS'
    ? `const ${toImport} = require('${fromModule}');`
    : `import ${toImport} from '${fromModule}';`;
}

/**
 * Function to make an array only contain unique values (ignores different in memory instances)
 * 
 * @param array to make unique
 */
export function makeUnique(array: ConstrainedMetaModel[]) {
  let seen: Map<ConstrainedMetaModel, boolean> = new Map();
  return array.filter(function(item) {
    if(item instanceof ConstrainedReferenceModel) {
      return seen.has(item.ref) ? false : seen.set(item.ref, true) && true;
    }
    return seen.has(item) ? false : (seen.set(item, true));
  });
}