import {
  injectCSSOnce,
  getCSSText,
  getConsistStyles,
  injectCSS,
  listItemsTags,
  getListItems,
} from '@rtl-extensions/dom';
import { generateHash } from '@rtl-extensions/utils';
import { isRTLText } from './is-rtl-text';

const RTL_LIST_CLASS = 'rtl-list';

interface Indentation {
  paddingLeft: string;
  paddingRight: string;
  marginLeft: string;
  marginRight: string;
}

function swapListPadding({
  list,
  rootClass,
}: {
  list: Element;
  rootClass: string;
}): void {
  const { paddingLeft, paddingRight, marginLeft, marginRight } =
    getComputedStyle(list);

  if (paddingLeft === paddingRight && marginLeft === marginRight) {
    return;
  }

  const styles: Indentation = {
    paddingLeft: paddingRight || '0px',
    paddingRight: paddingLeft || '0px',
    marginLeft: marginRight || '0px',
    marginRight: marginLeft || '0px',
  };

  injectCSSOnce({
    element: list,
    rule: (hashedClass) => `.${rootClass} .${RTL_LIST_CLASS}.${hashedClass}`,
    styles,
  });
}

function swapListPaddingItems({
  list,
  rootClass,
  pseudoElt,
}: {
  list: Element;
  rootClass: string;
  pseudoElt?: 'before';
}): void {
  const listItemsIndentation = getConsistStyles({
    elements: getListItems({ list }),
    styleProperties: [
      'paddingLeft',
      'paddingRight',
      'marginLeft',
      'marginRight',
    ],
    pseudoElt,
  });

  if (!listItemsIndentation) {
    return;
  }

  const { paddingLeft, paddingRight, marginLeft, marginRight } =
    listItemsIndentation;

  const styles: Indentation = {
    paddingLeft: paddingRight || '0px',
    paddingRight: paddingLeft || '0px',
    marginLeft: marginRight || '0px',
    marginRight: marginLeft || '0px',
  };

  injectCSSOnce({
    element: list,
    rule: (hashedClass) =>
      listItemsTags
        .map(
          (tag) =>
            `.${rootClass} .${RTL_LIST_CLASS}.${hashedClass} > ${tag}${
              pseudoElt ? `:${pseudoElt}` : ''
            }`
        )
        .join(','),
    styles,
  });
}

const transformsToClasses = new Map<string, string>();

function fillTransformsToClasses({ elements }: { elements: Element[] }): void {
  elements.forEach((element) => {
    const { transform } = getComputedStyle(element, 'before');

    if (!transform) {
      return;
    }

    const matrix = new DOMMatrix(transform);

    if (!matrix.e) {
      return;
    }

    matrix.e = -matrix.e;

    const transformMatrix = matrix.toString();

    const existingClass = transformsToClasses.get(transformMatrix);

    if (existingClass) {
      element.classList.add(existingClass);

      return;
    }

    const hashedClass = generateHash(5);

    transformsToClasses.set(transformMatrix, hashedClass);

    element.classList.add(hashedClass);
  });
}

const appliedClasses = new Map<string, true>();

function swapListItemsMarkersTransform({
  list,
  rootClass,
}: {
  list: Element;
  rootClass: string;
}) {
  fillTransformsToClasses({
    elements: getListItems({ list }),
  });

  transformsToClasses.forEach((hashedClass, transform) => {
    if (appliedClasses.get(hashedClass)) {
      return;
    }
    injectCSS({
      rule: `.${rootClass} .${RTL_LIST_CLASS} .${hashedClass}:before`,
      cssText: getCSSText({
        transform,
      }),
    });
    appliedClasses.set(hashedClass, true);
  });
}

function clearRTLListLayout({ list }: { list: Element }) {
  list.classList.remove(RTL_LIST_CLASS);
}

function applyRTLListLayout({ list }: { list: Element }) {
  list.classList.add(RTL_LIST_CLASS);
}

export function isListRTL({ list }: { list: Element }): boolean {
  return getListItems({ list }).every(({ textContent }) =>
    isRTLText(textContent)
  );
}

export function rtlListLayout({
  list,
  rootClass,
}: {
  list: Element;
  rootClass: string;
}): void {
  clearRTLListLayout({ list });
  swapListPadding({
    list,
    rootClass,
  });
  swapListPaddingItems({
    list,
    rootClass,
  });
  swapListPaddingItems({
    list,
    rootClass,
    pseudoElt: 'before',
  });
  swapListItemsMarkersTransform({
    list,
    rootClass,
  });
  applyRTLListLayout({ list });
}
