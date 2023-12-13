import {
  getConsistStyles,
  listItemsTags,
  getListItems,
  Styles,
  computeStyle,
} from '@rtl-extensions/dom';
import { generateHash } from '@rtl-extensions/utils';
import { isRTLText } from './is-rtl-text';
import { tempDisableRTLGlobal } from './toggle-rtl';
import { swapIndentation } from './indentation';
import { injectCSSOnceWrapper, injectCSSWrapper } from './style';

const transformsToClasses = new Map<string, string>();
const appliedClasses = new Map<string, true>();

function swapListIndentation({ list }: { list: HTMLElement }): void {
  swapIndentation({
    element: list,
    computedStyle: computeStyle({ element: list }),
  });
}

function swapListItemsIndentation({
  list,
  pseudoElt,
}: {
  list: HTMLElement;
  pseudoElt?: 'before';
}): void {
  const margins = ['marginLeft', 'marginRight'] as const;
  const paddings = ['paddingLeft', 'paddingRight'] as const;

  const consistStyles =
    getConsistStyles({
      elements: getListItems({ list }),
      styleProperties: [...margins, ...paddings],
      pseudoElt,
    }) || {};

  const styles: Styles = Object.fromEntries(
    [margins, paddings]
      .map(([prop1, prop2]) => [
        [prop1, consistStyles[prop2] || '0px'],
        [prop2, consistStyles[prop1] || '0px'],
      ])
      .filter(([[, value1], [, value2]]) => value1 !== value2)
      .flat()
  );

  injectCSSOnceWrapper({
    element: list,
    rule: (hashedClass) =>
      listItemsTags
        .map(
          (tag) => `.${hashedClass} > ${tag}${pseudoElt ? `:${pseudoElt}` : ''}`
        )
        .join(', '),
    styles,
  });
}

function fillTransformsToClasses({ elements }: { elements: Element[] }): void {
  elements
    .map((element) => {
      const transform = computeStyle({ element, pseudoElt: 'before' }).get(
        'transform'
      );

      const matrix = new DOMMatrix(transform);
      matrix.e = -matrix.e;

      return { element, matrix };
    })
    .filter(({ matrix: { e } }) => e)
    .forEach(({ element, matrix }) => {
      const transformMatrix = matrix.toString();

      const hashedClass =
        transformsToClasses.get(transformMatrix) || generateHash();

      transformsToClasses.set(transformMatrix, hashedClass);
      element.classList.add(hashedClass);
    });
}

function swapListItemsMarkersTransform({ list }: { list: HTMLElement }) {
  fillTransformsToClasses({
    elements: getListItems({ list }),
  });

  transformsToClasses.forEach((hashedClass, transform) => {
    if (appliedClasses.get(hashedClass)) {
      return;
    }
    injectCSSWrapper({
      rule: `.${hashedClass}:before`,
      styles: {
        transform,
      },
    });
    appliedClasses.set(hashedClass, true);
  });
}

export function isListRTL({ list }: { list: HTMLElement }): boolean {
  return getListItems({ list }).every(({ innerText }) => isRTLText(innerText));
}

export function rtlListLayout({ list }: { list: HTMLElement }): void {
  const { restore } = tempDisableRTLGlobal();

  if (computeStyle({ element: list }).get('direction') !== 'rtl') {
    swapListIndentation({
      list,
    });
    swapListItemsIndentation({
      list,
    });
    swapListItemsIndentation({
      list,
      pseudoElt: 'before',
    });
    swapListItemsMarkersTransform({
      list,
    });
  }

  restore();
}
