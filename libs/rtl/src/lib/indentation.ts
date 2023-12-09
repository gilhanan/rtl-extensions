import { ComputedStyle, swapStyleValues } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function swapIndentation({
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
      ['paddingLeft', 'paddingRight'],
      ['marginLeft', 'marginRight'],
    ],
    rule: (hashedClass) => `.${RTL_ENABLED_CLASS} .${hashedClass}`,
  });
}
