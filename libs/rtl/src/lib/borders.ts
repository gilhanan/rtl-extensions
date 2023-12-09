import { ComputedStyle, swapStyleValues } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function swapBorders({
  element,
  computedStyle,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
}): string | undefined {
  return swapStyleValues({
    element,
    computedStyle,
    styleProps: [
      ['borderLeft', 'borderRight'],
      ['borderTopRightRadius', 'borderTopLeftRadius'],
      ['borderBottomRightRadius', 'borderBottomLeftRadius'],
    ],
    rule: (hashedClass) => `.${RTL_ENABLED_CLASS} .${hashedClass}`,
  });
}
