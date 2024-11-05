import {
  GoGenerator,
  GO_DESCRIPTION_PRESET,
  GO_COMMON_PRESET,
  GoCommonPresetOptions
} from '../../src';
import { Parser } from '@asyncapi/parser';
import { TypeScriptGenerator } from '../../src';
const generatorts = new TypeScriptGenerator();
const options: GoCommonPresetOptions = { addJsonTag: true };
const generator = new GoGenerator({
  presets: [GO_DESCRIPTION_PRESET, { preset: GO_COMMON_PRESET, options }]
});

const AsyncAPIDocumentText = `
asyncapi: 3.0.0
info:
  title: example
  version: 0.0.1
channels: 
  root:
    address: /
    messages:
      exampleRequest:
        summary: example operation
        payload:     
          title: exampleStruct      
          type: object
          description: this is an object
          required:
            - msgUid   
          additionalProperties: false     
          properties:
            id:
              type: integer
            msgUid:
              type: string
              description: this is example msg uid    
            evtName:
              type: string
              description: this is example event name
operations: 
  exampleOperation:
    title: This is an example operation
    summary: To do something
    channel:
      $ref: '#/channels/root'
    action: send
    messages:
      - $ref: '#/channels/root/messages/exampleRequest'
`;

export async function generate(): Promise<void> {
  const parser = new Parser();
  const { document } = await parser.parse(AsyncAPIDocumentText);
  const models = await generator.generate(document);
  for (const model of models) {
    console.log(model.result);
  }
}

if (require.main === module) {
  generate();
}
