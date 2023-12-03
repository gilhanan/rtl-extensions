import { swapStyleValues } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function swapIndentation(element: Element): string | undefined {
  return swapStyleValues({
    element,
    styleProps: [
      ['paddingLeft', 'paddingRight'],
      ['marginLeft', 'marginRight'],
    ],
    rule: (hashedClass) => `.${RTL_ENABLED_CLASS} .${hashedClass}`,
  });
}
