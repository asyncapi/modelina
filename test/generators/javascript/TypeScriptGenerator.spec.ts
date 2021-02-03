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
      },
      required: ["street_name", "city", "state", "house_number"],
    };
    const expected = `interface AddressInput {
  street_name?: string;
  city?: string;
  state?: string;
  house_number?: number;
  marriage?: boolean;
  members?: string | number | boolean;
}

class Address {
  street_name?: string;
  city?: string;
  state?: string;
  house_number?: number;
  marriage?: boolean;
  members?: string | number | boolean;
      
  constructor(input: AddressInput) {
    this.street_name = input.street_name;
    this.city = input.city;
    this.state = input.state;
    this.house_number = input.house_number;
    this.marriage = input.marriage;
    this.members = input.members;
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
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Address"];

    let classModel = await generator.renderClass(model, "Address", inputModel);
    expect(classModel).toEqual(expected);

    classModel = await generator.render(model, "Address", inputModel);
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
      },
      required: ["street_name", "city", "state", "house_number"],
    };
    const expected = `interface Address {
  street_name?: string;
  city?: string;
  state?: string;
  house_number?: number;
  marriage?: boolean;
  members?: string | number | boolean;
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Address"];

    let interfaceModel = await generator.renderInterface(model, "Address", inputModel);
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

    let enumModel = await generator.renderEnum(model, "States", inputModel);
    expect(enumModel).toEqual(expected);

    enumModel = await generator.render(model, "States", inputModel);
    expect(enumModel).toEqual(expected);
  });
});
