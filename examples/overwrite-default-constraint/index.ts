import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator({
  constraints: {
    modelName: ({ modelName, options }) => {
      return 'MyOwnCustomModelName';
    },
    constant: ({ constrainedMetaModel, options }) => {
      return 'MyCustomConst';
    },
    enumKey: ({ constrainedEnumModel, enumKey, enumModel, options }) => {
      return 'MyCustomKey';
    },
    enumValue: ({ constrainedEnumModel, enumValue, enumModel, options }) => {
      return 'MyCustomValue';
    },
    propertyKey: ({
      constrainedObjectModel,
      constrainedObjectPropertyModel,
      objectModel,
      objectPropertyModel,
      options
    }) => {
      return 'MyCustomPropertyKey';
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

export async function generate(): Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
