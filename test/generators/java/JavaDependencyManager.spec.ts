import { ConstrainedStringModel, JavaOptions } from '../../../src';
import { JavaDependencyManager } from '../../../src/generators/java/JavaDependencyManager';

describe('JavaDependencyManager', () => {
  test('renderAllModelDependencies should render models added with addModelDependency', () => {
    const dependencyManager = new JavaDependencyManager({} as JavaOptions, []);
    dependencyManager.addModelDependency(
      new ConstrainedStringModel('testString', undefined, {}, 'String')
    );

    expect(
      dependencyManager.renderAllModelDependencies(
        new ConstrainedStringModel('', undefined, {}, 'String'),
        'testPackage'
      )
    ).toMatchInlineSnapshot(`"import testPackage.testString;"`);
  });
});
