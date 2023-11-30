import { swapStyleValues } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function swapBorders(element: Element): void {
  swapStyleValues({
    element,
    styleProps: [
      ['borderLeft', 'borderRight'],
      ['borderTopRightRadius', 'borderTopLeftRadius'],
      ['borderBottomRightRadius', 'borderBottomLeftRadius'],
    ],
    rule: (hashedClass) => `.${RTL_ENABLED_CLASS} .${hashedClass}`,
  });
}