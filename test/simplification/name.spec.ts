import SimplifyName from '../../src/simplification/SimplifyName';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of names', function () {
  test('should return undefined with boolean', function () {
    const schema: any = true;
    const name = SimplifyName(schema);
    expect(name).toBeUndefined();
  });
});