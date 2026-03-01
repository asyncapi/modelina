import {ObjectType} from './ObjectType';
import {EnumType} from './EnumType';
class TestObject {
  private _stringType: string;
  private _createdAt?: Date;
  private _numberType?: number;
  private _booleanType: boolean;
  private _unionType?: string | number | boolean;
  private _arrayType?: (string | number)[];
  private _tupleType?: [string, number];
  private _objectType?: ObjectType;
  private _dictionaryType?: Map<string, string>;
  private _enumType?: EnumType;
  private _nullableString?: string | null;
  private _nullableDate?: Date | null;
  private _requiredNullableDate: Date | null;
  private _additionalProperties?: Map<string, any | string>;

  constructor(input: {
    stringType: string,
    createdAt?: Date,
    numberType?: number,
    booleanType: boolean,
    unionType?: string | number | boolean,
    arrayType?: (string | number)[],
    tupleType?: [string, number],
    objectType?: ObjectType,
    dictionaryType?: Map<string, string>,
    enumType?: EnumType,
    nullableString?: string | null,
    nullableDate?: Date | null,
    requiredNullableDate: Date | null,
    additionalProperties?: Map<string, any | string>,
  }) {
    this._stringType = input.stringType;
    this._createdAt = input.createdAt;
    this._numberType = input.numberType;
    this._booleanType = input.booleanType;
    this._unionType = input.unionType;
    this._arrayType = input.arrayType;
    this._tupleType = input.tupleType;
    this._objectType = input.objectType;
    this._dictionaryType = input.dictionaryType;
    this._enumType = input.enumType;
    this._nullableString = input.nullableString;
    this._nullableDate = input.nullableDate;
    this._requiredNullableDate = input.requiredNullableDate;
    this._additionalProperties = input.additionalProperties;
  }

  get stringType(): string { return this._stringType; }
  set stringType(stringType: string) { this._stringType = stringType; }

  get createdAt(): Date | undefined { return this._createdAt; }
  set createdAt(createdAt: Date | undefined) { this._createdAt = createdAt; }

  get numberType(): number | undefined { return this._numberType; }
  set numberType(numberType: number | undefined) { this._numberType = numberType; }

  get booleanType(): boolean { return this._booleanType; }
  set booleanType(booleanType: boolean) { this._booleanType = booleanType; }

  get unionType(): string | number | boolean | undefined { return this._unionType; }
  set unionType(unionType: string | number | boolean | undefined) { this._unionType = unionType; }

  get arrayType(): (string | number)[] | undefined { return this._arrayType; }
  set arrayType(arrayType: (string | number)[] | undefined) { this._arrayType = arrayType; }

  get tupleType(): [string, number] | undefined { return this._tupleType; }
  set tupleType(tupleType: [string, number] | undefined) { this._tupleType = tupleType; }

  get objectType(): ObjectType | undefined { return this._objectType; }
  set objectType(objectType: ObjectType | undefined) { this._objectType = objectType; }

  get dictionaryType(): Map<string, string> | undefined { return this._dictionaryType; }
  set dictionaryType(dictionaryType: Map<string, string> | undefined) { this._dictionaryType = dictionaryType; }

  get enumType(): EnumType | undefined { return this._enumType; }
  set enumType(enumType: EnumType | undefined) { this._enumType = enumType; }

  get nullableString(): string | null | undefined { return this._nullableString; }
  set nullableString(nullableString: string | null | undefined) { this._nullableString = nullableString; }

  get nullableDate(): Date | null | undefined { return this._nullableDate; }
  set nullableDate(nullableDate: Date | null | undefined) { this._nullableDate = nullableDate; }

  get requiredNullableDate(): Date | null { return this._requiredNullableDate; }
  set requiredNullableDate(requiredNullableDate: Date | null) { this._requiredNullableDate = requiredNullableDate; }

