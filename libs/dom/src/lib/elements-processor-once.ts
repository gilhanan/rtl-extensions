import { getPresentedElements } from './dom';

const processedElements = new WeakSet<HTMLElement>();

export function processElementsOnce(
  proccessFunction: (element: HTMLElement) => void
): void {
  getPresentedElements().forEach((element) => {
    if (!processedElements.has(element)) {
      proccessFunction(element);
      processedElements.add(element);
    }
  });
}
