import { ComputedStyle, injectCSSOnce } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

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

  return injectCSSOnce({
    element,
    rule: (className) =>
      `.${RTL_ENABLED_CLASS} .${className}${pseudoElt ? `:${pseudoElt}` : ''}`,
    styles: {
      transform: matrix.toString(),
    },
  });
}
