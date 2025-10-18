import { AbstractInputProcessor } from './AbstractInputProcessor';
import { InputMetaModel } from '../models';
import { Logger } from '../utils';
import { XsdToMetaModel } from '../helpers/XsdToMetaModel';
import { XsdSchema } from '../models/XsdSchema';
import { XMLParser } from 'fast-xml-parser';

/**
 * Class for processing XSD (XML Schema Definition) input
 */
export class XsdInputProcessor extends AbstractInputProcessor {
  /**
   * Determines if the input should be processed as XSD
   *
   * @param input
   */
  shouldProcess(input?: any): boolean {
    if (!input || typeof input !== 'string') {
      return false;
    }
    
    // Check if the string contains XSD schema indicators
    const xsdIndicators = [
      'xs:schema',
      'xsd:schema',
      'xmlns:xs="http://www.w3.org/2001/XMLSchema"',
      'xmlns:xsd="http://www.w3.org/2001/XMLSchema"'
    ];
    
    return xsdIndicators.some((indicator) => input.includes(indicator));
  }

  /**
   * Process XSD input and convert to InputMetaModel
   *
   * @param input XSD as string
   */
  async process(input?: any): Promise<InputMetaModel> {
    if (!this.shouldProcess(input)) {
      return Promise.reject(
        new Error('Input is not an XSD Schema, so it cannot be processed.')
      );
    }
    
    Logger.debug('Processing input as XSD Schema document');
    
    const inputModel = new InputMetaModel();
    inputModel.originalInput = input;
    
    try {
      // Parse XML to JavaScript object
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        parseAttributeValue: true,
        trimValues: true
      });
      
      const parsedXsd = parser.parse(input);
      
      // Convert to XsdSchema model
      const xsdSchema = XsdSchema.toSchema(parsedXsd);
      
      // Convert XSD to MetaModel
      const metaModels = XsdToMetaModel(xsdSchema);
      
      // Add all meta models to input model
      for (const metaModel of metaModels) {
        inputModel.models[metaModel.name] = metaModel;
      }
      
      Logger.debug('Completed processing input as XSD Schema document');
      
      return inputModel;
    } catch (error: any) {
      const errorMessage = `Failed to process XSD input: ${error.message}`;
      Logger.error(errorMessage, error);
      return Promise.reject(new Error(errorMessage));
    }
  }
}

