const processedElements = new WeakSet<Element>();

export function processElementsOnce(
  proccessFunction: (element: Element) => void
): void {
  document.querySelectorAll('*').forEach((element) => {
    if (!processedElements.has(element)) {
      proccessFunction(element);
      processedElements.add(element);
    }
  });
}
