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
        array_type:     { type: "array", items: [{ type: "string" }, { type: "number" }] },
      },
      required: ["street_name", "city", "state", "house_number", "array_type"],
    };
    const expected = `public class Address {
  private String streetName;
  private String city;
  private String state;
  private Double houseNumber;
  private Boolean marriage;
  private Object members;
  private Array<Object> arrayType;

  public String getStreetName() { return this.streetName; }
  public void setStreetName(String streetName) { this.streetName = streetName; }

  public String getCity() { return this.city; }
  public void setCity(String city) { this.city = city; }

  public String getState() { return this.state; }
  public void setState(String state) { this.state = state; }

  public Double getHouseNumber() { return this.houseNumber; }
  public void setHouseNumber(Double houseNumber) { this.houseNumber = houseNumber; }

  public Boolean getMarriage() { return this.marriage; }
  public void setMarriage(Boolean marriage) { this.marriage = marriage; }

  public Object getMembers() { return this.members; }
  public void setMembers(Object members) { this.members = members; }

  public Array<Object> getArrayType() { return this.arrayType; }
  public void setArrayType(Array<Object> arrayType) { this.arrayType = arrayType; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Address"];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel).toEqual(expected);

    classModel = await generator.render(model, inputModel);
    expect(classModel).toEqual(expected);
  });

  test('should render `enum` type (string type)', async function() {
    const doc = {
      $id: "States",
      type: "string",
      enum: ["Texas", "Alabama", "California", "New York"],
    };
    const expected = `public enum States {
  TEXAS("Texas"), ALABAMA("Alabama"), CALIFORNIA("California"), NEW_YORK("New York");

  private String value;
    
  States(String value) {
    this.value = value;
  }
    
  @JsonValue
  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static States fromValue(String value) {
    for (States e : States.values()) {
      if (e.value.equals(value)) {
        return e;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["States"];

    let enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel).toEqual(expected);

    enumModel = await generator.render(model, inputModel);
    expect(enumModel).toEqual(expected);
  });

  test('should render `enum` type (integer type)', async function() {
    const doc = {
      $id: "Numbers",
      type: "integer",
      enum: [0, 1, 2, 3],
    };
    const expected = `public enum Numbers {
  NUMBER_0(0), NUMBER_1(1), NUMBER_2(2), NUMBER_3(3);

  private Integer value;
    
  Numbers(Integer value) {
    this.value = value;
  }
    
  @JsonValue
  public Integer getValue() {
    return value;
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static Numbers fromValue(Integer value) {
    for (Numbers e : Numbers.values()) {
      if (e.value.equals(value)) {
        return e;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Numbers"];

    let enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel).toEqual(expected);

    enumModel = await generator.render(model, inputModel);
    expect(enumModel).toEqual(expected);
  });

  test('should render `enum` type (union type)', async function() {
    const doc = {
      $id: "Union",
      type: ["string", "integer", "boolean"],
      enum: ["Texas", "Alabama", 0, 1, true],
    };
    const expected = `public enum Union {
  TEXAS("Texas"), ALABAMA("Alabama"), NUMBER_0(0), NUMBER_1(1), BOOLEAN_TRUE(true);

  private Object value;
    
  Union(Object value) {
    this.value = value;
  }
    
  @JsonValue
  public Object getValue() {
    return value;
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static Union fromValue(Object value) {
    for (Union e : Union.values()) {
      if (e.value.equals(value)) {
        return e;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Union"];

    let enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel).toEqual(expected);

    enumModel = await generator.render(model, inputModel);
    expect(enumModel).toEqual(expected);
  });
});
