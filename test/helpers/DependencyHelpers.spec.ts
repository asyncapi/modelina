import {
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedAnyModel
} from '../../src';
import { renderJavaScriptDependency, makeUnique } from '../../src/helpers';

describe('DependencyHelper', () => {
  describe('renderJavaScriptDependency', () => {
    test('should render accurate CJS dependency', () => {
      const renderedDependency = renderJavaScriptDependency(
        'test',
        'test2',
        'CJS'
      );
      expect(renderedDependency).toEqual(`const test = require('test2');`);
    });
    test('should render accurate ESM dependency', () => {
      const renderedDependency = renderJavaScriptDependency(
        'test',
        'test2',
        'ESM'
      );
      expect(renderedDependency).toEqual(`import test from 'test2';`);
    });
  });
  describe('makeUnique', () => {
    test('should remove duplicate regular instances', () => {
      const stringModel = new ConstrainedStringModel('', undefined, {}, '');
      const nonUniqueArray = [stringModel, stringModel];
      const uniqueArray = makeUnique(nonUniqueArray);
      expect(uniqueArray).toHaveLength(1);
    });
    test('should remove duplicate reference instances', () => {
      const stringModel = new ConstrainedStringModel('', undefined, {}, '');
      const ref1 = new ConstrainedReferenceModel(
        '',
        undefined,
        {},
        '',
        stringModel
      );
      const nonUniqueArray = [ref1, ref1];
      const uniqueArray = makeUnique(nonUniqueArray);
      expect(uniqueArray).toHaveLength(1);
    });
    test('should remove duplicate reference instances if the same name but different instance', () => {
      const stringModel = new ConstrainedStringModel('', undefined, {}, '');
      const ref1 = new ConstrainedReferenceModel(
        'name',
        undefined,
        {},
        '',
        stringModel
      );
      const ref2 = new ConstrainedReferenceModel(
        'name',
        undefined,
        {},
        '',
        stringModel
      );
      const nonUniqueArray = [ref1, ref2];
      const uniqueArray = makeUnique(nonUniqueArray);
      expect(uniqueArray).toHaveLength(1);
    });
    test('should remove duplicate reference value instances', () => {
      const stringModel = new ConstrainedStringModel('', undefined, {}, '');
      const ref1 = new ConstrainedReferenceModel(
        '',
        undefined,
        {},
        '',
        stringModel
      );
      const ref2 = new ConstrainedReferenceModel(
        '',
        undefined,
        {},
        '',
        stringModel
      );
      const nonUniqueArray = [ref1, ref2];
      const uniqueArray = makeUnique(nonUniqueArray);
      expect(uniqueArray).toHaveLength(1);
    });
    test('should remove duplicate name and type models', () => {
      const stringModel = new ConstrainedStringModel('', undefined, {}, '');
      const ref = new ConstrainedReferenceModel(
        'name',
        undefined,
        {},
        'type',
        stringModel
      );
      const any = new ConstrainedAnyModel('name', undefined, {}, 'type');
      const nonUniqueArray = [ref, any];
      const uniqueArray = makeUnique(nonUniqueArray);
      expect(uniqueArray).toHaveLength(1);
    });
  });
});
