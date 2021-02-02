import { TypeScriptGenerator } from '../../../src/generators'; 

describe('TypeScriptGenerator', function() {
  let generator: TypeScriptGenerator;
  beforeEach(() => {
    generator = new TypeScriptGenerator();
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
  street_name: string;
  /**
   * City description
   */
  city: string;
  state: string;
  house_number: number;
  /**
   * Status if marriage live in given house
   */
  marriage?: boolean;
  members?: string | number | boolean;
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Address"];

    let interfaceModel = await generator.renderInterface(model, "Address", inputModel);
    expect(interfaceModel).toEqual(expected);

    interfaceModel = await generator.render(model, "Address", inputModel);
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
