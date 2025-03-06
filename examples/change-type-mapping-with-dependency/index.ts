import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  typeMapping: {
    Float: ({ dependencyManager }) => {
      // Let let the TypeScript dependency manager handle rendering the dependency based on the TypeScript options (i.e moduleSystem).
      dependencyManager.addTypeScriptDependency(
        'MyCustomClass',
        '../some/path/to/MyCustomClass'
      );
      // Or just do it manually, but then the moduleSystem options is not uphold. This is what most generators support
      // dependencyManager.addDependency('import MyCustomClass from \'../some/path/to/class\';');

      // Return the type to use for this float model
      return 'MyCustomClass';
    }
  }
});

const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    someProperty: {
      type: 'number'
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
