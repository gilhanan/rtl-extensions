import { computeStyle, injectCSSOnce } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function swapTransform(element: Element): string | undefined {
  const transform = computeStyle({ element }).get('transform');

  const matrix = new DOMMatrix(transform);

  if (!matrix.e) {
    return;
  }

  matrix.e = -matrix.e;

  return injectCSSOnce({
    element,
    rule: (className) => `.${RTL_ENABLED_CLASS} .${className}:before`,
    styles: {
      transform: matrix.toString(),
    },
  });
}
