import {
  getPresentedNestedChildren,
  isHTMLListElement,
  toggleClass,
} from '@rtl-extensions/dom';
import { isRTLText } from './is-rtl-text';
import { rtlListLayout, isListRTL } from './lists';

export const AUTO_DIR_ENABLED_CLASS = 'auto-dir-enabled';
export const AUTO_DIR_RTL_CLASS = 'auto-dir-rtl';

const { documentElement } = document;

export function toggleRTLGlobal({ enabled }: { enabled: boolean }): void {
  toggleClass({
    element: documentElement,
    className: AUTO_DIR_ENABLED_CLASS,
    enabled,
  });
}

export function enableRTLGlobal(): void {
  toggleRTLGlobal({ enabled: true });
}

export function tempDisableRTLGlobal(): {
  restore: () => void;
} {
  const enabled = documentElement.classList.contains(AUTO_DIR_ENABLED_CLASS);

  toggleRTLGlobal({ enabled: false });

  return {
    restore: () => toggleRTLGlobal({ enabled }),
  };
}

export function isElementRTL(element: HTMLElement): boolean {
  return element.classList.contains(AUTO_DIR_RTL_CLASS);
}

export function applyRTLElement({
  element,
  enabled,
}: {
  element: HTMLElement;
  enabled: boolean;
}): void {
  toggleClass({
    element,
    className: AUTO_DIR_RTL_CLASS,
    enabled,
  });

  if (enabled && isHTMLListElement(element)) {
    rtlListLayout({ list: element });
  }
}

export function enableRTLElement(element: HTMLElement): void {
  applyRTLElement({ element, enabled: true });
}

export function isRTLApplicable(element: HTMLElement): boolean {
  if (isHTMLListElement(element) && isListRTL({ list: element })) {
    return true;
  }

  return Array.from(element.childNodes).some(
    ({ nodeType, textContent }) =>
      nodeType === Node.TEXT_NODE && isRTLText(textContent)
  );
}

export function queryAndAplyRTL({ element }: { element: HTMLElement }): void {
  getPresentedNestedChildren(element)
    .concat(element)
    .filter(isRTLApplicable)
    .forEach(enableRTLElement);
}
