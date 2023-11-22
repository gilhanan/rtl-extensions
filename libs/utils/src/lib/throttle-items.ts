export function throttleItems<T>({
  callback,
  limitInMs,
}: {
  callback: (items: T[]) => void;
  limitInMs: number;
}): (items: T[]) => void {
  const itemsToProcess = new Set<T>();
  let timeoutId: number;
  let lastRan: number;

  function callCallback() {
    callback(Array.from(itemsToProcess));
    lastRan = Date.now();
    itemsToProcess.clear();
  }

  return (items: T[]) => {
    items.forEach((item) => itemsToProcess.add(item));

    if (!lastRan) {
      callCallback();
    } else {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(
        callCallback,
        Math.max(0, limitInMs - (Date.now() - lastRan))
      );
    }
  };
}
