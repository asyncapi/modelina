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
export function mergePartialAndDefault<T extends Record<string, any>>(
  defaultNonOptional: T,
  customOptional?: DeepPartial<T>
): T {
  if (customOptional === undefined) {
    return Object.assign({}, defaultNonOptional);
  }
  // create a new object
  const target = Object.assign({}, defaultNonOptional) as Record<string, any>;

  // deep merge the object into the target object
  for (const [propName, prop] of Object.entries(customOptional)) {
    const isObjectOrClass =
      typeof prop === 'object' && target[propName] !== undefined;
    const isRegularObject = !isClass(prop);
    const isArray = Array.isArray(prop);
    if (isArray) {
      // merge array into target with a new array instance so we dont touch the default value
      target[propName] = [...(target[propName] ?? []), ...(prop ?? [])];
    } else if (isObjectOrClass && isRegularObject) {
      target[propName] = mergePartialAndDefault(target[propName], prop);
    } else if (prop) {
      target[propName] = prop;
    }
  }

  return target as T;
}
