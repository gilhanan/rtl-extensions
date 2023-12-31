export function throttle({
  callback,
  limitInMs,
}: {
  callback: () => void;
  limitInMs: number;
}): () => void {
  let timeoutId: number;
  let lastRan: number;

  function callCallback() {
    callback();
    lastRan = Date.now();
  }

  return () => {
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