  get additionalProperties(): Map<string, any | string> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, any | string> | undefined) { this._additionalProperties = additionalProperties; }

  public toJson(): Record<string, unknown> {
    const json: Record<string, unknown> = {};
    if(this.stringType !== undefined) {
      json["string_type"] = this.stringType;
    }
    if(this.createdAt !== undefined) {
      json["createdAt"] = this.createdAt;
    }
    if(this.numberType !== undefined) {
      json["number_type"] = this.numberType;
    }
    if(this.booleanType !== undefined) {
      json["boolean_type"] = this.booleanType;
    }
    if(this.unionType !== undefined) {
      json["union_type"] = this.unionType;
    }
    if(this.arrayType !== undefined) {
      json["array_type"] = this.arrayType;
    }
    if(this.tupleType !== undefined) {
      json["tuple_type"] = [this.tupleType[0] !== undefined ? this.tupleType[0] : null, this.tupleType[1] !== undefined ? this.tupleType[1] : null];
    }
    if(this.objectType !== undefined) {
      json["object_type"] = this.objectType && typeof this.objectType === 'object' && 'toJson' in this.objectType && typeof this.objectType.toJson === 'function' ? this.objectType.toJson() : this.objectType;
    }
    if(this.dictionaryType !== undefined) {
      json["dictionary_type"] = this.dictionaryType;
    }
    if(this.enumType !== undefined) {
      json["enum_type"] = this.enumType;
    }
    if(this.nullableString !== undefined) {
      json["nullable_string"] = this.nullableString;
    }
    if(this.nullableDate !== undefined) {
      json["nullable_date"] = this.nullableDate;
    }
    if(this.requiredNullableDate !== undefined) {
      json["required_nullable_date"] = this.requiredNullableDate;
    }
    if(this.additionalProperties !== undefined) {
      for (const [key, value] of this.additionalProperties.entries()) {
        //Only unwrap those that are not already a property in the JSON object
        if(["string_type","createdAt","number_type","boolean_type","union_type","array_type","tuple_type","object_type","dictionary_type","enum_type","nullable_string","nullable_date","required_nullable_date","additionalProperties"].includes(String(key))) continue;
        json[key] = value;
      }
    }
    return json;
  }

  public marshal(): string {
    return JSON.stringify(this.toJson());
  }

  public static fromJson(obj: Record<string, unknown>): TestObject {
    const instance = new TestObject({} as any);

    if (obj["string_type"] !== undefined) {
      instance.stringType = obj["string_type"] as string;
    }
    if (obj["createdAt"] !== undefined) {
      instance.createdAt = obj["createdAt"] == null ? undefined : new Date(obj["createdAt"] as string);
    }
    if (obj["number_type"] !== undefined) {
      instance.numberType = obj["number_type"] as number;
    }
    if (obj["boolean_type"] !== undefined) {
      instance.booleanType = obj["boolean_type"] as boolean;
    }
    if (obj["union_type"] !== undefined) {
      instance.unionType = obj["union_type"] as string | number | boolean;
    }
    if (obj["array_type"] !== undefined) {
      instance.arrayType = obj["array_type"] as (string | number)[];
    }
    if (obj["tuple_type"] !== undefined) {
      instance.tupleType = obj["tuple_type"] as [string, number];
    }
    if (obj["object_type"] !== undefined) {
      instance.objectType = ObjectType.fromJson(obj["object_type"] as Record<string, unknown>);
    }
    if (obj["dictionary_type"] !== undefined) {
      instance.dictionaryType = obj["dictionary_type"] as Map<string, string>;
    }
    if (obj["enum_type"] !== undefined) {
      instance.enumType = obj["enum_type"] as EnumType;
    }
    if (obj["nullable_string"] !== undefined) {
      instance.nullableString = obj["nullable_string"] as string | null;
    }
    if (obj["nullable_date"] !== undefined) {
      instance.nullableDate = obj["nullable_date"] == null ? undefined : new Date(obj["nullable_date"] as string);
    }
    if (obj["required_nullable_date"] !== undefined) {
      instance.requiredNullableDate = obj["required_nullable_date"] == null ? null : new Date(obj["required_nullable_date"] as string);
    }

    instance.additionalProperties = new Map();
    const propsToCheck = Object.entries(obj).filter((([key,]) => {return !["string_type","createdAt","number_type","boolean_type","union_type","array_type","tuple_type","object_type","dictionary_type","enum_type","nullable_string","nullable_date","required_nullable_date","additionalProperties"].includes(key);}));
    for (const [key, value] of propsToCheck) {
      instance.additionalProperties.set(key, value as any);
    }
    return instance;
  }

  public static unmarshal(json: string | object): TestObject {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    return TestObject.fromJson(obj as Record<string, unknown>);
  }
}
export { TestObject };