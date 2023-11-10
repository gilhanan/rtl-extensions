export function throttle({
  callback,
  limitInMs,
}: {
  callback: () => void;
  limitInMs: number;
}): () => void {
  let lastFunc: number;
  let lastRan: number;

  function callCallback() {
    lastRan = Date.now();
    callback();
  }

  return () => {
    if (!lastRan) {
      callCallback();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(
        callCallback,
        Math.max(0, limitInMs - (Date.now() - lastRan))
      );
    }
  };
}
