import { JavaGenerator, JAVA_JACKSON_PRESET } from '../../../../src/generators'; 

describe('JAVA_JACKSON_PRESET', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator({ presets: [JAVA_JACKSON_PRESET] });
  });

  test('should render Jackson annotations', async () => {
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
});
