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
      },
      required: ["street_name", "city", "state", "house_number"],
    }

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Address"];
    const interfaceModel = await generator.render(model, "Address", inputModel);
    
    expect(interfaceModel).toEqual(`interface Address {
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
}`);
  });

test('should render `enum` type', async function() {
    const doc = {
      $id: "States",
      type: "string",
      enum: ["Texas", "Alabama", "California"],
    }

    const inputModel = await generator.process(doc);
    const model = inputModel.models["States"];
    const enumModel = await generator.render(model, "States", inputModel);
    
    expect(enumModel).toEqual(`enum States {
  Texas = "Texas",
  Alabama = "Alabama",
  California = "California",
}`);
  });
});
