import { isHTMLListElement, toggleClass } from '@rtl-extensions/dom';
import { getRTLEnabledValue } from './rtl-enabled-storage';
import { isRTLText } from './is-rtl-text';
import { rtlListLayout, isListRTL } from './lists';

export const RTL_ENABLED_CLASS = 'rtl-enabled';
const RTL_CLASS = 'rtl';

export function toggleRTLGlobal({ enabled }: { enabled: boolean }): void {
  toggleClass({
    element: document.body,
    className: RTL_ENABLED_CLASS,
    enabled,
  });
}

export async function tempDisableRTLGlobal(): Promise<{
  restore: () => void;
}> {
  const enabled = await getRTLEnabledValue();

  toggleRTLGlobal({ enabled: false });

  return {
    restore: () => toggleRTLGlobal({ enabled }),
  };
}

export function applyRTLElement({
  element,
  enabled,
}: {
  element: Element;
  enabled: boolean;
}): void {
  toggleClass({
    element,
    className: RTL_CLASS,
    enabled,
  });

  if (enabled && isHTMLListElement(element)) {
    rtlListLayout({ list: element });
  }
}

export function enableRTLElement(element: Element): void {
  applyRTLElement({ element, enabled: true });
}

export function isRTLApplicable(element: Element): boolean {
  if (isHTMLListElement(element) && isListRTL({ list: element })) {
    return true;
  }

  return Array.from(element.childNodes).some((childNode) => {
    return (
      childNode.nodeType === Node.TEXT_NODE && isRTLText(childNode.textContent)
    );
  });
}

export function queryAndAplyRTL({ element }: { element: Element }): void {
  Array.from(element.querySelectorAll('*'))
    .concat(element)
    .filter(isRTLApplicable)
    .forEach(enableRTLElement);
}
