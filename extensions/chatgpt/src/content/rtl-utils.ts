import { containsRTL } from '@rtl-extensions/utils';
import { isHTMLDivElement, toggleClass } from '@rtl-extensions/dom';

export const RTL_CLASS = 'rtl';
export const RTL_ENABLED_CLASS = 'rtl-enabled';

function isRTLApplicable({ textContent }: Element): boolean {
  return !!(textContent && containsRTL(textContent));
}

function enableRTLElement(element: Element): void {
  toggleClass({ element, className: RTL_CLASS, enabled: true });
}

export function applyRTLToElements(): void {
  Array.from(document.body.querySelectorAll('p, ol, ul, div'))
    .filter(
      (element) => !isHTMLDivElement(element) || element.children.length === 0
    )
    .filter(isRTLApplicable)
    .forEach(enableRTLElement);
}

export function applyRTLToInput(element: Element): void {
  toggleClass({
    element,
    className: RTL_CLASS,
    enabled: isRTLApplicable(element),
  });
}

export function toggleRTLGlobal({ enabled }: { enabled: boolean }): void {
  toggleClass({
    element: document.body,
    className: RTL_ENABLED_CLASS,
    enabled,
  });
}
