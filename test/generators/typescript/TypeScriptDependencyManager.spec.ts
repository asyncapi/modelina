import { TypeScriptGenerator } from '../../../src/generators';
import { TypeScriptDependencyManager } from '../../../src/generators/typescript/TypeScriptDependencyManager';
import {
  ConstrainedEnumModel,
  ConstrainedObjectModel
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
        { ...TypeScriptGenerator.defaultOptions, moduleSystem: 'ESM', isolatedModules: false },
        []
      );
      expect(dm.renderExport(makeObjectModel('MyModel'), 'named')).toEqual(
        'export { MyModel };'
      );
    });

    test('renders export type for ESM with isolatedModules for interface/object model', () => {
      const dm = new TypeScriptDependencyManager(
        { ...TypeScriptGenerator.defaultOptions, moduleSystem: 'ESM', isolatedModules: true },
        []
      );
      expect(dm.renderExport(makeObjectModel('MyInterface'), 'named')).toEqual(
        'export type { MyInterface };'
      );
    });

    test('renders plain export for ESM with isolatedModules for enum (runtime value)', () => {
      const dm = new TypeScriptDependencyManager(
        { ...TypeScriptGenerator.defaultOptions, moduleSystem: 'ESM', isolatedModules: true },
        []
      );
      expect(dm.renderExport(makeEnumModel('MyEnum'), 'named')).toEqual(
        'export { MyEnum };'
      );
    });

    test('renders default export unchanged when isolatedModules is true', () => {
      const dm = new TypeScriptDependencyManager(
        { ...TypeScriptGenerator.defaultOptions, moduleSystem: 'ESM', isolatedModules: true },
        []
      );
      expect(dm.renderExport(makeObjectModel('MyModel'), 'default')).toEqual(
        'export default MyModel;\n'
      );
    });

    test('renders CJS export unchanged when isolatedModules is true', () => {
      const dm = new TypeScriptDependencyManager(
        { ...TypeScriptGenerator.defaultOptions, moduleSystem: 'CJS', isolatedModules: true },
        []
      );
      expect(dm.renderExport(makeObjectModel('MyModel'), 'named')).toEqual(
        'exports.MyModel = MyModel;'
      );
    });
  });

  describe('renderCompleteModelDependencies()', () => {
    const makeObjectModel = (name: string) =>
      new ConstrainedObjectModel(name, undefined, {}, '', {});

    const makeEnumModel = (name: string) =>
      new ConstrainedEnumModel(name, undefined, {}, '', []);

    test('renders import type for ESM named with isolatedModules for object model', () => {
      const dm = new TypeScriptDependencyManager(
        { ...TypeScriptGenerator.defaultOptions, moduleSystem: 'ESM', isolatedModules: true },
        []
      );
      expect(
        dm.renderCompleteModelDependencies(makeObjectModel('OtherModel'), 'named')
      ).toEqual("import type {OtherModel} from './OtherModel';");
    });

    test('renders plain import for ESM named without isolatedModules', () => {
      const dm = new TypeScriptDependencyManager(
        { ...TypeScriptGenerator.defaultOptions, moduleSystem: 'ESM', isolatedModules: false },
        []
      );
      expect(
        dm.renderCompleteModelDependencies(makeObjectModel('OtherModel'), 'named')
      ).toEqual("import {OtherModel} from './OtherModel';");
    });

    test('renders plain import for enum even with isolatedModules (enum is runtime value)', () => {
      const dm = new TypeScriptDependencyManager(
        { ...TypeScriptGenerator.defaultOptions, moduleSystem: 'ESM', isolatedModules: true },
        []
      );
      expect(
        dm.renderCompleteModelDependencies(makeEnumModel('MyEnum'), 'named')
      ).toEqual("import {MyEnum} from './MyEnum';");
    });
  });
});
