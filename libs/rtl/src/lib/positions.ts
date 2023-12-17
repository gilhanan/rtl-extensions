import { ComputedStyle, computeStyle } from '@rtl-extensions/dom';
import { swapStyleValues } from './style';

function isRelativeParent(element: HTMLElement): boolean {
  return !!(
    computeStyle({
      element,
    }).get('position') === 'relative' && element.offsetHeight
  );
}

export function getRelativeParent(
  element: HTMLElement
): HTMLElement | undefined {
  let currentParent = element.parentElement;

  while (currentParent) {
    if (isRelativeParent(currentParent)) {
      return currentParent;
    }

    currentParent = currentParent.parentElement;
  }

  return;
}

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

  const relativeParent = getRelativeParent(element);

  if (!relativeParent) {
    return;
  }

  return swapStyleValues({
    element,
    computedStyle,
    styleProps: [['left', 'right']],
    rule: (hashedClass) => `.${hashedClass}${pseudoElt ? `:${pseudoElt}` : ''}`,
  });
}
