import { JavaGenerator, JAVA_DESCRIPTION_PRESET } from '../../../../src/generators'; 

describe('JAVA_DESCRIPTION_PRESET', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator({ presets: [JAVA_DESCRIPTION_PRESET] });
  });

  test('should render description and examples for class', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      description: 'Description for class',
      examples: [{ prop: 'value' }],
      properties: {
        prop: { type: 'string', description: 'Description for prop', examples: ['exampleValue'] },
      },
    };
    const expected = `/**
 * Description for class
 * Examples: {"prop":"value"}
 */
public class Clazz {
  private String prop;
  private Map<String, Object> additionalProperties;

  /**
   * Description for prop
   * Examples: exampleValue
   */
  public String getProp() { return this.prop; }
  public void setProp(String prop) { this.prop = prop; }

  public Map<String, Object> getAdditionalProperties() { return this.additionalProperties; }
  public void setAdditionalProperties(Map<String, Object> additionalProperties) { this.additionalProperties = additionalProperties; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Clazz'];

    const classModel = await generator.renderClass(model, inputModel);
    const expectedDependencies = ['import java.util.Map;'];
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual(expectedDependencies);
  });

  test('should render description and examples for enum', async () => {
    const doc = {
      $id: 'Enum',
      type: 'string',
      description: 'Description for enum',
      examples: ['value'],
      enum: [
        'on',
        'off',
      ]
    };
    const expected = `/**
 * Description for enum
 * Examples: value
 */
public enum Enum {
  ON("on"), OFF("off");

  private String value;

  Enum(String value) {
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
  public static Enum fromValue(String value) {
    for (Enum e : Enum.values()) {
      if (e.value.equals(value)) {
        return e;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Enum'];

    const enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual(['import com.fasterxml.jackson.annotation.*;']);
  });
});
