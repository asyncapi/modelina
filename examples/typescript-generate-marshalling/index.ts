import { TypeScriptGenerator } from '../../src';
import { TS_COMMON_PRESET } from '../../src';

const generator = new TypeScriptGenerator({
  presets: [
    {
      preset: TS_COMMON_PRESET,
      options: {
        marshalling: true
      }
    }
  ]
});
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Meeting',
  type: 'object',
  additionalProperties: false,
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    // date-time and date map to Date type
    createdAt: {
      type: 'string',
      format: 'date-time'
    },
    meetingDate: {
      type: 'string',
      format: 'date'
    },
    // time maps to string (not Date) because time-only strings
    // like "14:30:00" are not valid Date constructor arguments
    meetingTime: {
      type: 'string',
      format: 'time'
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
