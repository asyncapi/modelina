import { TypeScriptGenerator } from '../../../src/generators'; 

describe('TypeScriptGenerator', function() {
  let generator: TypeScriptGenerator;
  beforeEach(() => {
    generator = new TypeScriptGenerator();
  });

  test('should render `class` type', async function() {
    const doc = {
      $id: "Address",
      type: "object",
      properties: {
        street_name:    { type: "string" },
        city:           { type: "string", description: "City description" },
        state:          { type: "string" },
        house_number:   { type: "number" },
        marriage:       { type: "boolean", description: "Status if marriage live in given house" },
        members:        { oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }], },
        array_type:     { type: "array", items: [{ type: "string" }, { type: "number" }] },
      },
      required: ["street_name", "city", "state", "house_number", "array_type"],
    };
    const expected = `interface AddressInput {
  street_name?: string;
  city?: string;
  state?: string;
  house_number?: number;
  marriage?: boolean;
  members?: string | number | boolean;
  array_type?: Array<string | number>;
}

class Address {
  street_name?: string;
  city?: string;
  state?: string;
  house_number?: number;
  marriage?: boolean;
  members?: string | number | boolean;
  array_type?: Array<string | number>;
      
  constructor(input: AddressInput) {
    this.street_name = input.street_name;
    this.city = input.city;
    this.state = input.state;
    this.house_number = input.house_number;
    this.marriage = input.marriage;
    this.members = input.members;
    this.array_type = input.array_type;
  }
      
  get street_name(): string { return this.street_name; }
  set street_name(street_name: string) { this.street_name = street_name; }

  get city(): string { return this.city; }
  set city(city: string) { this.city = city; }

  get state(): string { return this.state; }
  set state(state: string) { this.state = state; }

  get house_number(): number { return this.house_number; }
  set house_number(house_number: number) { this.house_number = house_number; }

  get marriage(): boolean { return this.marriage; }
  set marriage(marriage: boolean) { this.marriage = marriage; }

  get members(): string | number | boolean { return this.members; }
  set members(members: string | number | boolean) { this.members = members; }

  get array_type(): Array<string | number> { return this.array_type; }
  set array_type(array_type: Array<string | number>) { this.array_type = array_type; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Address"];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel).toEqual(expected);

    classModel = await generator.render(model, inputModel);
    expect(classModel).toEqual(expected);
  });

  test('should render `interface` type', async function() {
    const doc = {
      $id: "Address",
      type: "object",
      properties: {
        street_name:    { type: "string" },
        city:           { type: "string", description: "City description" },
        state:          { type: "string" },
        house_number:   { type: "number" },
        marriage:       { type: "boolean", description: "Status if marriage live in given house" },
        members:        { oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }], },
        array_type:     { type: "array", items: [{ type: "string" }, { type: "number" }] },
      },
      required: ["street_name", "city", "state", "house_number", "array_type"],
    };
    const expected = `interface Address {
  street_name?: string;
  city?: string;
  state?: string;
  house_number?: number;
  marriage?: boolean;
  members?: string | number | boolean;
  array_type?: Array<string | number>;
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Address"];

    let interfaceModel = await generator.renderInterface(model, inputModel);
    expect(interfaceModel).toEqual(expected);
  });

  test('should render `enum` type', async function() {
    const doc = {
      $id: "States",
      type: "string",
      enum: ["Texas", "Alabama", "California"],
    };
    const expected = `enum States {
  Texas = "Texas",
  Alabama = "Alabama",
  California = "California",
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["States"];

    let enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel).toEqual(expected);

    enumModel = await generator.render(model, inputModel);
    expect(enumModel).toEqual(expected);
  });

  test('should render `type` type - primitive', async function() {
    const doc = {
      $id: "TypePrimitive",
      type: "string",
    };
    const expected = `type TypePrimitive = string;`

    const inputModel = await generator.process(doc);
    const model = inputModel.models["TypePrimitive"];

    let primitiveModel = await generator.renderType(model, inputModel);
    expect(primitiveModel).toEqual(expected);

    primitiveModel = await generator.render(model, inputModel);
    expect(primitiveModel).toEqual(expected);
  });

  test('should render `type` type - enum', async function() {
    const doc = {
      $id: "TypeEnum",
      enum: ["Texas", "Alabama", "California", 0, 1, false, true],
    };
    const expected = `type TypeEnum = "Texas" | "Alabama" | "California" | 0 | 1 | false | true;`

    const inputModel = await generator.process(doc);
    const model = inputModel.models["TypeEnum"];

    const enumModel = await generator.renderType(model, inputModel);
    expect(enumModel).toEqual(expected);
  });

  test('should render `type` type - union', async function() {
    const doc = {
      $id: "TypeUnion",
      type: ["string", "number", "boolean"],
    };
    const expected = `type TypeUnion = string | number | boolean;`

    const inputModel = await generator.process(doc);
    const model = inputModel.models["TypeUnion"];

    const unionModel = await generator.renderType(model, inputModel);
    expect(unionModel).toEqual(expected);
  });

  test('should render `type` type - array of primitive type', async function() {
    const doc = {
      $id: "TypeArray",
      type: "array",
      items: {
        $id: "StringArray",
        type: "string",
      }
    };
    const expected = `type TypeArray = Array<string>;`

    const inputModel = await generator.process(doc);
    const model = inputModel.models["TypeArray"];

    const arrayModel = await generator.renderType(model, inputModel);
    expect(arrayModel).toEqual(expected);
  });

  test('should render `type` type - array of union type', async function() {
    const doc = {
      $id: "TypeArray",
      type: "array",
      items: {
        $id: "StringArray",
        type: ["string", "number", "boolean"],
      }
    };
    const expected = `type TypeArray = Array<string | number | boolean>;`

    const inputModel = await generator.process(doc);
    const model = inputModel.models["TypeArray"];

    const arrayModel = await generator.renderType(model, inputModel);
    expect(arrayModel).toEqual(expected);
  });

  test('should render `type` type - object (as interface)', async function() {
    const doc = {
      $id: "TypeObject",
      type: "object",
      properties: {
        street_name:    { type: "string" },
        city:           { type: "string", description: "City description" },
        state:          { type: "string" },
        house_number:   { type: "number" },
        marriage:       { type: "boolean", description: "Status if marriage live in given house" },
        members:        { oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }], },
        array_type:     { type: "array", items: [{ type: "string" }, { type: "number" }] },
      },
      required: ["street_name", "city", "state", "house_number", "array_type"],
    };
    const expected = `type TypeObject = {
  street_name?: string;
  city?: string;
  state?: string;
  house_number?: number;
  marriage?: boolean;
  members?: string | number | boolean;
  array_type?: Array<string | number>;
};`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["TypeObject"];

    const objectModel = await generator.renderType(model, inputModel);
    expect(objectModel).toEqual(expected);
  });
});
