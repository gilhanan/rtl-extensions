import { ComputedStyle } from '@rtl-extensions/dom';
import { injectCSSOnceWrapper } from './style';

export function flipBackground({
  element,
  computedStyle,
  pseudoElt,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
  pseudoElt?: string;
}): string[] {
  if (element.childElementCount === 0 || !element.innerText) {
    return [];
  }

  const backgroundImage = computedStyle.get('backgroundImage');

  if (!backgroundImage?.startsWith('url')) {
    return [];
  }

  const background = computedStyle.get('background');
  const position = computedStyle.get('position');

  if (pseudoElt) {
    return [
      injectCSSOnceWrapper({
        element,
        rule: (className) => `.${className}:${pseudoElt}`,
        styles: {
          transform: 'scaleX(-1)',
        },
      }),
    ].filter(Boolean) as string[];
  }

  return [
    injectCSSOnceWrapper({
      element,
      rule: (className) => `.${className}`,
      styles: {
        background: 'none',
        zIndex: '0',
        ...(position === 'static' ? { position: 'relative' } : {}),
      },
    }),
    injectCSSOnceWrapper({
      element,
      rule: (className) => `.${className}:before`,
      styles: {
        content: '""',
        background,
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        zIndex: '-1',
        transform: 'scaleX(-1)',
      },
    }),
  ].filter(Boolean) as string[];
}
