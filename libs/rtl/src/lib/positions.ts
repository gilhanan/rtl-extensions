import {
  ComputedStyle,
  computeStyle,
  swapStyleValues,
} from '@rtl-extensions/dom';
import { RTL_ENABLED_CLASS } from './toggle-rtl';

export function swapPositions({
  element,
  computedStyle,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
}): string | undefined {
  if (computeStyle({ element }).get('position') !== 'absolute') {
    return;
  }

  return swapStyleValues({
    element,
    computedStyle,
    styleProps: [['left', 'right']],
    rule: (hashedClass) => `.${RTL_ENABLED_CLASS} .${hashedClass}`,
  });
}
