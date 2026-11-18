import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel,
  ConstrainedFloatModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  InputMetaModel
} from '../../../../src';
import { DartGenerator, DART_JSON_PRESET } from '../../../../src/generators';

describe('DART_JSON_PRESET', () => {
  let generator: DartGenerator;
  beforeEach(() => {
    generator = new DartGenerator({ presets: [DART_JSON_PRESET] });
  });

  test('should render json annotations', async () => {
    const model = new ConstrainedObjectModel('Clazz', undefined, {}, 'Clazz', {
      minNumberProp: new ConstrainedObjectPropertyModel(
        'minNumberProp',
        'min_number_prop',
        false,
        new ConstrainedFloatModel('minNumberProp', undefined, {}, 'double')
      ),
      maxNumberProp: new ConstrainedObjectPropertyModel(
        'maxNumberProp',
        'max_number_prop',
        false,
        new ConstrainedFloatModel('maxNumberProp', undefined, {}, 'double')
      )
    });
    const inputModel = new InputMetaModel();

    const classModel = await generator.renderClass(model, inputModel);
    const expectedDependencies = [
      `import 'package:json_annotation/json_annotation.dart';`,
      `part 'clazz.g.dart';`,
      '@JsonSerializable()'
    ];
    expect(classModel.result).toMatchSnapshot();
    expect(classModel.dependencies).toEqual(expectedDependencies);
  });

  test('should render json annotations for enum', async () => {
    const model = new ConstrainedEnumModel(
      'CoachRole',
      undefined,
      {},
      'CoachRole',
      [
        new ConstrainedEnumValueModel('USER', '"USER"', 'USER'),
        new ConstrainedEnumValueModel('COACH', '"COACH"', 'COACH')
      ]
    );
    const inputModel = new InputMetaModel();

    const enumModel = await generator.renderEnum(model, inputModel);
    const expectedDependencies = [
      `import 'package:json_annotation/json_annotation.dart';`,
      `part 'coach_role.g.dart';`,
      '@JsonEnum(alwaysCreate:true)'
    ];
    expect(enumModel.result).toMatchSnapshot();
    expect(enumModel.dependencies).toEqual(expectedDependencies);
  });
});
