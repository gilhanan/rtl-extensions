import {
  ComputedStyle,
  computeStyle,
  swapStyleValues,
} from '@rtl-extensions/dom';

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
    rule: (hashedClass) =>
      `.${hashedClass}${
        pseudoElt ? `:${pseudoElt}` : ''
      }`,
  });
}
