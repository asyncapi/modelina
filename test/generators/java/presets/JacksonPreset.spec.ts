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
    const expectedDependencies = ['import java.util.Map;', 'import com.fasterxml.jackson.annotation.*;'];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot(); 
    expect(models[0].dependencies).toEqual(expectedDependencies); 
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
