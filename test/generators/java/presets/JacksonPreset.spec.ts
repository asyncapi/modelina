import { JavaGenerator, JAVA_JACKSON_PRESET } from '../../../../src/generators'; 

describe('JAVA_JACKSON_PRESET', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator({ presets: [JAVA_JACKSON_PRESET] });
  });

  test('should render Jackson annotations for class', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      properties: {
        min_number_prop: { type: 'number' },
        max_number_prop: { type: 'number' },
      },
    };
    const expected = `public class Clazz {
  private Double minNumberProp;
  private Double maxNumberProp;
  private Map<String, Object> additionalProperties;

  @JsonProperty("min_number_prop")
  public Double getMinNumberProp() { return this.minNumberProp; }
  public void setMinNumberProp(Double minNumberProp) { this.minNumberProp = minNumberProp; }

  @JsonProperty("max_number_prop")
  public Double getMaxNumberProp() { return this.maxNumberProp; }
  public void setMaxNumberProp(Double maxNumberProp) { this.maxNumberProp = maxNumberProp; }

  public Map<String, Object> getAdditionalProperties() { return this.additionalProperties; }
  public void setAdditionalProperties(Map<String, Object> additionalProperties) { this.additionalProperties = additionalProperties; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Clazz'];

    const classModel = await generator.renderClass(model, inputModel);
    const expectedDependencies = ['import java.util.Map;', 'import com.fasterxml.jackson.annotation.*;'];
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual(expectedDependencies);
  });

  test('should render Jackson annotations for enum', async () => {
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
    const expected = `public enum Enum {
  ON("on"), OFF("off");

  private String value;

  Enum(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
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

  @Override
  public String toString() {
    return String.valueOf(value);
  }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Enum'];

    const enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual(['import com.fasterxml.jackson.annotation.*;']);
  });
});
