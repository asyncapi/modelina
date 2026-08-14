import {
  ConstrainedAnyModel,
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel
} from '../../../src/models';
import { GoDefaultTypeMapping } from '../../../src/generators/go/GoConstrainer';
import { GoDependencyManager } from '../../../src/generators/go/GoDependencyManager';
import { GoGenerator } from '../../../src/generators';

describe('Go generator type options', () => {
  const schema = {
    $id: 'Event',
    type: 'object',
    properties: {
      requiredName: { type: 'string' },
      nickname: { type: 'string' },
      attempts: { type: 'integer' },
      ratio: { type: 'number' },
      enabled: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      birthday: { type: 'string', format: 'date' }
    },
    required: ['requiredName', 'createdAt']
  };

  test('preserves existing Go types by default', async () => {
    const generator = new GoGenerator();

    const [model] = await generator.generateCompleteModels(schema, {
      packageName: 'events'
    });

    expect(model.result).toContain('RequiredName string');
    expect(model.result).toContain('Nickname string');
    expect(model.result).toContain('CreatedAt string');
    expect(model.result).not.toContain('"time"');
  });

  test(
    'renders optional primitive fields as pointers when enabled',
    async () => {
      const generator = new GoGenerator({
        usePointersForOptionalFields: true
      });

      const [model] = await generator.generate(schema);

      expect(model.result).toContain('RequiredName string');
      expect(model.result).toContain('Nickname *string');
      expect(model.result).toContain('Attempts *int');
      expect(model.result).toContain('Ratio *float64');
      expect(model.result).toContain('Enabled *bool');
    }
  );

  test('renders optional named value fields as pointers when enabled', () => {
    const options = GoGenerator.getGoOptions({
      usePointersForOptionalFields: true
    });
    const dependencyManager = new GoDependencyManager(options);
    const enumModel = new ConstrainedEnumModel('Status', undefined, {}, '', []);
    const objectModel = new ConstrainedObjectModel(
      'Details',
      undefined,
      {},
      '',
      {}
    );
    const referenceTarget = new ConstrainedAnyModel(
      'Target',
      undefined,
      {},
      ''
    );
    const referenceModel = new ConstrainedReferenceModel(
      'Target',
      undefined,
      {},
      '',
      referenceTarget
    );
    const optionalProperty = (model: ConstrainedMetaModel) =>
      new ConstrainedObjectPropertyModel('value', '', false, model);
    const requiredProperty = (model: ConstrainedMetaModel) =>
      new ConstrainedObjectPropertyModel('value', '', true, model);

    expect(
      GoDefaultTypeMapping.Enum({
        constrainedModel: enumModel,
        partOfProperty: optionalProperty(enumModel),
        options,
        dependencyManager
      })
    ).toBe('*Status');
    expect(
      GoDefaultTypeMapping.Object({
        constrainedModel: objectModel,
        partOfProperty: optionalProperty(objectModel),
        options,
        dependencyManager
      })
    ).toBe('*Details');
    expect(
      GoDefaultTypeMapping.Reference({
        constrainedModel: referenceModel,
        partOfProperty: optionalProperty(referenceModel),
        options,
        dependencyManager
      })
    ).toBe('*Target');

    expect(
      GoDefaultTypeMapping.Enum({
        constrainedModel: enumModel,
        partOfProperty: requiredProperty(enumModel),
        options,
        dependencyManager
      })
    ).toBe('Status');
    expect(
      GoDefaultTypeMapping.Object({
        constrainedModel: objectModel,
        partOfProperty: requiredProperty(objectModel),
        options,
        dependencyManager
      })
    ).toBe('Details');
    expect(
      GoDefaultTypeMapping.Reference({
        constrainedModel: referenceModel,
        partOfProperty: requiredProperty(referenceModel),
        options,
        dependencyManager
      })
    ).toBe('Target');
  });

  test('maps date-time strings to time.Time and adds the import', async () => {
    const generator = new GoGenerator({
      useTimeForDateTime: true
    });

    const [model] = await generator.generateCompleteModels(schema, {
      packageName: 'events'
    });

    expect(model.result).toContain('"time"');
    expect(model.result).toContain('CreatedAt time.Time');
    expect(model.result).toContain('UpdatedAt time.Time');
    expect(model.result).toContain('Birthday string');
    expect(model.dependencies).toEqual(['time']);
  });

  test(
    'combines optional pointers with time.Time without double pointers',
    async () => {
      const generator = new GoGenerator({
        usePointersForOptionalFields: true,
        useTimeForDateTime: true
      });
      const optionalDateTimeSchema = {
        ...schema,
        required: ['requiredName']
      };

      const [model] = await generator.generateCompleteModels(
        optionalDateTimeSchema,
        { packageName: 'events' }
      );

      expect(model.result).toContain('CreatedAt *time.Time');
      expect(model.result).toContain('UpdatedAt *time.Time');
      expect(model.result).not.toContain('CreatedAt **time.Time');
      expect(model.dependencies).toEqual(['time']);
    }
  );
});
