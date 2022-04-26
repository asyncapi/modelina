import { CSharpGenerator } from '../../src';

/** 
 * This example shows how you can modify inputs as well as outputs to make it fit your need!
 * 
 * Related issue triggering the example: https://github.com/asyncapi/modelina/issues/615
 */
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Address',
  type: 'object',
  properties: {
    dictionaryProp: { 
      'x-custom-type': 'dictionary', 
      'x-custom-dictionary-key': 'string', 
      'x-custom-dictionary-value': 'object', 
      additionalProperties: true
    }
  },
  additionalProperties: false
};

const generator = new CSharpGenerator({ 
  presets: [
    {
      class: {
        property: (args) => {
          if (args.property.getFromOriginalInput('x-custom-type') === 'dictionary') {
            args.propertyName = args.renderer.nameProperty(args.propertyName, args.property);
            const dictKey = args.property.getFromOriginalInput('x-custom-dictionary-key');
            const dictValue = args.property.getFromOriginalInput('x-custom-dictionary-value');
            //NOTICE: I use public visibility here, so for simplicity no need to add getter/setters, could easily be done though!
            return `public Dictionary<${dictKey}, ${dictValue}> ${args.propertyName};`;
          }
          return args.content;
        },
        accessor: (args) => {
          //NOTICE: Disabling accessor factory for specific property type
          if (args.property.getFromOriginalInput('x-custom-type') === 'dictionary') {
            return '';
          }
          return args.content;
        }
      }
    }
  ]
});

export async function generate() : Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
