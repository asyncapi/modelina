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
    const expected = `export class Address {
  private _streetName: string;
  private _city: string;
  private _state: string;
  private _houseNumber: number;
  private _marriage?: boolean;
  private _members?: string | number | boolean;
  private _arrayType: Array<string | number>;
  private _additionalProperties: Record<string, object | string | number | Array<unknown> | boolean | null> = {};


  constructor(input: {
    streetName: string,
    city: string,
    state: string,
    houseNumber: number,
    marriage?: boolean,
    members?: string | number | boolean,
    arrayType: Array<string | number>,
  }) {
    this._streetName = input.streetName;
    this._city = input.city;
    this._state = input.state;
    this._houseNumber = input.houseNumber;
    this._marriage = input.marriage;
    this._members = input.members;
    this._arrayType = input.arrayType;
  }

  get streetName(): string { return this._streetName; }
  set streetName(streetName: string) { this._streetName = streetName; }

  get city(): string { return this._city; }
  set city(city: string) { this._city = city; }

  get state(): string { return this._state; }
  set state(state: string) { this._state = state; }

  get houseNumber(): number { return this._houseNumber; }
  set houseNumber(houseNumber: number) { this._houseNumber = houseNumber; }

  get marriage(): boolean { return this._marriage; }
  set marriage(marriage: boolean) { this._marriage = marriage; }

  get members(): string | number | boolean { return this._members; }
  set members(members: string | number | boolean) { this._members = members; }

  get arrayType(): Array<string | number> { return this._arrayType; }
  set arrayType(arrayType: Array<string | number>) { this._arrayType = arrayType; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Address"];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel).toEqual(expected);

    classModel = await generator.render(model, inputModel);
    expect(classModel).toEqual(expected);
  });

  test('should work custom preset for `class` type', async function() {
    const doc = {
      $id: "CustomClass",
      type: "object",
      properties: {
        property: { type: "string" },
      }
    };
    const expected = `export class CustomClass {
  @JsonProperty("property")
  private _property?: string;
  private _additionalProperties: Record<string, object | string | number | Array<unknown> | boolean | null> = {};

  constructor(input: {
    property?: string,
  }) {
    this._property = input.property;
  }

  get property(): string { return this._property; }
  set property(property: string) { this._property = property; }

  getAdditionalProperty(key: string): object | string | number | Array<unknown> | boolean | null { return _additionalProperties.get(key); }
  setAdditionalProperty(key: string, value: object | string | number | Array<unknown> | boolean | null) { _additionalProperties.set(key, value); }
}`;

    generator = new TypeScriptGenerator({ presets: [
      {
        class: {
          property({ propertyName, content }) {
            return `@JsonProperty("${propertyName}")
${content}`;
          },
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models["CustomClass"];
    
    const classModel = await generator.render(model, inputModel);
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
    const expected = `export interface Address {
  streetName: string;
  city: string;
  state: string;
  houseNumber: number;
  marriage?: boolean;
  members?: string | number | boolean;
  arrayType: Array<string | number>;
  additionalProperties: Record<string, object | string | number | Array<unknown> | boolean | null>;
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Address"];

    let interfaceModel = await generator.renderInterface(model, inputModel);
    expect(interfaceModel).toEqual(expected);
  });

  test('should work custom preset for `interface` type', async function() {
    const doc = {
      $id: "CustomInterface",
      type: "object",
      properties: {
        property: { type: "string" },
      }
    };
    const expected = `export interface CustomInterface {
  property?: string;
  additionalProperties: Record<string, object | string | number | Array<unknown> | boolean | null>;
}`;

    generator = new TypeScriptGenerator({ presets: [
      {
        interface: {
          self({ content }) {
            return `${content}`;
          },
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models["CustomInterface"];

    const interfaceModel = await generator.renderInterface(model, inputModel);
    expect(interfaceModel).toEqual(expected);
  });

  test('should render `enum` type', async function() {
    const doc = {
      $id: "States",
      type: "string",
      enum: ["Texas", "Alabama", "California"],
    };
    const expected = `export enum States {
  TEXAS = "Texas",
  ALABAMA = "Alabama",
  CALIFORNIA = "California",
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["States"];

    let enumModel = await generator.render(model, inputModel);
    expect(enumModel).toEqual(expected);
    
    enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel).toEqual(expected);
  });

  test('should work custom preset for `enum` type', async function() {
    const doc = {
      $id: "CustomEnum",
      type: "string",
      enum: ["Texas", "Alabama", "California"],
    };
    const expected = `export enum CustomEnum {
  TEXAS = "Texas",
  ALABAMA = "Alabama",
  CALIFORNIA = "California",
}`;

    generator = new TypeScriptGenerator({ presets: [
      {
        enum: {
          self({ content }) {
            return `${content}`;
          },
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models["CustomEnum"];
    
    let enumModel = await generator.render(model, inputModel);
    expect(enumModel).toEqual(expected);
    
    enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel).toEqual(expected);
  });

  test('should render `type` type - primitive', async function() {
    const doc = {
      $id: "TypePrimitive",
      type: "string",
    };
    const expected = `export type TypePrimitive = string;`

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
    const expected = `export type TypeEnum = "Texas" | "Alabama" | "California" | 0 | 1 | false | true;`

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
    const expected = `export type TypeUnion = string | number | boolean;`

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
    const expected = `export type TypeArray = Array<string>;`

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
    const expected = `export type TypeArray = Array<string | number | boolean>;`

    const inputModel = await generator.process(doc);
    const model = inputModel.models["TypeArray"];

    const arrayModel = await generator.renderType(model, inputModel);
    expect(arrayModel).toEqual(expected);
  });
});
