import { computeStyle, swapStyleValues } from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function swapPositions(element: HTMLElement): string | undefined {
  if (computeStyle({ element }).get('position') !== 'absolute') {
    return;
  }

  return swapStyleValues({
    element,
    styleProps: [['left', 'right']],
    rule: (hashedClass) => `.${RTL_ENABLED_CLASS} .${hashedClass}`,
  });
}
