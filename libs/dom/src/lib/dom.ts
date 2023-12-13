import { isLetter } from '@rtl-extensions/utils';
import { computeStyle } from './style';
import { StylePropsCamelCase } from './shared';

export const listItemsTags = ['li', 'dt', 'dd'];

export function isTextNode(node: Node): node is Text {
  return node.nodeType === Node.TEXT_NODE;
}

export function isHTMLNoScript(node: Node): boolean {
  return isHTMLElement(node) && node.tagName === 'NOSCRIPT';
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

function isDisplayNone(node: Node): boolean {
  return (
    isHTMLElement(node) &&
    computeStyle({ element: node }).get('display') === 'none'
  );
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

export function isPresented(element: Node): boolean {
  return (
    !isHTMLScriptElement(element) &&
    !isHTMLStyleElement(element) &&
    !isHTMLNoScript(element) &&
    !isDisplayNone(element)
  );
}

export function getPresentedNestedChildren(
  element = document.body
): HTMLElement[] {
  return Array.from(element.querySelectorAll('*'))
    .filter(isHTMLElement)
    .filter(isPresented);
}

export function isLetterNode(node: Node): boolean {
  return isTextNode(node) && isLetter(node.textContent);
}

export function queryParents({
  element,
  property,
  value,
}: {
  element: HTMLElement;
  property: StylePropsCamelCase;
  value: string;
}): HTMLElement | undefined {
  let current: HTMLElement = element;

  while (current?.parentElement) {
    const { parentElement }: HTMLElement = current;

    const parentValue = computeStyle({
      element: parentElement,
    }).get(property);

    if (parentValue === value) {
      return current;
    }

    current = parentElement;
  }

  return;
}

function isAncestor({
  ancestor,
  element,
}: {
  ancestor: HTMLElement;
  element: HTMLElement;
}): boolean {
  let current: HTMLElement | null = element;
  while (current) {
    if (current === ancestor) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

export function findCommonAncestor(elements: HTMLElement[]): HTMLElement {
  const remainingElements = new Set(elements);

  let ancestor: HTMLElement | null = elements[0];
  while (ancestor) {
    remainingElements.forEach((element) => {
      if (!isAncestor({ ancestor: ancestor as HTMLElement, element })) {
        remainingElements.delete(element);
      }
    });

    if (remainingElements.size === 0) {
      return ancestor;
    }

    ancestor = ancestor.parentElement;
  }

  return document.documentElement;
}
