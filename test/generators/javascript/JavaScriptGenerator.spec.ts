import { JavaScriptGenerator } from '../../../src/generators'; 

describe('JavaScriptGenerator', () => {
  let generator: JavaScriptGenerator;
  beforeEach(() => {
    generator = new JavaScriptGenerator();
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
    const expected = `class Address {
  reservedReservedEnum;
  reservedEnum;

  constructor(input) {
    this.reservedReservedEnum = input.reservedReservedEnum;
    this.reservedEnum = input.reservedEnum;
  }

  get reservedReservedEnum() { return this.reservedReservedEnum; }
  set reservedReservedEnum(reservedReservedEnum) { this.reservedReservedEnum = reservedReservedEnum; }

  get reservedEnum() { return this.reservedEnum; }
  set reservedEnum(reservedEnum) { this.reservedEnum = reservedEnum; }
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
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: { type: 'boolean', description: 'Status if marriage live in given house' },
        members: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }], },
        array_type: { type: 'array', items: [{ type: 'string' }, { type: 'number' }] },
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
    };
    const expected = `class Address {
  streetName;
  city;
  state;
  houseNumber;
  marriage;
  members;
  arrayType;
  additionalProperties;
  sTestPatternProperties;

  constructor(input) {
    this.streetName = input.streetName;
    this.city = input.city;
    this.state = input.state;
    this.houseNumber = input.houseNumber;
    this.marriage = input.marriage;
    this.members = input.members;
    this.arrayType = input.arrayType;
  }

  get streetName() { return this.streetName; }
  set streetName(streetName) { this.streetName = streetName; }

  get city() { return this.city; }
  set city(city) { this.city = city; }

  get state() { return this.state; }
  set state(state) { this.state = state; }

  get houseNumber() { return this.houseNumber; }
  set houseNumber(houseNumber) { this.houseNumber = houseNumber; }

  get marriage() { return this.marriage; }
  set marriage(marriage) { this.marriage = marriage; }

  get members() { return this.members; }
  set members(members) { this.members = members; }

  get arrayType() { return this.arrayType; }
  set arrayType(arrayType) { this.arrayType = arrayType; }

  get additionalProperties() { return this.additionalProperties; }
  set additionalProperties(additionalProperties) { this.additionalProperties = additionalProperties; }

  get sTestPatternProperties() { return this.sTestPatternProperties; }
  set sTestPatternProperties(sTestPatternProperties) { this.sTestPatternProperties = sTestPatternProperties; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Address'];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual([]);

    classModel = await generator.render(model, inputModel);
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual([]);
  });

  test('should not render another type than `object`', async () => {
    const doc = {
      $id: 'AnyType',
      type: ['string', 'number'],
    };
    const expected = '';

    const inputModel = await generator.process(doc);
    const model = inputModel.models['AnyType'];

    const anyModel = await generator.render(model, inputModel);
    expect(anyModel.result).toEqual(expected);
    expect(anyModel.dependencies).toEqual([]);
  });

  test('should work custom preset for `class` type', async () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      properties: {
        property: { type: 'string' },
      },
      additionalProperties: false
    };
    const expected = `export class CustomClass {
  #property;

  constructor(input) {
    this.#property = input.property;
  }

  get property() { return this.#property; }
  set property(property) { this.#property = property; }
}`;

    generator = new JavaScriptGenerator({ presets: [
      {
        class: {
          self({ content }) {
            return `export ${content}`;
          },
          property({ content }) {
            return `#${content}`;
          },
          ctor() {
            return `constructor(input) {
  this.#property = input.property;
}`;
          },
          getter() {
            return 'get property() { return this.#property; }';
          },
          setter() {
            return 'set property(property) { this.#property = property; }';
          }
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models['CustomClass'];
    
    const classModel = await generator.render(model, inputModel);
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual([]);
  });
});
