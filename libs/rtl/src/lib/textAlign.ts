import { computeStyle, isHTMLElement } from '@rtl-extensions/dom';
import { injectCSSOnceWrapper } from './style';
import { Direction } from '@rtl-extensions/shared';

export function fixTextAlign({
  element,
  direction,
}: {
  element: HTMLElement;
  direction: Direction;
}): void {
  const computedStyle = computeStyle({ element });

  if (computedStyle.get('direction') === direction) {
    const textAlign = direction === 'rtl' ? 'left' : 'right';

    if (computedStyle.get('textAlign') === textAlign) {
      injectCSSOnceWrapper({
        element,
        rule: (className) => `.${className}`,
        styles: {
          textAlign: 'start',
        },
      });
    }
  }

  Array.from(element.children)
    .filter(isHTMLElement)
    .forEach((element) => fixTextAlign({ element, direction }));
}
