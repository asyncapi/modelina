import { DartGenerator, DART_JSON_PRESET } from '../../../../src/generators';

describe('DART_JSON_PRESET', () => {
  let generator: DartGenerator;
  beforeEach(() => {
    generator = new DartGenerator({ presets: [DART_JSON_PRESET] });
  });

  test('should render json annotations', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      properties: {
        min_number_prop: { type: 'number' },
        max_number_prop: { type: 'number' },
      },
    };
    const expected = `class Clazz {
  double? minNumberProp;
  double? maxNumberProp;

  Clazz();

  factory Clazz.fromJson(Map<String, dynamic> json) => _$ClazzFromJson(json);
  Map<String, dynamic> toJson() => _$ClazzToJson(this);
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Clazz'];

    const classModel = await generator.renderClass(model, inputModel);
    const expectedDependencies = ['import \'package:json_annotation/json_annotation.dart\';', 'part \'clazz.g.dart\';', '@JsonSerializable()'];
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual(expectedDependencies);
  });
});
