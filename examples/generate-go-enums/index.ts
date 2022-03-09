import { GoGenerator } from '../../src';

const generator = new GoGenerator();
const jsonSchemaDraft7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  properties: {
    cities: {
      $id: 'cities',
      type: 'string',
      enum: ["London", "Rome", "Brussels"],
    },
    click_options: {
      $id: 'click_options',
      type: 'string',
      enum: ['click_and_play', 'click&pay'],
    },
    options: {
      $id: 'options',
      type: 'integer',
      enum: ['first_option', 'second_option'],
    },
  }
};


export async function generate() : Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
