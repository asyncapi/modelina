import { CommonModel, CommonInputModel } from '../../../../src/models';
import { EnumRenderer } from '../../../../src/generators/javascript/renderers';

const input = {
  "type": "string",
  "enum": [
    "Fire",
    "Ice",
    "Flying",
    "Psychic",
    "Water",
    "Ground",
    "Rock",
    "Electric",
    "Grass",
    "Fighting",
    "Poison",
    "Bug",
    "Fairy",
    "Ghost",
    "Dark",
    "Steel",
    "Dragon",
    "Dupa"
  ],
  "title": "type"
}
const expected = `enum Type {
  Fire = 'Fire',
  Ice = 'Ice',
  Flying = 'Flying',
  Psychic = 'Psychic',
  Water = 'Water',
  Ground = 'Ground',
  Rock = 'Rock',
  Electric = 'Electric',
  Grass = 'Grass',
  Fighting = 'Fighting',
  Poison = 'Poison',
  Bug = 'Bug',
  Fairy = 'Fairy',
  Ghost = 'Ghost',
  Dark = 'Dark',
  Steel = 'Steel',
  Dragon = 'Dragon',
  Dupa = 'Dupa',
}`;

describe('EnumRenderer', function() {
  test('should render simple model', async function() {
    const commonModel = CommonModel.toCommonModel(input);
    const generator = new EnumRenderer(commonModel, "Type", new CommonInputModel());

    const model = generator.render();
    expect(model).toEqual(expected);
  });
});
