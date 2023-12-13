import { computeStyle } from '@rtl-extensions/dom';
import { injectCSSOnceWrapper } from './style';

export function fixTextAlign(element: Element): void {
  const computedStyle = computeStyle({ element });

  if (computedStyle.get('direction') === 'rtl') {
    if (computedStyle.get('textAlign') === 'left') {
      injectCSSOnceWrapper({
        element,
        rule: (className) => `.${className}`,
        styles: {
          textAlign: 'start',
        },
      });
    }
  }

  Array.from(element.children).forEach(fixTextAlign);
}
