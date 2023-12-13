import { ComputedStyle, swapStyleValues } from '@rtl-extensions/dom';

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
    rule: (hashedClass) =>
      `.${hashedClass}${
        pseudoElt ? `:${pseudoElt}` : ''
      }`,
  });
}
