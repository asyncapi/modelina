import {generate} from './index';
test('Should render typescript interface', async () => {
  const models = await generate();
  expect(models).not.toBeUndefined();
  expect(models).not.toHaveLength(0);
});
