import { ComputedStyle, injectCSSOnce } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

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

  return injectCSSOnce({
    element,
    rule: (className) =>
      `.${RTL_ENABLED_CLASS} .${className}${pseudoElt ? `:${pseudoElt}` : ''}`,
    styles: {
      float: float === 'left' ? 'inline-start' : 'inline-end',
    },
  });
}
