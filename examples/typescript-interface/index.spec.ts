import {generate} from './index';
test('Should render interface', async () => {
  const expectedAddressInterface = `export interface Address {
  streetName: string;
  city: string;
  houseNumber: number;
  marriage?: boolean;
  petNames?: Array<string>;
  state: State;
  additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;
}`;
  const expectedState = `export enum State {
  TEXAS = "Texas",
  ALABAMA = "Alabama",
  CALIFORNIA = "California",
  OTHER = "other",
}`;
  const models = await generate();
  expect(models[0].result).toEqual(expectedAddressInterface);
  expect(models[1].result).toEqual(expectedState);
});
