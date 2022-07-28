/* eslint-disable security/detect-object-injection */

/**
 * Deep partial type that does NOT partial function arguments.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T extends Function ? T : (T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T);

export function mergePartialAndDefault<T extends Record<string, any>>(defaultNonOptional: T, customOptional?: DeepPartial<T>): T {
  if (customOptional === undefined) {
    return defaultNonOptional;
  }
  // create a new object
  const target = {...defaultNonOptional} as Record<string, any>;

  // deep merge the object into the target object
  const merger = (obj: Record<string, any>) => {
    for (const [propName, prop] of Object.entries(obj)) {
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
  };
  merger(customOptional);
  return target as T;
}
