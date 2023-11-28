import {
  injectCSSOnce,
  getConsistStyles,
  injectCSS,
  listItemsTags,
  getListItems,
  swapStyleValues,
  Styles,
} from '@rtl-extensions/dom';
import { generateHash } from '@rtl-extensions/utils';
import { isRTLText } from './is-rtl-text';
import { RTL_ENABLED_CLASS, tempDisableRTLGlobal } from './toggle-rtl';

const transformsToClasses = new Map<string, string>();
const appliedClasses = new Map<string, true>();

function swapListIndentation({ list }: { list: Element }): void {
  swapStyleValues({
    element: list,
    styleProps: [
      ['paddingLeft', 'paddingRight'],
      ['marginLeft', 'marginRight'],
    ],
    rule: (hashedClass) => `.${RTL_ENABLED_CLASS} .${hashedClass}`,
  });
}

function swapListItemsIndentation({
  list,
  pseudoElt,
}: {
  list: Element;
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

  injectCSSOnce({
    element: list,
    rule: (hashedClass) =>
      listItemsTags
        .map(
          (tag) =>
            `.${RTL_ENABLED_CLASS} .${hashedClass} > ${tag}${
              pseudoElt ? `:${pseudoElt}` : ''
            }`
        )
        .join(', '),
    styles,
  });
}

function fillTransformsToClasses({ elements }: { elements: Element[] }): void {
  elements
    .map((element) => {
      const { transform } = getComputedStyle(element, 'before');

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

function swapListItemsMarkersTransform({ list }: { list: Element }) {
  fillTransformsToClasses({
    elements: getListItems({ list }),
  });

  transformsToClasses.forEach((hashedClass, transform) => {
    if (appliedClasses.get(hashedClass)) {
      return;
    }
    injectCSS({
      rule: `.${RTL_ENABLED_CLASS} .${hashedClass}:before`,
      styles: {
        transform,
      },
    });
    appliedClasses.set(hashedClass, true);
  });
}

export function isListRTL({ list }: { list: Element }): boolean {
  return getListItems({ list }).every(({ textContent }) =>
    isRTLText(textContent)
  );
}

export async function rtlListLayout({
  list,
}: {
  list: Element;
}): Promise<void> {
  const { restore } = await tempDisableRTLGlobal();

  if (getComputedStyle(list).direction !== 'rtl') {
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
