export const listItemsTags = ['li', 'dt', 'dd'];

export function isHTMLElement(node: Node | null): node is HTMLElement {
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

export function isHTMLUListElement(node: Node): node is HTMLUListElement {
  return node instanceof HTMLUListElement;
}

export function isHTMLOListElement(node: Node): node is HTMLOListElement {
  return node instanceof HTMLOListElement;
}

export function isHTMLDListElement(node: Node): node is HTMLDListElement {
  return node instanceof HTMLDListElement;
}

export function isHTMLListElement(node: Node): boolean {
  return (
    isHTMLUListElement(node) ||
    isHTMLOListElement(node) ||
    isHTMLDListElement(node)
  );
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

export function getParentList(element: Element): Element | null {
  return element.closest('ul, ol, dl');
}

export function isInputElement(element: Element): boolean {
  return (
    element.tagName === 'INPUT' ||
    element.tagName === 'TEXTAREA' ||
    element.getAttribute('contenteditable') === 'true'
  );
}

export function getListItems({ list }: { list: Element }): Element[] {
  return Array.from(list.children).filter(({ tagName }) =>
    listItemsTags.includes(tagName.toLowerCase())
  );
}
