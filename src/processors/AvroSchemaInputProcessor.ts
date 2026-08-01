import { AbstractInputProcessor } from './AbstractInputProcessor';
import { InputMetaModel } from '../models';
import { Logger } from '../utils';
import { AvroToMetaModel } from '../helpers/AvroToMetaModel';

/**
 * Class for processing Avro Schema input
 */

const avroType = [
  'null',
  'boolean',
  'int',
  'long',
  'double',
  'float',
  'string',
  'record',
  'enum',
  'array',
  'map'
];

/**
 * Detect an empty object or array without serializing the input.
 *
 * `shouldProcess` runs during processor detection on raw, caller-supplied
 * input, which may be a circular object graph (for example a document that has
 * already been dereferenced with circular references resolved). `JSON.stringify`
 * throws on such input, so the emptiness check has to be structural.
 */
function isEmptyObjectOrArray(input: any): boolean {
  if (typeof input !== 'object' || input === null) {
    return false;
  }
  return Object.keys(input).length === 0;
}

export class AvroSchemaInputProcessor extends AbstractInputProcessor {
  /**
   * Function processing an Avro Schema input
   *
   * @param input
   */
  shouldProcess(input?: any): boolean {
    if (input === '' || input === null || input === undefined) {
      return false;
    }
    if (isEmptyObjectOrArray(input)) {
      return false;
    }
    if (!avroType.includes(input.type) || !input.name) {
      return false;
    }
    return true;
  }

  process(input?: any): Promise<InputMetaModel> {
    if (!this.shouldProcess(input)) {
      return Promise.reject(
        new Error('Input is not an Avro Schema, so it cannot be processed.')
      );
    }
    Logger.debug('Processing input as Avro Schema document');
    const inputModel = new InputMetaModel();
    inputModel.originalInput = input;
    const metaModel = AvroToMetaModel(input);
    inputModel.models[metaModel.name] = metaModel;
    Logger.debug('Completed processing input as Avro Schema document');

    return Promise.resolve(inputModel);
  }
}
