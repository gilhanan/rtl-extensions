import {
  ComputedStyle,
  computeStyle,
  isHTMLImageElement,
} from '@rtl-extensions/dom';
import { isLetter } from '@rtl-extensions/utils';
import { injectCSSOnceWrapper } from './style';

function isContainsAbsoluteText(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  return Array.from(element.children).some(
    (child) =>
      isLetter(element.textContent) &&
      computeStyle({ element: child }).get('position') === 'absolute'
  );
}

export function flipImage({
  element,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
  pseudoElt?: string;
}): string | undefined {
  if (!isHTMLImageElement(element)) {
    return;
  }

  if (!isContainsAbsoluteText(element.parentElement)) {
    return;
  }

  return injectCSSOnceWrapper({
    element,
    rule: (className) => `.${className}`,
    styles: {
      transform: 'scaleX(-1)',
    },
  });
}
