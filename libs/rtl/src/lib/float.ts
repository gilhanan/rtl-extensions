import { ComputedStyle, injectCSSOnce } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function swapFloat({
  element,
  computedStyle,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
}): string | undefined {
  const float = computedStyle.get('float');

  if (float !== 'left' && float !== 'right') {
    return;
  }

  return injectCSSOnce({
    element,
    rule: (className) => `.${RTL_ENABLED_CLASS} .${className}`,
    styles: {
      float: float === 'left' ? 'inline-start' : 'inline-end',
    },
  });
}
