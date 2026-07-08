import { TypeScriptGenerator } from '../../../src/generators';
import { TypeScriptDependencyManager } from '../../../src/generators/typescript/TypeScriptDependencyManager';
import {
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel
} from '../../../src/models';

describe('TypeScriptDependencyManager', () => {
  describe('renderDependency()', () => {
    test('Should be able to render dependency', () => {
      const dependencyManager = new TypeScriptDependencyManager(
        TypeScriptGenerator.defaultOptions,
        []
      );
      expect(
        dependencyManager.renderDependency('someComment', 'someComment2')
      ).toEqual(`import someComment from 'someComment2';`);
    });
  });

  describe('renderExport()', () => {
    const makeObjectModel = (name: string) =>
      new ConstrainedObjectModel(name, undefined, {}, '', {});

    const makeEnumModel = (name: string) =>
      new ConstrainedEnumModel(name, undefined, {}, '', []);

    test('renders plain named export for ESM without isolatedModules', () => {
      const dm = new TypeScriptDependencyManager(
        {
          ...TypeScriptGenerator.defaultOptions,
          moduleSystem: 'ESM',
          isolatedModules: false
        },
        []
      );
      expect(dm.renderExport(makeObjectModel('MyModel'), 'named')).toEqual(
        'export { MyModel };'
      );
    });

    test('renders export type for ESM with isolatedModules when modelType is interface', () => {
      const dm = new TypeScriptDependencyManager(
        {
          ...TypeScriptGenerator.defaultOptions,
          moduleSystem: 'ESM',
          modelType: 'interface',
          isolatedModules: true
        },
        []
      );
      expect(dm.renderExport(makeObjectModel('MyInterface'), 'named')).toEqual(
        'export type { MyInterface };'
      );
    });

    test('renders plain export for object model rendered as class (modelType class) with isolatedModules', () => {
      const dm = new TypeScriptDependencyManager(
        {
          ...TypeScriptGenerator.defaultOptions,
          moduleSystem: 'ESM',
          modelType: 'class',
          isolatedModules: true
        },
        []
      );
      expect(dm.renderExport(makeObjectModel('MyClass'), 'named')).toEqual(
        'export { MyClass };'
      );
    });

    test('renders plain export for ESM with isolatedModules for enum (runtime value)', () => {
      const dm = new TypeScriptDependencyManager(
        {
          ...TypeScriptGenerator.defaultOptions,
          moduleSystem: 'ESM',
          modelType: 'interface',
          isolatedModules: true
        },
        []
      );
      expect(dm.renderExport(makeEnumModel('MyEnum'), 'named')).toEqual(
        'export { MyEnum };'
      );
    });

    test('renders default export unchanged when isolatedModules is true', () => {
      const dm = new TypeScriptDependencyManager(
        {
          ...TypeScriptGenerator.defaultOptions,
          moduleSystem: 'ESM',
          isolatedModules: true
        },
        []
      );
      expect(dm.renderExport(makeObjectModel('MyModel'), 'default')).toEqual(
        'export default MyModel;\n'
      );
    });

    test('renders CJS export unchanged when isolatedModules is true', () => {
      const dm = new TypeScriptDependencyManager(
        {
          ...TypeScriptGenerator.defaultOptions,
          moduleSystem: 'CJS',
          isolatedModules: true
        },
        []
      );
      expect(dm.renderExport(makeObjectModel('MyModel'), 'named')).toEqual(
        'exports.MyModel = MyModel;'
      );
    });
  });

  describe('renderCompleteModelDependencies()', () => {
    // Cross-model dependencies are always wrapped in a ConstrainedReferenceModel
    // by getNearestDependencies(), so tests exercise the reference-wrapped form
    // to reflect real generation.
    const makeObjectRef = (name: string) =>
      new ConstrainedReferenceModel(
        name,
        undefined,
        {},
        '',
        new ConstrainedObjectModel(
          name,
          undefined,
          {},
          '',
          {}
        ) as ConstrainedMetaModel
      );

    const makeEnumRef = (name: string) =>
      new ConstrainedReferenceModel(
        name,
        undefined,
        {},
        '',
        new ConstrainedEnumModel(
          name,
          undefined,
          {},
          '',
          []
        ) as ConstrainedMetaModel
      );

    test('renders import type for ESM named with isolatedModules for interface dependency', () => {
      const dm = new TypeScriptDependencyManager(
        {
          ...TypeScriptGenerator.defaultOptions,
          moduleSystem: 'ESM',
          modelType: 'interface',
          isolatedModules: true
        },
        []
      );
      expect(
        dm.renderCompleteModelDependencies(makeObjectRef('OtherModel'), 'named')
      ).toEqual("import type {OtherModel} from './OtherModel';");
    });

    test('renders plain import for object dependency rendered as class (modelType class) with isolatedModules', () => {
      const dm = new TypeScriptDependencyManager(
        {
          ...TypeScriptGenerator.defaultOptions,
          moduleSystem: 'ESM',
          modelType: 'class',
          isolatedModules: true
        },
        []
      );
      expect(
        dm.renderCompleteModelDependencies(makeObjectRef('OtherModel'), 'named')
      ).toEqual("import {OtherModel} from './OtherModel';");
    });

    test('renders plain import for ESM named without isolatedModules', () => {
      const dm = new TypeScriptDependencyManager(
        {
          ...TypeScriptGenerator.defaultOptions,
          moduleSystem: 'ESM',
          isolatedModules: false
        },
        []
      );
      expect(
        dm.renderCompleteModelDependencies(makeObjectRef('OtherModel'), 'named')
      ).toEqual("import {OtherModel} from './OtherModel';");
    });

    test('renders plain import for enum dependency even with isolatedModules (enum is runtime value)', () => {
      const dm = new TypeScriptDependencyManager(
        {
          ...TypeScriptGenerator.defaultOptions,
          moduleSystem: 'ESM',
          modelType: 'interface',
          isolatedModules: true
        },
        []
      );
      expect(
        dm.renderCompleteModelDependencies(makeEnumRef('MyEnum'), 'named')
      ).toEqual("import {MyEnum} from './MyEnum';");
    });
  });
});
