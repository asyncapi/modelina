import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import InterpretOneOfWithAllOf from '../../../src/interpreter/InterpretOneOfWithAllOf';
import { AsyncapiV2Schema } from '../../../src';

describe('Interpretation of oneOf with allOf', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain oneOf and allOf', () => {
    const model = new CommonModel();
    model.addItemUnion = jest.fn();
    const interpreter = new Interpreter();
    interpreter.interpret = jest.fn();

    InterpretOneOfWithAllOf({}, model, interpreter);

    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(model.addItemUnion).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should add oneOf items to CommonModel union', () => {
    const model = new CommonModel();
    const schema = AsyncapiV2Schema.toSchema({
      allOf: [
        {
          title: 'Animal',
          type: 'object',
          discriminator: 'animalType',
          properties: {
            animalType: {
              title: 'Animal Type',
              type: 'string'
            },
            age: {
              type: 'integer',
              min: 0
            }
          }
        }
      ],
      oneOf: [
        {
          title: 'Cat',
          type: 'object',
          properties: {
            animalType: {
              const: 'Cat'
            },
            huntingSkill: {
              title: 'Hunting Skill',
              type: 'string',
              enum: ['clueless', 'lazy']
            }
          }
        },
        {
          title: 'Dog',
          type: 'object',
          additionalProperties: false,
          properties: {
            animalType: {
              const: 'Dog'
            },
            breed: {
              title: 'Dog Breed',
              type: 'string',
              enum: ['bulldog', 'bichons frise']
            }
          }
        }
      ]
    });

    const interpreter = new Interpreter();

    InterpretOneOfWithAllOf(schema, model, interpreter, {
      allowInheritance: false
    });

    expect(model.type).toBeUndefined();
    expect(model.union).toHaveLength(2);
    expect(model.discriminator).toBe('animalType');

    const cat = model.union?.find((item) => item.$id === 'Cat');
    expect(cat).not.toBeUndefined();
    expect(cat?.properties?.animalType).toMatchObject({
      $id: 'Animal Type',
      enum: ['Cat']
    });
    expect(cat?.properties).toHaveProperty('age');
    expect(cat?.properties).toHaveProperty('huntingSkill');
    expect(cat?.properties).not.toHaveProperty('breed');

    const dog = model.union?.find((item) => item.$id === 'Dog');
    expect(dog).not.toBeUndefined();
    expect(dog?.properties?.animalType).toMatchObject({
      $id: 'Animal Type',
      enum: ['Cat', 'Dog']
    });
    expect(dog?.properties).toHaveProperty('age');
    expect(dog?.properties).toHaveProperty('breed');
    expect(dog?.properties).not.toHaveProperty('huntingSkill');
  });
});
