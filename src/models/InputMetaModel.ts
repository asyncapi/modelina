import { MetaModel } from './MetaModel';

/**
 * Since each input processor can create multiple meta models this is a wrapper to a MetaModel to make that possible.
 */
export class InputMetaModel {
  models: { [key: string]: MetaModel } = {};
  originalInput: any = {};
}
