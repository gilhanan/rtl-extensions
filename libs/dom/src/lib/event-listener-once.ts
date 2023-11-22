const listeners = new WeakMap();

export function addEventListenerOnce({
  element,
  type,
  callback,
}: {
  element: Element;
  type: string;
  callback: () => void;
}): void {
  if (listeners.has(element)) return;
  element.addEventListener(type, callback);
  listeners.set(element, true);
}
