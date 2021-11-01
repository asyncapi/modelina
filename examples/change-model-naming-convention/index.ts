import { CommonNamingConventionImplementation, TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  namingConvention: {
    // Using the same default naming convention for properties 
    property: CommonNamingConventionImplementation.property,
    type: (name, context) => {
      // Lets prepend something to each data model name, and then follow the default naming convention.
      const newName = `prepend_${name}`;
      return CommonNamingConventionImplementation.type!(newName, context);
    }
  }
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  }
};

export async function generate() : Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
