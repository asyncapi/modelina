import { TypeScriptGenerator, TS_COMMON_PRESET } from '../../../../src/generators'; 
import Ajv from 'ajv';
class testClass {
  private _stringProp?: string;
  private _numberProp?: number;
  private _additionalProperties?: Map<string, object | string | number | Array<unknown> | boolean | null | number>;
  private _sTestPatternProperties?: Map<string, string>;

  constructor(input: {
    stringProp?: string,
    numberProp?: number,
  }) {
    this._stringProp = input.stringProp;
    this._numberProp = input.numberProp;
  }

  get stringProp(): string | undefined { return this._stringProp; }
  set stringProp(stringProp: string | undefined) { this._stringProp = stringProp; }

  get numberProp(): number | undefined { return this._numberProp; }
  set numberProp(numberProp: number | undefined) { this._numberProp = numberProp; }

  get additionalProperties(): Map<string, object | string | number | Array<unknown> | boolean | null | number> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, object | string | number | Array<unknown> | boolean | null | number> | undefined) { this._additionalProperties = additionalProperties; }

  get sTestPatternProperties(): Map<string, string> | undefined { return this._sTestPatternProperties; }
  set sTestPatternProperties(sTestPatternProperties: Map<string, string> | undefined) { this._sTestPatternProperties = sTestPatternProperties; }

  public marshal() : string {
    let json = '{';
    if (this.stringProp !== undefined) {
      json += `"stringProp":${JSON.stringify(this.stringProp)},`;
    }
    if (this.numberProp !== undefined) {
      json += `"numberProp":${JSON.stringify(this.numberProp)},`;
    }

    if (this.sTestPatternProperties !== undefined) { 
      for (const [key, value] of this.sTestPatternProperties.entries()) {
        //Ignore all pattern properties which is a property in itself
        if (Object.keys(this).includes(key)) {continue;}
        json += `"${key}":${JSON.stringify(value)},`;
      }
    }

    if (this.additionalProperties !== undefined) { 
      for (const [key, value] of this.additionalProperties.entries()) {
        //Only render additionalProperties which are not already a property
        if (Object.keys(this).includes(key)) {continue;}

        json += `"${key}":${JSON.stringify(value)},`;
      }
    }
    return `${json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}`;
  }
  public static unmarshal(json: string): testClass {
    const obj = JSON.parse(json);
    const instance = new testClass({});
    if (obj.stringProp !== undefined) {
      instance.stringProp = obj.stringProp;
    }
    if (obj.numberProp !== undefined) {
      instance.numberProp = obj.numberProp;
    }
    for (const [key, value] of Object.entries(obj).filter((([key,]) => {return key !== 'stringProp' && key !== 'numberProp';}))) {
      if (key.match(new RegExp('^S(.?)test'))) {
        if (instance.sTestPatternProperties === undefined) {instance.sTestPatternProperties = new Map();}
        instance.sTestPatternProperties.set(key, value as any);
      } else {
        if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
        instance.additionalProperties.set(key, value as any);
      }
    }
    return instance;
  }
}
describe('TS_COMMON_PRESET', () => {
  test('some test', async () => {
    const ajv = new Ajv();

    const newInstance = new testClass({});
    newInstance.numberProp = 2;
    newInstance.stringProp = 'TestString';
    newInstance.additionalProperties = new Map();
    newInstance.additionalProperties.set('testadditional', 'somevariable');
    newInstance.sTestPatternProperties = new Map();
    newInstance.sTestPatternProperties.set('Stest', 'patterEntryValue');
    const marshalContent = newInstance.marshal();
    expect(marshalContent).toEqual('{"stringProp":"TestString","numberProp":2,"Stest":"patterEntryValue","testadditional":"somevariable"}');
    console.log(ajv.validate({
      $id: 'Clazz',
      type: 'object',
      additionalProperties: true,
      properties: {
        stringProp: { type: 'string' },
        numberProp: { type: 'number' },
      },
      patternProperties: {
        '^S(.?)test': {
          type: 'string'
        }
      },
    }, JSON.parse(marshalContent)));
    expect(true).toEqual(true);
    const unmarshalInstance = testClass.unmarshal(marshalContent);
    expect(unmarshalInstance).toEqual(newInstance);
  });
  test('should render un/marshal code', async () => {
    const doc = {
      $id: 'Test',
      type: 'object',
      additionalProperties: true,
      properties: {
        stringProp: { type: 'string' },
        numberProp: { type: 'number' },
        objectProp: { type: 'object', $id: 'NestedTest', properties: {stringProp: { type: 'string' }}}
      },
      patternProperties: {
        '^S(.?)test': {
          type: 'string'
        }
      },
    };
    const expectedTestClass = ``;
    const expectedNestedTestClass = ``;

    const generator = new TypeScriptGenerator({ 
      presets: [
        {
          preset: TS_COMMON_PRESET,
          options: {
            marshal: true,
            unmarshal: true
          }
        }
      ]
    });
    const inputModel = await generator.process(doc);
    const testModel = inputModel.models['Test'];
    const nestedTestModel = inputModel.models['NestedTest'];

    const testClass = await generator.renderClass(testModel, inputModel);
    const nestedTestClass = await generator.renderClass(nestedTestModel, inputModel);

    expect(testClass.result).toEqual(expectedTestClass);
    expect(nestedTestClass.result).toEqual(expectedNestedTestClass);
  });
});
