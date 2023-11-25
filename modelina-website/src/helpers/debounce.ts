export function debounce(
  func: (...args: any[]) => any,
  wait: number,
  immediate?: boolean
): (...args: any[]) => any {
  let timeout: number | null;

  return function executedFunction(this: any, ...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    // eslint-disable-next-line no-unused-expressions
    timeout && clearTimeout(timeout);
    timeout = setTimeout(later, wait) as unknown as number;

    if (callNow) {
      func.apply(context, args);
    }
  };
}
