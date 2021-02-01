import { CommonModel, CommonInputModel } from '../../../../src/models';
import { ClassRenderer } from '../../../../src/generators/javascript/renderers';
import { TypeScriptOptions } from '../../../../src/generators';
import { FormatHelpers, IndentationTypes } from '../../../../src/helpers';

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

describe('ClassRenderer', function() {
  const options: TypeScriptOptions = {
    indentation: {
      size: 2,
      type: IndentationTypes.SPACES,
    },
    namingConvention: FormatHelpers.camelCase,
    renderTypes: true,
  }

  test('should render simple model with types (for TS)', async function() {
    const expected = `interface SimpleClassInput {
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
}

class SimpleClass {
  /**
   * A unique identifier for this pokémon.
   * Higher ids generally imply rarer and more evolved pokémon.
   */
  private id?: number;
  private num?: string;
  private name?: string;
  /**
   * Photographic evidence of this pokémon's existence
   */
  private img?: string;
  private height?: string;
  private weight?: string;
  /**
   * The flavor of candy preferred by this pokémon
   */
  private candy?: string;
  private candy_count?: number;
  private egg?: string;
  private spawn_chance?: number;
  private avg_spawns?: number;
  private spawn_time?: string;
      
  constructor(input: SimpleClassInput) {
    this.id = input.id;
    this.num = input.num;
    this.name = input.name;
    this.img = input.img;
    this.height = input.height;
    this.weight = input.weight;
    this.candy = input.candy;
    this.candy_count = input.candy_count;
    this.egg = input.egg;
    this.spawn_chance = input.spawn_chance;
    this.avg_spawns = input.avg_spawns;
    this.spawn_time = input.spawn_time;
  }
      
  get id(): number { return this.id; }
  set id(id: number) { this.id = id; }

  get num(): string { return this.num; }
  set num(num: string) { this.num = num; }

  get name(): string { return this.name; }
  set name(name: string) { this.name = name; }

  get img(): string { return this.img; }
  set img(img: string) { this.img = img; }

  get height(): string { return this.height; }
  set height(height: string) { this.height = height; }

  get weight(): string { return this.weight; }
  set weight(weight: string) { this.weight = weight; }

  get candy(): string { return this.candy; }
  set candy(candy: string) { this.candy = candy; }

  get candy_count(): number { return this.candy_count; }
  set candy_count(candy_count: number) { this.candy_count = candy_count; }

  get egg(): string { return this.egg; }
  set egg(egg: string) { this.egg = egg; }

  get spawn_chance(): number { return this.spawn_chance; }
  set spawn_chance(spawn_chance: number) { this.spawn_chance = spawn_chance; }

  get avg_spawns(): number { return this.avg_spawns; }
  set avg_spawns(avg_spawns: number) { this.avg_spawns = avg_spawns; }

  get spawn_time(): string { return this.spawn_time; }
  set spawn_time(spawn_time: string) { this.spawn_time = spawn_time; }
}`;

    const commonModel = CommonModel.toCommonModel(input);
    const generator = new ClassRenderer(commonModel, "SimpleClass", new CommonInputModel(), options);

    const model = generator.render();
    expect(model).toEqual(expected);
  });

  test('should render simple model without types (for vanilla JS)', async function() {
    const expected = `class SimpleClass {
  /**
   * A unique identifier for this pokémon.
   * Higher ids generally imply rarer and more evolved pokémon.
   */
  id;
  num;
  name;
  /**
   * Photographic evidence of this pokémon's existence
   */
  img;
  height;
  weight;
  /**
   * The flavor of candy preferred by this pokémon
   */
  candy;
  candy_count;
  egg;
  spawn_chance;
  avg_spawns;
  spawn_time;
      
  constructor(input) {
    this.id = input.id;
    this.num = input.num;
    this.name = input.name;
    this.img = input.img;
    this.height = input.height;
    this.weight = input.weight;
    this.candy = input.candy;
    this.candy_count = input.candy_count;
    this.egg = input.egg;
    this.spawn_chance = input.spawn_chance;
    this.avg_spawns = input.avg_spawns;
    this.spawn_time = input.spawn_time;
  }
      
  get id() { return this.id; }
  set id(id) { this.id = id; }

  get num() { return this.num; }
  set num(num) { this.num = num; }

  get name() { return this.name; }
  set name(name) { this.name = name; }

  get img() { return this.img; }
  set img(img) { this.img = img; }

  get height() { return this.height; }
  set height(height) { this.height = height; }

  get weight() { return this.weight; }
  set weight(weight) { this.weight = weight; }

  get candy() { return this.candy; }
  set candy(candy) { this.candy = candy; }

  get candy_count() { return this.candy_count; }
  set candy_count(candy_count) { this.candy_count = candy_count; }

  get egg() { return this.egg; }
  set egg(egg) { this.egg = egg; }

  get spawn_chance() { return this.spawn_chance; }
  set spawn_chance(spawn_chance) { this.spawn_chance = spawn_chance; }

  get avg_spawns() { return this.avg_spawns; }
  set avg_spawns(avg_spawns) { this.avg_spawns = avg_spawns; }

  get spawn_time() { return this.spawn_time; }
  set spawn_time(spawn_time) { this.spawn_time = spawn_time; }
}`;

    const commonModel = CommonModel.toCommonModel(input);
    const generator = new ClassRenderer(commonModel, "SimpleClass", new CommonInputModel(), { ...options, renderTypes: false });

    const model = generator.render();
    expect(model).toEqual(expected);
  });
});
