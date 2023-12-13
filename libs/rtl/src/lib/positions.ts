import { ComputedStyle, computeStyle } from '@rtl-extensions/dom';
import { swapStyleValues } from './style';

export function swapPositions({
  element,
  computedStyle,
  pseudoElt,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
  pseudoElt?: string;
}): string | undefined {
  if (computeStyle({ element }).get('position') !== 'absolute') {
    return;
  }

  return swapStyleValues({
    element,
    computedStyle,
    styleProps: [['left', 'right']],
    rule: (hashedClass) => `.${hashedClass}${pseudoElt ? `:${pseudoElt}` : ''}`,
  });
}
