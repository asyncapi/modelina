/* eslint-disable */

import { TypeScriptGenerator, TS_COMMON_PRESET } from '../../../../src/generators'; 
import Ajv from 'ajv';
const doc = {
  $id: 'Test',
  type: 'object',
  additionalProperties: true,
  required: ['string prop'],
  properties: {
    'string prop': { type: 'string' },
    numberProp: { type: 'number' },
    objectProp: { type: 'object', $id: 'NestedTest', properties: {stringProp: { type: 'string' }}}
  },
  patternProperties: {
    '^S(.?)test': {
      type: 'string'
    }
  },
};
describe('Marshalling preset', () => {
  test('should render un/marshal code', async () => {
    const generator = new TypeScriptGenerator({ 
      presets: [
        {
          preset: TS_COMMON_PRESET,
          options: {
            marshalling: true
          }
        }
      ]
    });
    const inputModel = await generator.process(doc);
    const testModel = inputModel.models['Test'];
    const nestedTestModel = inputModel.models['NestedTest'];

    const testClass = await generator.renderClass(testModel, inputModel);
    const nestedTestClass = await generator.renderClass(nestedTestModel, inputModel);

    expect(testClass.result).toMatchSnapshot();
    expect(nestedTestClass.result).toMatchSnapshot();
  });

  test('should provide a two way conversion', async () => {
    class NestedTest {
      private _stringProp?: string;
      private _additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;

      constructor(input: {
        stringProp?: string,
      }) {
        this._stringProp = input.stringProp;
      }

      get stringProp(): string | undefined { return this._stringProp; }
      set stringProp(stringProp: string | undefined) { this._stringProp = stringProp; }

      get additionalProperties(): Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined { return this._additionalProperties; }
      set additionalProperties(additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined) { this._additionalProperties = additionalProperties; }

      public marshal() : string {
        let json = '{'
        if(this.stringProp !== undefined) {
          json += `\"stringProp\": ${typeof this.stringProp === 'number' || typeof this.stringProp === 'boolean' ? this.stringProp : JSON.stringify(this.stringProp)},`; 
        }

      

        if(this.additionalProperties !== undefined) { 
          for (const [key, value] of this.additionalProperties.entries()) {
            //Only render additionalProperties which are not already a property
            if(Object.keys(this).includes(String(key))) continue;
            json += `\"${key}\": ${typeof value === 'number' || typeof value === 'boolean' ? value : JSON.stringify(value)},`;    
          }
        }

        //Remove potential last comma 
        return `${json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}`;
      }

      public static unmarshal(json: string | object): NestedTest {
        const obj = typeof json === "object" ? json : JSON.parse(json);
        const instance = new NestedTest({} as any);

        if (obj.stringProp !== undefined) {
          instance.stringProp = obj["stringProp"];
        }

        //Not part of core properties
      
        if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
        for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["stringProp"].includes(key);}))) {
        
          instance.additionalProperties.set(key, value as any);
        }
        return instance;
      }
    }
    class Test {
      private _stringProp: string;
      private _numberProp?: number;
      private _objectProp?: NestedTest;
      private _additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;
      private _sTestPatternProperties?: Map<String, string>;

      constructor(input: {
        stringProp: string,
        numberProp?: number,
        objectProp?: NestedTest,
      }) {
        this._stringProp = input.stringProp;
        this._numberProp = input.numberProp;
        this._objectProp = input.objectProp;
      }

      get stringProp(): string { return this._stringProp; }
      set stringProp(stringProp: string) { this._stringProp = stringProp; }

      get numberProp(): number | undefined { return this._numberProp; }
      set numberProp(numberProp: number | undefined) { this._numberProp = numberProp; }

      get objectProp(): NestedTest | undefined { return this._objectProp; }
      set objectProp(objectProp: NestedTest | undefined) { this._objectProp = objectProp; }

      get additionalProperties(): Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined { return this._additionalProperties; }
      set additionalProperties(additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined) { this._additionalProperties = additionalProperties; }

      get sTestPatternProperties(): Map<String, string> | undefined { return this._sTestPatternProperties; }
      set sTestPatternProperties(sTestPatternProperties: Map<String, string> | undefined) { this._sTestPatternProperties = sTestPatternProperties; }

      public marshal() : string {
        let json = '{'
        if(this.stringProp !== undefined) {
          json += `\"string prop\": ${typeof this.stringProp === 'number' || typeof this.stringProp === 'boolean' ? this.stringProp : JSON.stringify(this.stringProp)},`; 
        }
        if(this.numberProp !== undefined) {
          json += `\"numberProp\": ${typeof this.numberProp === 'number' || typeof this.numberProp === 'boolean' ? this.numberProp : JSON.stringify(this.numberProp)},`; 
        }
        if(this.objectProp !== undefined) {
          json += `\"objectProp\": ${this.objectProp.marshal()},`; 
        }

        if(this.sTestPatternProperties !== undefined) { 
          for (const [key, value] of this.sTestPatternProperties.entries()) {
            //Only render pattern properties which are not already a property
            if(Object.keys(this).includes(String(key))) continue;
            json += `\"${key}\": ${typeof value === 'number' || typeof value === 'boolean' ? value : JSON.stringify(value)},`;
          }
        }

        if(this.additionalProperties !== undefined) { 
          for (const [key, value] of this.additionalProperties.entries()) {
            //Only render additionalProperties which are not already a property
            if(Object.keys(this).includes(String(key))) continue;
            json += `\"${key}\": ${typeof value === 'number' || typeof value === 'boolean' ? value : JSON.stringify(value)},`;    
          }
        }

        //Remove potential last comma 
        return `${json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}`;
      }

      public static unmarshal(json: string | object): Test {
        const obj = typeof json === "object" ? json : JSON.parse(json);
        const instance = new Test({} as any);

        if (obj["string prop"] !== undefined) {
          instance.stringProp = obj["string prop"];
        }
        if (obj.numberProp !== undefined) {
          instance.numberProp = obj["numberProp"];
        }
        if (obj.objectProp !== undefined) {
          instance.objectProp = NestedTest.unmarshal(obj["objectProp"]);
        }

        //Not part of core properties
        if (instance.sTestPatternProperties === undefined) {instance.sTestPatternProperties = new Map();}
        if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}
        for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["string prop","numberProp","objectProp"].includes(key);}))) {
          //Check all pattern properties
          if (key.match(new RegExp('^S(.?)test'))) {
            instance.sTestPatternProperties.set(key, value as any);
            continue;
          }
          instance.additionalProperties.set(key, value as any);
        }
        return instance;
      }
    }
    const ajv = new Ajv();
    const nestedTestInstance = new NestedTest({stringProp: "SomeTestString"});
    nestedTestInstance.additionalProperties = new Map();
    const testInstance = new Test({numberProp: 0, stringProp: "SomeTestString", objectProp: nestedTestInstance});
    testInstance.additionalProperties = new Map();
    testInstance.additionalProperties.set('additionalProp', ['Some test value']);
    testInstance.sTestPatternProperties = new Map();
    testInstance.sTestPatternProperties.set('Stest', 'Some pattern value');


    const marshalContent = testInstance.marshal();
    const unmarshalInstance = Test.unmarshal(marshalContent);
    const validationResult = ajv.validate(doc, JSON.parse(marshalContent));

    expect(marshalContent).toEqual("{\"string prop\": \"SomeTestString\",\"numberProp\": 0,\"objectProp\": {\"stringProp\": \"SomeTestString\"},\"Stest\": \"Some pattern value\",\"additionalProp\": [\"Some test value\"]}");
    expect(validationResult).toEqual(true);
    expect(unmarshalInstance).toEqual(testInstance);
  });
});
