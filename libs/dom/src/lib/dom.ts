export function isHTMLElement(node: Node): node is HTMLElement {
  return node instanceof HTMLElement;
}

export function isHTMLDivElement(node: Node): node is HTMLDivElement {
  return node instanceof HTMLDivElement;
}

export function isHTMLInputElement(node: Node): node is HTMLInputElement {
  return node instanceof HTMLInputElement;
}

export function isHTMLTextAreaElement(node: Node): node is HTMLTextAreaElement {
  return node instanceof HTMLTextAreaElement;
}

export function toggleClass({
  element,
  className,
  enabled,
}: {
  element: Element;
  className: string;
  enabled: boolean;
}): void {
  if (enabled) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

export function filterHTMLElements(nodeList: NodeList): HTMLElement[] {
  return Array.from(nodeList).filter(isHTMLElement);
}

export function queryHTMLElements({
  element,
  selector,
}: {
  element: HTMLElement;
  selector: string;
}): HTMLElement[] {
  return filterHTMLElements(element.querySelectorAll(selector));
}
