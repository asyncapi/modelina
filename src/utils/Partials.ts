/* eslint-disable security/detect-object-injection */

/**
 * Deep partial type that does NOT partial function arguments.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T extends Function ? T : (T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T);

/**
 * Merge a non optional value with custom optional values to form a full value that has all properties sat.
 */
export function mergePartialAndDefault<T extends Record<string, any>>(defaultNonOptional: T, customOptional?: DeepPartial<T>): T {
  if (customOptional === undefined) {
    return defaultNonOptional;
  }
  // create a new object
  const target = {...defaultNonOptional} as Record<string, any>;

  // deep merge the object into the target object
  for (const [propName, prop] of Object.entries(customOptional)) {
    if (typeof prop === 'object') {
      if (target[propName] === undefined) {
        target[propName] = prop;
      } else {
        target[propName] = mergePartialAndDefault(target[propName], prop);
      }
    } else if (prop) {
      target[propName] = prop;
    }
  }

  return target as T;
}
