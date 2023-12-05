import { computeStyle, injectCSSOnce } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function fixTextAlign(element: Element): void {
  const computedStyle = computeStyle({ element });

  if (computedStyle.get('direction') === 'rtl') {
    const textAlign = computedStyle.get('textAlign');

    if (textAlign === 'left') {
      injectCSSOnce({
        element,
        rule: (className) => `.${RTL_ENABLED_CLASS} .${className}`,
        styles: {
          textAlign: 'start',
        },
      });
    }
  }

  Array.from(element.children).forEach(fixTextAlign);
}
