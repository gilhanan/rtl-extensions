import { isLetter } from '@rtl-extensions/utils';

interface QueryHTMLElements {
  element?: Element;
  selector?: string;
}

export const listItemsTags = ['li', 'dt', 'dd'];

export function isTextNode(node: Node): node is Text {
  return node.nodeType === Node.TEXT_NODE;
}

export function isHTMLNoScript(node: HTMLElement): boolean {
  return node.tagName === 'NOSCRIPT';
}

export function isHTMLScriptElement(node: Node): node is HTMLScriptElement {
  return node instanceof HTMLScriptElement;
}

export function isHTMLStyleElement(node: Node): node is HTMLStyleElement {
  return node instanceof HTMLStyleElement;
}

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

export function queryHTMLElements({
  element = document.body,
  selector = '*',
}: QueryHTMLElements): HTMLElement[] {
  return Array.from(element.querySelectorAll(selector)).filter(isHTMLElement);
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

export function getListItems({ list }: { list: HTMLElement }): HTMLElement[] {
  return Array.from(list.children)
    .filter(isHTMLElement)
    .filter(({ tagName }) => listItemsTags.includes(tagName.toLowerCase()));
}

export function getPresentedElements(
  query: QueryHTMLElements = {}
): HTMLElement[] {
  return queryHTMLElements(query).filter(
    (element) =>
      !isHTMLScriptElement(element) &&
      !isHTMLStyleElement(element) &&
      !isHTMLNoScript(element)
  );
}

export function getTextNodes(): HTMLElement[] {
  return getPresentedElements().filter(({ childNodes }) =>
    Array.from(childNodes).some(
      (element) => isTextNode(element) && isLetter(element.textContent)
    )
  );
}
