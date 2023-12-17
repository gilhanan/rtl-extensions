import { injectCSSOnceWrapper } from './style';

const arrowRegex =
  /((left|right)(_|-)?(arrow|chevron)|(arrow|chevron)(_|-)?(left|right))/i;

function isArrow(input: string): boolean {
  return arrowRegex.test(input);
}

export function swapArrows({
  element,
  pseudoElt,
}: {
  element: HTMLElement;
  pseudoElt?: string;
}): string | undefined {
  const isContainsClassArrow = Array.from(element.classList).some((c) =>
    isArrow(c)
  );

  const isContainsAttributeArrow = Array.from(element.attributes).some(
    ({ value }) => isArrow(value)
  );

  if (!isContainsClassArrow && !isContainsAttributeArrow) {
    return;
  }

  return injectCSSOnceWrapper({
    element,
    rule: (className) => `.${className}${pseudoElt ? `:${pseudoElt}` : ''}`,
    styles: {
      transform: 'scaleX(-1)',
    },
  });
}
