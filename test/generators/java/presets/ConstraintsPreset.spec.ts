import { JavaGenerator, JAVA_CONSTRAINTS_PRESET } from '../../../../src/generators'; 

describe('JAVA_CONSTRAINTS_PRESET', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator({ presets: [JAVA_CONSTRAINTS_PRESET] });
  });

  test('should render constaints annotations', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      properties: {
        min_number_prop: { type: 'number', minimum: 0 },
        max_number_prop: { type: 'number', exclusiveMaximum: 100 },
        array_prop: { type: 'array', minItems: 2, maxItems: 3, },
        string_prop: { type: 'string', pattern: '^I_', minLength: 3 }
      },
      required: ['min_number_prop', 'max_number_prop']
    };
    const expected = `public class Clazz {
  private Double minNumberProp;
  private Double maxNumberProp;
  private Object[] arrayProp;
  private String stringProp;
  private Map<String, Object> additionalProperties;

  @NotNull
  @Min(0)
  public Double getMinNumberProp() { return this.minNumberProp; }
  public void setMinNumberProp(Double minNumberProp) { this.minNumberProp = minNumberProp; }

  @NotNull
  @Max(99)
  public Double getMaxNumberProp() { return this.maxNumberProp; }
  public void setMaxNumberProp(Double maxNumberProp) { this.maxNumberProp = maxNumberProp; }

  @Size(min=2, max=3)
  public Object[] getArrayProp() { return this.arrayProp; }
  public void setArrayProp(Object[] arrayProp) { this.arrayProp = arrayProp; }

  @Pattern(regexp="^I_")
  @Size(min=3)
  public String getStringProp() { return this.stringProp; }
  public void setStringProp(String stringProp) { this.stringProp = stringProp; }

  public Map<String, Object> getAdditionalProperties() { return this.additionalProperties; }
  public void setAdditionalProperties(Map<String, Object> additionalProperties) { this.additionalProperties = additionalProperties; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Clazz'];

    const classModel = await generator.renderClass(model, inputModel);
    const expectedDependencies = ['import java.util.Map;', 'import javax.validation.constraints.*;'];
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual(expectedDependencies);
  });
});
