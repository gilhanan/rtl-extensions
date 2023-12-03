import { computeStyle, injectCSSOnce } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

function getZIndex(zIndex = ''): string {
  if (zIndex === 'auto') {
    return 'auto';
  }

  const zIndexNumber = parseInt(zIndex, 10);

  if (isNaN(zIndexNumber)) {
    return 'auto';
  }

  return '-1';
}

export function flipBackground(element: HTMLElement): string[] {
  if (element.childElementCount === 0 || !element.innerText) {
    return [];
  }

  const computedStyle = computeStyle({ element });

  const backgroundImage = computedStyle.get('backgroundImage');

  if (!backgroundImage?.startsWith('url')) {
    return [];
  }

  const background = computedStyle.get('background');
  const position = computedStyle.get('position');
  const zIndex = computedStyle.get('zIndex');

  return [
    injectCSSOnce({
      element,
      rule: (className) => `.${RTL_ENABLED_CLASS} .${className}`,
      styles: {
        background: 'none',
        position: position === 'static' ? 'relative' : position,
      },
    }),
    injectCSSOnce({
      element,
      rule: (className) => `.${RTL_ENABLED_CLASS} .${className}:before`,
      styles: {
        content: '""',
        background,
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        zIndex: getZIndex(zIndex),
        transform: 'scaleX(-1)',
      },
    }),
  ].filter(Boolean) as string[];
}
