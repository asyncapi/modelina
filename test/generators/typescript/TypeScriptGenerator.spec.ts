import { TypeScriptGenerator } from '../../../src/generators'; 

describe('TypeScriptGenerator', () => {
  let generator: TypeScriptGenerator;
  beforeEach(() => {
    generator = new TypeScriptGenerator();
  });

  test('should not render `class` with reserved keyword', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        enum: { type: 'string' },
        reservedEnum: { type: 'string' }
      },
      additionalProperties: false
    };
    const expected = `export class Address {
  private _reservedReservedEnum?: string;
  private _reservedEnum?: string;

  constructor(input: {
    reservedReservedEnum?: string,
    reservedEnum?: string,
  }) {
    this._reservedReservedEnum = input.reservedReservedEnum;
    this._reservedEnum = input.reservedEnum;
  }

  get reservedReservedEnum(): string | undefined { return this._reservedReservedEnum; }
  set reservedReservedEnum(reservedReservedEnum: string | undefined) { this._reservedReservedEnum = reservedReservedEnum; }

  get reservedEnum(): string | undefined { return this._reservedEnum; }
  set reservedEnum(reservedEnum: string | undefined) { this._reservedEnum = reservedEnum; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Address'];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toEqual(expected);

    classModel = await generator.render(model, inputModel);
    expect(classModel.result).toEqual(expected);
  });

  test('should render `class` type', async () => {
    const doc = {
      $id: '_address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: { type: 'boolean', description: 'Status if marriage live in given house' },
        members: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }], },
        tuple_type: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: false },
        tuple_type_with_additional_items: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: true },
        array_type: { type: 'array', items: { type: 'string' } },
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
    };
    const expected = `export class Address {
  private _streetName: string;
  private _city: string;
  private _state: string;
  private _houseNumber: number;
  private _marriage?: boolean;
  private _members?: string | number | boolean;
  private _tupleType?: [string, number];
  private _tupleTypeWithAdditionalItems?: [string, number, ...(object | string | number | Array<unknown> | boolean | null | number)[]];
  private _arrayType: Array<string>;
  private _additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;
  private _sTestPatternProperties?: Map<String, string>;

  constructor(input: {
    streetName: string,
    city: string,
    state: string,
    houseNumber: number,
    marriage?: boolean,
    members?: string | number | boolean,
    tupleType?: [string, number],
    tupleTypeWithAdditionalItems?: [string, number, ...(object | string | number | Array<unknown> | boolean | null | number)[]],
    arrayType: Array<string>,
  }) {
    this._streetName = input.streetName;
    this._city = input.city;
    this._state = input.state;
    this._houseNumber = input.houseNumber;
    this._marriage = input.marriage;
    this._members = input.members;
    this._tupleType = input.tupleType;
    this._tupleTypeWithAdditionalItems = input.tupleTypeWithAdditionalItems;
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

  get marriage(): boolean | undefined { return this._marriage; }
  set marriage(marriage: boolean | undefined) { this._marriage = marriage; }

  get members(): string | number | boolean | undefined { return this._members; }
  set members(members: string | number | boolean | undefined) { this._members = members; }

  get tupleType(): [string, number] | undefined { return this._tupleType; }
  set tupleType(tupleType: [string, number] | undefined) { this._tupleType = tupleType; }

  get tupleTypeWithAdditionalItems(): [string, number, ...(object | string | number | Array<unknown> | boolean | null | number)[]] | undefined { return this._tupleTypeWithAdditionalItems; }
  set tupleTypeWithAdditionalItems(tupleTypeWithAdditionalItems: [string, number, ...(object | string | number | Array<unknown> | boolean | null | number)[]] | undefined) { this._tupleTypeWithAdditionalItems = tupleTypeWithAdditionalItems; }

  get arrayType(): Array<string> { return this._arrayType; }
  set arrayType(arrayType: Array<string>) { this._arrayType = arrayType; }

  get additionalProperties(): Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined) { this._additionalProperties = additionalProperties; }

  get sTestPatternProperties(): Map<String, string> | undefined { return this._sTestPatternProperties; }
  set sTestPatternProperties(sTestPatternProperties: Map<String, string> | undefined) { this._sTestPatternProperties = sTestPatternProperties; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['_address'];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual([]);

    classModel = await generator.render(model, inputModel);
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual([]);
  });

  test('should work custom preset for `class` type', async () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      properties: {
        property: { type: 'string' },
      }
    };
    const expected = `export class CustomClass {
  @JsonProperty("property")
  private _property?: string;
  @JsonProperty("additionalProperties")
  private _additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;

  constructor(input: {
    property?: string,
  }) {
    this._property = input.property;
  }

  get property(): string | undefined { return this._property; }
  set property(property: string | undefined) { this._property = property; }

  get additionalProperties(): Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined) { this._additionalProperties = additionalProperties; }
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
    const model = inputModel.models['CustomClass'];
    
    const classModel = await generator.render(model, inputModel);
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual([]);
  });

  test('should render `interface` type', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: { type: 'boolean', description: 'Status if marriage live in given house' },
        members: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }], },
        tuple_type: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: false },
        tuple_type_with_additional_items: { type: 'array', items: [{ type: 'string' }, { type: 'number' }], additionalItems: true },
        array_type: { type: 'array', items: { type: 'string' } },
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
    };
    const expected = `export interface Address {
  streetName: string;
  city: string;
  state: string;
  houseNumber: number;
  marriage?: boolean;
  members?: string | number | boolean;
  tupleType?: [string, number];
  tupleTypeWithAdditionalItems?: [string, number, ...(object | string | number | Array<unknown> | boolean | null | number)[]];
  arrayType: Array<string>;
  additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;
  sTestPatternProperties?: Map<String, string>;
}`;

    const interfaceGenerator = new TypeScriptGenerator({modelType: 'interface'});
    const inputModel = await interfaceGenerator.process(doc);
    const model = inputModel.models['Address'];

    const interfaceModel = await interfaceGenerator.render(model, inputModel);
    expect(interfaceModel.result).toEqual(expected);
    expect(interfaceModel.dependencies).toEqual([]);
  });

  test('should work custom preset for `interface` type', async () => {
    const doc = {
      $id: 'CustomInterface',
      type: 'object',
      properties: {
        property: { type: 'string' },
      }
    };
    const expected = `export interface CustomInterface {
  property?: string;
  additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;
}`;

    generator = new TypeScriptGenerator({ presets: [
      {
        interface: {
          self({ content }) {
            return content;
          },
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models['CustomInterface'];

    const interfaceModel = await generator.renderInterface(model, inputModel);
    expect(interfaceModel.result).toEqual(expected);
    expect(interfaceModel.dependencies).toEqual([]);
  });

  test('should render `enum` type', async () => {
    const doc = {
      $id: 'States',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California'],
    };
    const expected = `export enum States {
  TEXAS = "Texas",
  ALABAMA = "Alabama",
  CALIFORNIA = "California",
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['States'];

    let enumModel = await generator.render(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual([]);
    
    enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual([]);
  });

  test('should work custom preset for `enum` type', async () => {
    const doc = {
      $id: 'CustomEnum',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California'],
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
            return content;
          },
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models['CustomEnum'];
    
    let enumModel = await generator.render(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual([]);
    
    enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual([]);
  });

  test('should render `type` type - primitive', async () => {
    const doc = {
      $id: 'TypePrimitive',
      type: 'string',
    };
    const expected = 'export type TypePrimitive = string;';

    const inputModel = await generator.process(doc);
    const model = inputModel.models['TypePrimitive'];

    let primitiveModel = await generator.renderType(model, inputModel);
    expect(primitiveModel.result).toEqual(expected);
    expect(primitiveModel.dependencies).toEqual([]);

    primitiveModel = await generator.render(model, inputModel);
    expect(primitiveModel.result).toEqual(expected);
    expect(primitiveModel.dependencies).toEqual([]);
  });

  test('should render `type` type - enum', async () => {
    const doc = {
      $id: 'TypeEnum',
      enum: ['Texas', 'Alabama', 'California', 0, 1, false, true],
    };
    const expected = 'export type TypeEnum = "Texas" | "Alabama" | "California" | 0 | 1 | false | true;';

    const inputModel = await generator.process(doc);
    const model = inputModel.models['TypeEnum'];

    const enumModel = await generator.renderType(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual([]);
  });

  test('should render `type` type - union', async () => {
    const doc = {
      $id: 'TypeUnion',
      type: ['string', 'number', 'boolean'],
    };
    const expected = 'export type TypeUnion = string | number | boolean;';

    const inputModel = await generator.process(doc);
    const model = inputModel.models['TypeUnion'];

    const unionModel = await generator.renderType(model, inputModel);
    expect(unionModel.result).toEqual(expected);
    expect(unionModel.dependencies).toEqual([]);
  });

  test('should render `type` type - array of primitive type', async () => {
    const doc = {
      $id: 'TypeArray',
      type: 'array',
      items: {
        $id: 'StringArray',
        type: 'string',
      }
    };
    const expected = 'export type TypeArray = Array<string>;';

    const inputModel = await generator.process(doc);
    const model = inputModel.models['TypeArray'];

    const arrayModel = await generator.renderType(model, inputModel);
    expect(arrayModel.result).toEqual(expected);
    expect(arrayModel.dependencies).toEqual([]);
  });

  test('should render `type` type - array of union type', async () => {
    const doc = {
      $id: 'TypeArray',
      type: 'array',
      items: {
        $id: 'StringArray',
        type: ['string', 'number', 'boolean'],
      }
    };
    const expected = 'export type TypeArray = Array<string | number | boolean>;';

    const inputModel = await generator.process(doc);
    const model = inputModel.models['TypeArray'];

    const arrayModel = await generator.renderType(model, inputModel);
    expect(arrayModel.result).toEqual(expected);
    expect(arrayModel.dependencies).toEqual([]);
  });
});
