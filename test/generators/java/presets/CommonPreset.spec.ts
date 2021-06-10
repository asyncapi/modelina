import { JavaGenerator, JAVA_COMMON_PRESET } from '../../../../src/generators'; 

describe('JAVA_COMMON_PRESET', () => {
  test('should render common function in class by common preset', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      properties: {
        stringProp: { type: 'string' },
        numberProp: { type: 'number' },
      },
    };
    const expected = `public class Clazz {
  private String stringProp;
  private Double numberProp;
  private Map<string, Object> additionalProperties;

  public String getStringProp() { return this.stringProp; }
  public void setStringProp(String stringProp) { this.stringProp = stringProp; }

  public Double getNumberProp() { return this.numberProp; }
  public void setNumberProp(Double numberProp) { this.numberProp = numberProp; }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Clazz self = (Clazz) o;
      return 
        Objects.equals(this.stringProp, self.stringProp) &&
        Objects.equals(this.numberProp, self.numberProp);
  }

  @Override
  public int hashCode() {
    return Objects.hash(stringProp, numberProp);
  }

  @Override
  public String toString() {
    return "class Clazz {\\n" +   
      "    stringProp: " + toIndentedString(stringProp) + "\\n" +
      "    numberProp: " + toIndentedString(numberProp) + "\\n" +
    "}";
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\\n", "\\n    ");
  }
}`;

    const generator = new JavaGenerator({ presets: [JAVA_COMMON_PRESET] });
    const inputModel = await generator.process(doc);
    const model = inputModel.models['Clazz'];

    const classModel = await generator.renderClass(model, inputModel);
    expect(classModel).toEqual(expected);
  });

  test('should skip rendering of disabled functions', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      properties: {
        stringProp: { type: 'string' },
        numberProp: { type: 'number' },
      },
    };
    const expected = `public class Clazz {
  private String stringProp;
  private Double numberProp;
  private Map<string, Object> additionalProperties;

  public String getStringProp() { return this.stringProp; }
  public void setStringProp(String stringProp) { this.stringProp = stringProp; }

  public Double getNumberProp() { return this.numberProp; }
  public void setNumberProp(Double numberProp) { this.numberProp = numberProp; }

  @Override
  public int hashCode() {
    return Objects.hash(stringProp, numberProp);
  }
}`;

    const generator = new JavaGenerator({ presets: [{
      preset: JAVA_COMMON_PRESET,
      options: {
        equal: false,
        classToString: false,
      }
    }] });
    const inputModel = await generator.process(doc);
    const model = inputModel.models['Clazz'];

    const classModel = await generator.renderClass(model, inputModel);
    expect(classModel).toEqual(expected);
  });
});
