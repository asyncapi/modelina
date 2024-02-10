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
  'bytes',
  'records',
  'enums',
  'arrays',
  'maps',
  'unions',
  'fixed'
];

export class AvroSchemaInputProcessor extends AbstractInputProcessor {
  /**
   * Function processing an Avro Schema input
   *
   * @param input
   */

  shouldProcess(input?: any): boolean {
    if (
      input === '' ||
      JSON.stringify(input) === '{}' ||
      JSON.stringify(input) === '[]'
    ) {
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
