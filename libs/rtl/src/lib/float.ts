import { computeStyle, injectCSSOnce } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function swapFloat(element: Element): void {
  const float = computeStyle({ element }).get('float');

  if (float !== 'left' && float !== 'right') {
    return;
  }

  injectCSSOnce({
    element,
    rule: (className) => `.${RTL_ENABLED_CLASS} .${className}`,
    styles: {
      float: float === 'left' ? 'inline-start' : 'inline-end',
    },
  });
}