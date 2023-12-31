import { ComputedStyle } from '@rtl-extensions/dom';
import { swapStyleValues } from './style';

export function swapBorders({
  element,
  computedStyle,
  pseudoElt,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
  pseudoElt?: string;
}): string | undefined {
  return swapStyleValues({
    element,
    computedStyle,
    styleProps: [
      ['borderLeft', 'borderRight'],
      ['borderTopRightRadius', 'borderTopLeftRadius'],
      ['borderBottomRightRadius', 'borderBottomLeftRadius'],
    ],
    rule: (hashedClass) => `.${hashedClass}${pseudoElt ? `:${pseudoElt}` : ''}`,
  });
}
