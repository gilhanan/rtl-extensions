import { ComputedStyle } from '@rtl-extensions/dom';
import { injectCSSOnceWrapper } from './style';

export function swapTransform({
  element,
  computedStyle,
  pseudoElt,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
  pseudoElt?: string;
}): string | undefined {
  const transform = computedStyle.get('transform');

  const matrix = new DOMMatrix(transform);

  if (!matrix.e) {
    return;
  }

  matrix.e = -matrix.e;

  return injectCSSOnceWrapper({
    element,
    rule: (className) => `.${className}${pseudoElt ? `:${pseudoElt}` : ''}`,
    styles: {
      transform: matrix.toString(),
    },
  });
}
