import { CommonModel, CommonInputModel } from '../../../../src/models';
import { InterfaceRenderer } from '../../../../src/generators/javascript/renderers';

const input = {
    "type": "object",
    "additionalProperties": false,
    "description": "A 'pocket monster.' One must catch them all.",
    "properties": {
      "id": {
        "description": "A unique identifier for this pokémon.\nHigher ids generally imply rarer and more evolved pokémon.",
        "type": "integer"
      },
      "num": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "img": {
        "description": "Photographic evidence of this pokémon's existence",
        "type": "string"
      },
      "height": {
        "type": "string"
      },
      "weight": {
        "type": "string"
      },
      "candy": {
        "description": "The flavor of candy preferred by this pokémon",
        "type": "string"
      },
      "candy_count": {
        "type": "integer"
      },
      "egg": {
        "type": "string",
        "enum": [
          "2 km",
          "Not in Eggs",
          "5 km",
          "10 km",
          "Omanyte Candy"
        ],
        "title": "egg"
      },
      "spawn_chance": {
        "type": "number"
      },
      "avg_spawns": {
        "type": "number"
      },
      "spawn_time": {
        "type": "string"
      },
    },
    "required": [
      "avg_spawns",
      "candy",
      "egg",
      "height",
      "id",
      "img",
      "multipliers",
      "name",
      "num",
      "spawn_chance",
      "spawn_time",
      "type",
      "weaknesses",
      "weight"
    ],
    "title": "pokemon"
}
const exprected = `interface SimpleInterface {
  /**
   * A unique identifier for this pokémon.
   * Higher ids generally imply rarer and more evolved pokémon.
   */
  id?: number;
  num?: string;
  name?: string;
  /**
   * Photographic evidence of this pokémon's existence
   */
  img?: string;
  height?: string;
  weight?: string;
  /**
   * The flavor of candy preferred by this pokémon
   */
  candy?: string;
  candy_count?: number;
  egg?: string;
  spawn_chance?: number;
  avg_spawns?: number;
  spawn_time?: string;
}`;

describe('InterfaceRenderer', function() {
  test('should render simple model', async function() {
    const commonModel = CommonModel.toCommonModel(input);
    const generator = new InterfaceRenderer(commonModel, "SimpleInterface", new CommonInputModel());

    const model = generator.render();
    expect(model).toEqual(exprected);
  });
});
