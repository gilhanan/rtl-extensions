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
  toggleRTLElement,
  fixTextAlign,
  flipBackground,
  getRTLEnabledValue,
  isRTLGlobalEnabled,
  isRTLText,
  isToggleRTLGlobalMessage,
  swapBorders,
  swapFloat,
  swapIndentation,
  swapPositions,
  swapTransform,
  tempDisableRTLGlobal,
  toggleRTLGlobal,
} from '@rtl-extensions/rtl';
import { throttleItems } from '@rtl-extensions/utils';

const { documentElement, body } = document;

async function initRTLGlobalEnabled(): Promise<void> {
  const enabled = await getRTLEnabledValue();
  toggleRTLGlobal({ enabled });

  chrome.runtime.onMessage.addListener((message) => {
    if (isToggleRTLGlobalMessage(message)) {
      const { enabled } = message;
      toggleRTLGlobal({ enabled });
    }
  });
}

function shouldRTLBeEnabled(): boolean {
  const rtlScore = calculateScore({
    node: body,
    isRelevant: (node) => isLetterNode(node),
    isScored: ({ textContent }) => isRTLText(textContent),
  });

  const direction = computeStyle({ element: body }).get('direction');

  if (direction === 'rtl') {
    return rtlScore > 0.8;
  }

  return rtlScore < 0.2;
}

function fixInheritedLayout(element: HTMLElement) {
  fixTextAlign(element);
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

  const rtlElements = elements
    .map((element) => ({
      element,
      computedStyle: computeStyle({ element }),
    }))
    .filter(({ computedStyle }) => computedStyle.get('direction') === 'rtl');

  fixInheritedLayout(
    findCommonAncestor(rtlElements.map(({ element }) => element))
  );

  const { restore } = tempDisableRTLGlobal();

  rtlElements.forEach(({ element, computedStyle }) => {
    try {
      const { classNames } = fixNonInheritedLayout({ element, computedStyle });

      if (classNames.length) {
        elementsToRTLClasses.set(element, classNames);
      }
    } catch (error) {
      // Telemetry
    }
  });

  restore();
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

await initRTLGlobalEnabled();

observeDOMChanges();
observeClassNamesChanges();

setInterval(() => {
  const previous = isRTLGlobalEnabled();
  const current = shouldRTLBeEnabled();

  if (previous === current) {
    return;
  }

  toggleRTLElement({ element: documentElement, enabled: current });
  fixLayout(getPresentedNestedChildren());
}, 2000);
