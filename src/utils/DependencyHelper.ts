
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
