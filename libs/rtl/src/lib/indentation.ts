import { ComputedStyle } from '@rtl-extensions/dom';
import { swapStyleValues } from './style';

export function swapIndentation({
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
      ['paddingLeft', 'paddingRight'],
      ['marginLeft', 'marginRight'],
    ],
    rule: (hashedClass) => `.${hashedClass}${pseudoElt ? `:${pseudoElt}` : ''}`,
  });
}
