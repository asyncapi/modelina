import { JavaGenerator } from '../../../src/generators'; 

describe('TypeScriptGenerator', function() {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator();
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
    const expected = `public class Address {
  private String street_name;
  private String city;
  private String state;
  private double house_number;
  private boolean marriage;
  private Object members;

  public String getStreet_name() { return this.street_name; }
  public void setStreet_name(String value) { this.street_name = value; }

  public String getCity() { return this.city; }
  public void setCity(String value) { this.city = value; }

  public String getState() { return this.state; }
  public void setState(String value) { this.state = value; }

  public double getHouse_number() { return this.house_number; }
  public void setHouse_number(double value) { this.house_number = value; }

  public boolean getMarriage() { return this.marriage; }
  public void setMarriage(boolean value) { this.marriage = value; }

  public Object getMembers() { return this.members; }
  public void setMembers(Object value) { this.members = value; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Address"];

    let classModel = await generator.renderClass(model, "Address", inputModel);
    expect(classModel).toEqual(expected);

    classModel = await generator.render(model, "Address", inputModel);
    expect(classModel).toEqual(expected);
  });
});