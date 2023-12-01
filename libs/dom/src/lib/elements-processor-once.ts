const processedElements = new WeakSet<HTMLElement>();

export function processElementsOnce({
  elements,
  proccessFunction,
}: {
  elements: HTMLElement[];
  proccessFunction: (element: HTMLElement) => void;
}): void {
  elements.forEach((element) => {
    if (!processedElements.has(element)) {
      proccessFunction(element);
      processedElements.add(element);
    }
  });
}
