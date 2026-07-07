
class ObjectType {
  private _test?: string;
  private _additionalProperties?: Map<string, any>;

  constructor(input: {
    test?: string,
    additionalProperties?: Map<string, any>,
  }) {
    this._test = input.test;
    this._additionalProperties = input.additionalProperties;
  }

  get test(): string | undefined { return this._test; }
  set test(test: string | undefined) { this._test = test; }

  get additionalProperties(): Map<string, any> | undefined { return this._additionalProperties; }
  set additionalProperties(additionalProperties: Map<string, any> | undefined) { this._additionalProperties = additionalProperties; }

  public toJson(): Record<string, unknown> {
    const json: Record<string, unknown> = {};
    if(this.test !== undefined) {
      json["test"] = this.test;
    }
    if(this.additionalProperties !== undefined) {
      for (const [key, value] of this.additionalProperties.entries()) {
        //Only unwrap those that are not already a property in the JSON object
        if(["test","additionalProperties"].includes(String(key))) continue;
        json[key] = value;
      }
    }
    return json;
  }

  public marshal(): string {
    return JSON.stringify(this.toJson());
  }

  public static fromJson(obj: Record<string, unknown>): ObjectType {
    const instance = new ObjectType({} as any);

    if (obj["test"] !== undefined) {
      instance.test = obj["test"] as string;
    }

    instance.additionalProperties = new Map();
    const propsToCheck = Object.entries(obj).filter((([key,]) => {return !["test","additionalProperties"].includes(key);}));
    for (const [key, value] of propsToCheck) {
      instance.additionalProperties.set(key, value as any);
    }
    return instance;
  }

  public static unmarshal(json: string | object): ObjectType {
    const obj = typeof json === "object" ? json : JSON.parse(json);
    return ObjectType.fromJson(obj as Record<string, unknown>);
  }
}
export { ObjectType };