import { ComputedStyle, injectCSSOnce } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function flipBackground({
  element,
  computedStyle,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
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

  return [
    injectCSSOnce({
      element,
      rule: (className) => `.${RTL_ENABLED_CLASS} .${className}`,
      styles: {
        background: 'none',
        zIndex: '0',
        ...(position === 'static' ? { position: 'relative' } : {}),
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
        zIndex: '-1',
        transform: 'scaleX(-1)',
      },
    }),
  ].filter(Boolean) as string[];
}
