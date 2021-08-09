import { TypeScriptGenerator, TS_COMMON_PRESET } from '../../../../src/generators'; 
describe('TS_COMMON_PRESET', () => {
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
    const expectedTestClass = 'export class Test {\n  private _stringProp?: string;\n  private _numberProp?: number;\n  private _objectProp?: NestedTest;\n  private _additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;\n  private _sTestPatternProperties?: Map<String, string>;\n\n  constructor(input: {\n    stringProp?: string,\n    numberProp?: number,\n    objectProp?: NestedTest,\n  }) {\n    this._stringProp = input.stringProp;\n    this._numberProp = input.numberProp;\n    this._objectProp = input.objectProp;\n  }\n\n  get stringProp(): string | undefined { return this._stringProp; }\n  set stringProp(stringProp: string | undefined) { this._stringProp = stringProp; }\n\n  get numberProp(): number | undefined { return this._numberProp; }\n  set numberProp(numberProp: number | undefined) { this._numberProp = numberProp; }\n\n  get objectProp(): NestedTest | undefined { return this._objectProp; }\n  set objectProp(objectProp: NestedTest | undefined) { this._objectProp = objectProp; }\n\n  get additionalProperties(): Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined { return this._additionalProperties; }\n  set additionalProperties(additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined) { this._additionalProperties = additionalProperties; }\n\n  get sTestPatternProperties(): Map<String, string> | undefined { return this._sTestPatternProperties; }\n  set sTestPatternProperties(sTestPatternProperties: Map<String, string> | undefined) { this._sTestPatternProperties = sTestPatternProperties; }\n\n  public marshal() : string {\n    let json = \'{\'\n    if(this.stringProp !== undefined) {\n      json += `"stringProp": ${JSON.stringify(this.stringProp)},`;   \n    }\n    if(this.numberProp !== undefined) {\n      json += `"numberProp": ${JSON.stringify(this.numberProp)},`;   \n    }\n    if(this.objectProp !== undefined) {\n      json += `"objectProp": ${this.objectProp}.marshal(),`;   \n    }\n\n    if(this.sTestPatternProperties !== undefined) { \n      for (const [key, value] of this.sTestPatternProperties.entries()) {\n        //Only render pattern properties which are not already a property\n        if(Object.keys(this).includes(key)) continue;\n        json += `"${key}": ${JSON.stringify(value)},`;    \n      }\n    }\n\n    if(this.additionalProperties !== undefined) { \n      for (const [key, value] of this.additionalProperties.entries()) {\n        //Only render additionalProperties which are not already a property\n        if(Object.keys(this).includes(key)) continue;\n        json += `"${key}": ${JSON.stringify(value)},`;    \n      }\n    }\n    return `${json.charAt(json.length-1) === \',\' ? json.slice(0, json.length-1) : json}}`;\n  }\n\n  public static unmarshal(json: string | object): Test {\n    const obj = JSON.parse(json);\n    const instance = new Test({});\n\n    if (obj.stringProp !== undefined) {\n      instance.stringProp = obj.stringProp;\n    }\n    if (obj.numberProp !== undefined) {\n      instance.numberProp = obj.numberProp;\n    }\n    if (obj.objectProp !== undefined) {\n      instance.objectProp = obj.objectProp;\n    }\n\n    //Not part of core properties\n    for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["stringProp","numberProp","objectProp"].includes(key);}))) {\n      //Check all pattern properties\n      if (key.match(new RegExp(\'^S(.?)test\'))) {\n        if (instance.sTestPatternProperties === undefined) {instance.sTestPatternProperties = new Map();}\n        instance.sTestPatternProperties.set(key, value as any);\n        continue;\n      }\n\n      if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}\n      instance.additionalProperties.set(key, value as any );\n    }\n    return instance;\n  }\n}';
    const expectedNestedTestClass = 'export class NestedTest {\n  private _stringProp?: string;\n  private _additionalProperties?: Map<String, object | string | number | Array<unknown> | boolean | null | number>;\n\n  constructor(input: {\n    stringProp?: string,\n  }) {\n    this._stringProp = input.stringProp;\n  }\n\n  get stringProp(): string | undefined { return this._stringProp; }\n  set stringProp(stringProp: string | undefined) { this._stringProp = stringProp; }\n\n  get additionalProperties(): Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined { return this._additionalProperties; }\n  set additionalProperties(additionalProperties: Map<String, object | string | number | Array<unknown> | boolean | null | number> | undefined) { this._additionalProperties = additionalProperties; }\n\n  public marshal() : string {\n    let json = \'{\'\n    if(this.stringProp !== undefined) {\n      json += `"stringProp": ${JSON.stringify(this.stringProp)},`;   \n    }\n\n  \n\n    if(this.additionalProperties !== undefined) { \n      for (const [key, value] of this.additionalProperties.entries()) {\n        //Only render additionalProperties which are not already a property\n        if(Object.keys(this).includes(key)) continue;\n        json += `"${key}": ${JSON.stringify(value)},`;    \n      }\n    }\n    return `${json.charAt(json.length-1) === \',\' ? json.slice(0, json.length-1) : json}}`;\n  }\n\n  public static unmarshal(json: string | object): NestedTest {\n    const obj = JSON.parse(json);\n    const instance = new NestedTest({});\n\n    if (obj.stringProp !== undefined) {\n      instance.stringProp = obj.stringProp;\n    }\n\n    //Not part of core properties\n    for (const [key, value] of Object.entries(obj).filter((([key,]) => {return !["stringProp"].includes(key);}))) {\n      //Check all pattern properties\n    \n\n      if (instance.additionalProperties === undefined) {instance.additionalProperties = new Map();}\n      instance.additionalProperties.set(key, value as any );\n    }\n    return instance;\n  }\n}';

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
