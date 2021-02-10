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
    const expected = `class Address {
  private streetName?: string;
  private city?: string;
  private state?: string;
  private houseNumber?: number;
  private marriage?: boolean;
  private members?: string | number | boolean;
  private arrayType?: Array<string | number>;
      
  constructor(input: AddressInput) {
    this.streetName = input.streetName;
    this.city = input.city;
    this.state = input.state;
    this.houseNumber = input.houseNumber;
    this.marriage = input.marriage;
    this.members = input.members;
    this.arrayType = input.arrayType;
  }
      
  get streetName(): string { return this.streetName; }
  set streetName(streetName: string) { this.streetName = streetName; }

  get city(): string { return this.city; }
  set city(city: string) { this.city = city; }

  get state(): string { return this.state; }
  set state(state: string) { this.state = state; }

  get houseNumber(): number { return this.houseNumber; }
  set houseNumber(houseNumber: number) { this.houseNumber = houseNumber; }

  get marriage(): boolean { return this.marriage; }
  set marriage(marriage: boolean) { this.marriage = marriage; }

  get members(): string | number | boolean { return this.members; }
  set members(members: string | number | boolean) { this.members = members; }

  get arrayType(): Array<string | number> { return this.arrayType; }
  set arrayType(arrayType: Array<string | number>) { this.arrayType = arrayType; }
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
  private property?: string;
      
  constructor(input: CustomClassInput) {
    this.property = input.property;
  }
      
  get property(): string { return this.property; }
  set property(property: string) { this.property = property; }
}`;

    generator = new TypeScriptGenerator({ presets: [
      {
        class: {
          self({ content }) {
            return `export ${content}`;
          },
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
    const expected = `interface Address {
  streetName?: string;
  city?: string;
  state?: string;
  houseNumber?: number;
  marriage?: boolean;
  members?: string | number | boolean;
  arrayType?: Array<string | number>;
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
}`;

    generator = new TypeScriptGenerator({ presets: [
      {
        interface: {
          self({ content }) {
            return `export ${content}`;
          },
        }
      }
    ] });

    const inputModel = await generator.process(doc);
    const model = inputModel.models["CustomInterface"];
    
    const classModel = await generator.renderInterface(model, inputModel);
    expect(classModel).toEqual(expected);
  });

  test('should render `enum` type', async function() {
    const doc = {
      $id: "States",
      type: "string",
      enum: ["Texas", "Alabama", "California"],
    };
    const expected = `enum States {
  TEXAS = "Texas",
  ALABAMA = "Alabama",
  CALIFORNIA = "California",
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

//   test('should render `type` type - object (as interface)', async function() {
//     const doc = {
//       $id: "TypeObject",
//       type: "object",
//       properties: {
//         street_name:    { type: "string" },
//         city:           { type: "string", description: "City description" },
//         state:          { type: "string" },
//         house_number:   { type: "number" },
//         marriage:       { type: "boolean", description: "Status if marriage live in given house" },
//         members:        { oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }], },
//         array_type:     { type: "array", items: [{ type: "string" }, { type: "number" }] },
//       },
//       required: ["street_name", "city", "state", "house_number", "array_type"],
//     };
//     const expected = `type TypeObject = {
//   streetName?: string;
//   city?: string;
//   state?: string;
//   houseNumber?: number;
//   marriage?: boolean;
//   members?: string | number | boolean;
//   arrayType?: Array<string | number>;
// };`;

//     const inputModel = await generator.process(doc);
//     const model = inputModel.models["TypeObject"];

//     const objectModel = await generator.renderType(model, inputModel);
//     expect(objectModel).toEqual(expected);
//   });
});
