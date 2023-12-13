import { ComputedStyle } from '@rtl-extensions/dom';
import { injectCSSOnceWrapper } from './style';

export function swapFloat({
  element,
  computedStyle,
  pseudoElt,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
  pseudoElt?: string;
}): string | undefined {
  const float = computedStyle.get('float');

  if (float !== 'left' && float !== 'right') {
    return;
  }

  return injectCSSOnceWrapper({
    element,
    rule: (className) => `.${className}${pseudoElt ? `:${pseudoElt}` : ''}`,
    styles: {
      float: float === 'left' ? 'inline-start' : 'inline-end',
    },
  });
}
