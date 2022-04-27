import {DartGenerator} from '../../../src/generators';

describe('DartGenerator', () => {
  let generator: DartGenerator;
  beforeEach(() => {
    generator = new DartGenerator();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should not render reserved keyword', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        enum: {type: 'string'},
        reservedEnum: {type: 'string'}
      },
      additionalProperties: false
    };
    const expected = `class Address {
  String? reservedReservedEnum;
  String? reservedEnum;

  Address();
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Address'];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toEqual(expected);

    classModel = await generator.render(model, inputModel);
    expect(classModel.result).toEqual(expected);
  });

  test('should render `class` type', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: {type: 'string'},
        city: {type: 'string', description: 'City description'},
        state: {type: 'string'},
        house_number: {type: 'number'},
        marriage: {type: 'boolean', description: 'Status if marriage live in given house'},
        members: {oneOf: [{type: 'string'}, {type: 'number'}, {type: 'boolean'}],},
        array_type: {type: 'array', items: [{type: 'string'}, {type: 'number'}]},
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
    };
    const expected = `class Address {
  String? streetName;
  String? city;
  String? state;
  double? houseNumber;
  bool? marriage;
  Object? members;
  List<Object>? arrayType;
  Map<String, String>? sTestPatternProperties;

  Address();
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Address'];

    let classModel = await generator.renderClass(model, inputModel);
    expect(classModel.result).toEqual(expected);
    classModel = await generator.render(model, inputModel);
    expect(classModel.result).toEqual(expected);
  });

  test('should render `enum` type (string type)', async () => {
    const doc = {
      $id: 'States',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California', 'New York'],
    };
    const expected = `enum States {
  Texas, Alabama, California, New York
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['States'];

    let enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel.result).toEqual(expected);

    enumModel = await generator.render(model, inputModel);
    expect(enumModel.result).toEqual(expected);
  });

  test('should render `enum` type (integer type)', async () => {
    const doc = {
      $id: 'Numbers',
      type: 'integer',
      enum: [0, 1, 2, 3],
    };
    const expected = `enum Numbers {
  NUMBER_0, NUMBER_1, NUMBER_2, NUMBER_3
}`;

    const inputModel = await generator.process(doc);
    const model = inputModel.models['Numbers'];
    let enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    enumModel = await generator.render(model, inputModel);
    expect(enumModel.result).toEqual(expected);
  });

  test('should render custom preset for `enum` type', async () => {
    const doc = {
      $id: 'CustomEnum',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California'],
    };
    const expected = `@EnumAnnotation
enum CustomEnum {
  Texas, Alabama, California
}`;

    generator = new DartGenerator({
      presets: [
        {
          enum: {
            self({renderer, content}) {
              const annotation = renderer.renderAnnotation('EnumAnnotation');
              return `${annotation}\n${content}`;
            },
          }
        }
      ]
    });

    const inputModel = await generator.process(doc);
    const model = inputModel.models['CustomEnum'];

    let enumModel = await generator.render(model, inputModel);
    const expectedDependencies: any[] = [];
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual(expectedDependencies);

    enumModel = await generator.renderEnum(model, inputModel);
    expect(enumModel.result).toEqual(expected);
    expect(enumModel.dependencies).toEqual(expectedDependencies);
  });

  test('should render List type for collections', async () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      additionalProperties: false,
      properties: {
        arrayType: {type: 'array'},
      }
    };
    const expected = `class CustomClass {
  List<Object>? arrayType;

  CustomClass();
}`;
    const expectedDependencies: any[] = [];

    generator = new DartGenerator({collectionType: 'List'});

    const inputModel = await generator.process(doc);
    const model = inputModel.models['CustomClass'];

    const classModel = await generator.render(model, inputModel);
    expect(classModel.result).toEqual(expected);
    expect(classModel.dependencies).toEqual(expectedDependencies);
  });

  test('should render models and their dependencies', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: {type: 'string'},
        city: {type: 'string', description: 'City description'},
        state: {type: 'string'},
        house_number: {type: 'number'},
        marriage: {type: 'boolean', description: 'Status if marriage live in given house'},
        members: {oneOf: [{type: 'string'}, {type: 'number'}, {type: 'boolean'}],},
        array_type: {type: 'array', items: [{type: 'string'}, {type: 'number'}]},
        other_model: {type: 'object', $id: 'OtherModel', properties: {street_name: {type: 'string'}}},
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
    };
    const config = {packageName: 'test.package'};
    const models = await generator.generateCompleteModels(doc, config);
    expect(models).toHaveLength(2);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
  });
  test('should throw error when reserved keyword is used for package name', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: {type: 'string'},
        city: {type: 'string', description: 'City description'},
        state: {type: 'string'},
        house_number: {type: 'number'},
        marriage: {type: 'boolean', description: 'Status if marriage live in given house'},
        members: {oneOf: [{type: 'string'}, {type: 'number'}, {type: 'boolean'}],},
        array_type: {type: 'array', items: [{type: 'string'}, {type: 'number'}]},
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
    };
    const config = {packageName: 'interface'};
    const expectedError = new Error('You cannot use reserved Dart keyword (interface) as package name, please use another.');
    await expect(generator.generateCompleteModels(doc, config)).rejects.toEqual(expectedError);
  });
});
