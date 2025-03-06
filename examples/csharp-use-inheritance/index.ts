import { ConstrainedDictionaryModel, CSharpGenerator } from '../../src';

const generator = new CSharpGenerator({
  presets: [
    {
      class: {
        // Self is used to overwrite the entire rendering behavior of the class
        self: async ({ renderer, options, model }) => {
          //Render all the class content
          const content = [
            await renderer.renderProperties(),
            await renderer.runCtorPreset(),
            await renderer.renderAccessors(),
            await renderer.runAdditionalContentPreset()
          ];

          if (
            options?.collectionType === 'List' ||
            model.containsPropertyType(ConstrainedDictionaryModel)
          ) {
            renderer.addDependency('using System.Collections.Generic;');
          }
          return `public class ${model.name} : IEvent
{
${renderer.indent(renderer.renderBlock(content, 2))}
}`;
        }
      }
    }
  ]
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'array',
      additionalItems: false,
      items: {
        type: 'string',
        format: 'email'
      }
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
