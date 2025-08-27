import { JavaGenerator } from '../../src';

const generator = new JavaGenerator({
  typeMapping: {
    Float: ({ dependencyManager }) => {
      dependencyManager.addDependency('import java.math.BigDecimal;');
      return 'BigDecimal';
    },
    String: ({ constrainedModel, dependencyManager }) => {
      if (constrainedModel?.options.format === 'date-time') {
        dependencyManager.addDependency('import java.time.Instant;');
        return 'Instant';
      }
      return 'String';
    }
  }
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    gender: {
      type: 'string',
      default: 'male'
    },
    height: {
      type: 'number',
      default: 1.75
    },
    creationTime: {
      type: 'string',
      format: 'date-time',
      default: '2023-10-01T12:00:00Z'
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
