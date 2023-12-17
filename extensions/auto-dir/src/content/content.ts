import './content.scss';
import {
  ComputedStyle,
  calculateScore,
  computeStyle,
  findCommonAncestor,
  getPresentedNestedChildren,
  isHTMLElement,
  isLetterNode,
  observeChanges,
} from '@rtl-extensions/dom';
import {
  fixTextAlign,
  flipBackground,
  getFunctionalityAbilityValue,
  getGlobalDirection,
  isRTLText,
  isFunctionalityAbilityMessage,
  swapBorders,
  swapFloat,
  swapIndentation,
  swapPositions,
  swapTransform,
  runOnDisabledFunctionality,
  setGlobalDirection,
  clearGlobalDirection,
  disableFunctionality,
  enableFunctionality,
} from '@rtl-extensions/rtl';
import { Direction } from '@rtl-extensions/shared';
import { throttleItems } from '@rtl-extensions/utils';

const { body } = document;

const bodyDirection = computeStyle({ element: body }).get('direction');

let isFunctionalityEnabled = await getFunctionalityAbilityValue();
chrome.runtime.onMessage.addListener((message) => {
  if (isFunctionalityAbilityMessage(message)) {
    isFunctionalityEnabled = message.enabled;
    if (!isFunctionalityEnabled) {
      disableFunctionality();
    }
  }
});

function getExpectedDirection(): Direction {
  const rtlScore = calculateScore({
    node: body,
    isRelevant: (node) => isLetterNode(node),
    isScored: ({ textContent }) => isRTLText(textContent),
  });

  if (bodyDirection === 'ltr' && rtlScore > 0.8) {
    return 'rtl';
  }

  if (bodyDirection === 'rtl' && rtlScore < 0.1) {
    return 'ltr';
  }

  return null;
}

function fixInheritedLayout({
  element,
  direction,
}: {
  element: HTMLElement;
  direction: Direction;
}) {
  fixTextAlign({ element, direction });
}

function fixNonInheritedLayout({
  element,
  computedStyle,
}: {
  element: HTMLElement;
  computedStyle: ComputedStyle;
}): { classNames: string[] } {
  const pseudoElt = 'before';
  const pseudoComputedStyle = computeStyle({ element, pseudoElt });

  const functions = [
    swapIndentation,
    swapBorders,
    swapPositions,
    swapTransform,
    swapFloat,
    flipBackground,
  ];

  const nonPseudoClasses = functions.map((fn) =>
    fn({ element, computedStyle })
  );

  const pseudoClasses = functions.map((fn) =>
    fn({ element, computedStyle: pseudoComputedStyle, pseudoElt })
  );

  const classNames = [...nonPseudoClasses, ...pseudoClasses]
    .flat()
    .filter(Boolean) as string[];

  return { classNames };
}

const elementsToRTLClasses = new WeakMap<HTMLElement, string[]>();

function fixLayout(elements: HTMLElement[]) {
  if (!elements.length) {
    return;
  }

  const direction = getGlobalDirection();

  const fixableElements = elements
    .map((element) => ({
      element,
      computedStyle: computeStyle({ element }),
    }))
    .filter(
      ({ computedStyle }) => computedStyle.get('direction') === direction
    );

  fixInheritedLayout({
    element: findCommonAncestor(fixableElements.map(({ element }) => element)),
    direction,
  });

  runOnDisabledFunctionality(() => {
    fixableElements.forEach(({ element, computedStyle }) => {
      try {
        const { classNames } = fixNonInheritedLayout({
          element,
          computedStyle,
        });

        if (classNames.length) {
          elementsToRTLClasses.set(element, classNames);
        }
      } catch (error) {
        // Telemetry
      }
    });
  });
}

function observeDOMChanges() {
  const throttleProcessItems = throttleItems<HTMLElement>({
    callback: fixLayout,
    limitInMs: 50,
  });

  observeChanges({
    target: body,
    options: {
      subtree: true,
      childList: true,
    },
    callback: (mutations) => {
      throttleProcessItems(
        mutations
          .map(({ addedNodes }) =>
            Array.from(addedNodes)
              .filter(isHTMLElement)
              .map((element) => [
                element,
                ...getPresentedNestedChildren(element),
              ])
              .flat()
          )
          .flat()
      );
    },
  });
}

function observeClassNamesChanges() {
  const throttleProcessItems = throttleItems<HTMLElement>({
    callback: fixLayout,
    limitInMs: 50,
  });

  observeChanges({
    target: body,
    options: {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class'],
    },
    callback: (mutations) => {
      throttleProcessItems(
        mutations
          .map(({ target }) => target)
          .filter(isHTMLElement)
          .filter((element) =>
            elementsToRTLClasses
              .get(element)
              ?.some((className) => !element.classList.contains(className))
          )
      );
    },
  });
}

observeDOMChanges();
observeClassNamesChanges();

setInterval(() => {
  if (!isFunctionalityEnabled) {
    return;
  }

  const expectedDirection = getExpectedDirection();
  const actualDirection = getGlobalDirection();

  if (!expectedDirection) {
    clearGlobalDirection();
  }

  if (actualDirection === expectedDirection) {
    return;
  }

  enableFunctionality();
  setGlobalDirection(expectedDirection);
  fixLayout(getPresentedNestedChildren());
}, 2000);
