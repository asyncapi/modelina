import { JavaGenerator, JAVA_JACKSON_PRESET } from '../../../../src/generators'; 

describe('JAVA_DESCRIPTION_PRESET', function() {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator({ presets: [JAVA_JACKSON_PRESET] });
  });

  test('should render Jackson annotations', async function() {
    const doc = {
      $id: "Clazz",
      type: "object",
      properties: {
        min_number_prop:  { type: "number" },
        max_number_prop:  { type: "number" },
      },
    };
    const expected = `public class Clazz {
  private Double minNumberProp;
  private Double maxNumberProp;

  @JsonProperty("min_number_prop")
  public Double getMinNumberProp() { return this.minNumberProp; }
  public void setMinNumberProp(Double minNumberProp) { this.minNumberProp = minNumberProp; }

  @JsonProperty("max_number_prop")
  public Double getMaxNumberProp() { return this.maxNumberProp; }
  public void setMaxNumberProp(Double maxNumberProp) { this.maxNumberProp = maxNumberProp; }
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models["Clazz"];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel).toEqual(expected);
  });
});
