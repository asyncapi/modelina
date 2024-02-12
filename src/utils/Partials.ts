/* eslint-disable security/detect-object-injection, @typescript-eslint/ban-types */

/**
 * Deep partial type that does NOT partial function arguments.
 */
export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * Return true or false based on whether the input object is a regular object or a class
 *
 * Taken from: https://stackoverflow.com/a/43197340/6803886
 * @param obj
 */
function isClass(obj: any): boolean {
  const isCtorClass =
    obj.constructor && obj.constructor.toString().substring(0, 5) === 'class';
  if (obj.prototype === undefined) {
    return isCtorClass;
  }
  const isPrototypeCtorClass =
    obj.prototype.constructor &&
    obj.prototype.constructor.toString &&
    obj.prototype.constructor.toString().substring(0, 5) === 'class';
  return isCtorClass || isPrototypeCtorClass;
}

/**
 * Merge a non optional value with custom optional values to form a full value that has all properties sat.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function mergePartialAndDefault<T extends Record<string, any>>(
  defaultNonOptional: T,
  customOptional?: DeepPartial<T>
): T {
  if (!customOptional) {
    return { ...defaultNonOptional };
  }

  const mergeProps = (targetObj: any, newValue: any) => {
    const isObjectOrClass =
      typeof newValue === 'object' && targetObj !== undefined;
    const isRegularObject = !isClass(newValue);
    const isArray = Array.isArray(newValue);

    if (isArray) {
      targetObj = targetObj ? [...targetObj, ...newValue] : [...newValue];
    } else if (isObjectOrClass && isRegularObject) {
      targetObj = mergePartialAndDefault(targetObj, newValue);
    } else if (newValue !== undefined) {
      targetObj = newValue;
    }
    return targetObj;
  };

  const merged: Record<string, any> = { ...defaultNonOptional };
  for (const [propName, prop] of Object.entries(customOptional)) {
    if (prop !== undefined) {
      merged[propName] = mergeProps(merged[propName], prop);
    }
  }

  return merged as T;
}
