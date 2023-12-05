import './content.scss';
import {
  computeStyle,
  findCommonAncestor,
  getPresentedElements,
  getTextNodes,
  isHTMLElement,
  observeChanges,
} from '@rtl-extensions/dom';
import {
  enableRTLElement,
  fixTextAlign,
  flipBackground,
  getRTLEnabledValue,
  isRTLText,
  isToggleRTLGlobalMessage,
  swapBorders,
  swapFloat,
  swapIndentation,
  swapPositions,
  tempDisableRTLGlobal,
  toggleRTLGlobal,
} from '@rtl-extensions/rtl';
import { throttleItems } from '@rtl-extensions/utils';

const { documentElement } = document;

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
  if (computeStyle({ element: document.body }).get('direction') === 'rtl') {
    return false;
  }

  const textNodes = getTextNodes();

  const rtlTextNodes = textNodes.filter(({ textContent }) =>
    isRTLText(textContent)
  );

  const rtlPercentage = rtlTextNodes.length / textNodes.length;

  return rtlTextNodes.length > 25 && rtlPercentage > 0.05;
}

function fixInheritedLayout(element: HTMLElement) {
  fixTextAlign(element);
}

function fixNonInheritedLayout(element: HTMLElement): { classNames: string[] } {
  const classNames = [
    swapIndentation,
    swapBorders,
    swapPositions,
    swapFloat,
    flipBackground,
  ]
    .map((fn) => fn(element))
    .flat()
    .filter(Boolean) as string[];

  return { classNames };
}

const elementsToRTLClasses = new WeakMap<HTMLElement, string[]>();

function fixLayout(elements: HTMLElement[]) {
  if (!elements.length) {
    return;
  }

  const rtlElements = elements.filter(
    (element) => computeStyle({ element }).get('direction') === 'rtl'
  );

  fixInheritedLayout(findCommonAncestor(rtlElements));

  const { restore } = tempDisableRTLGlobal();

  rtlElements.forEach((element) => {
    const { classNames } = fixNonInheritedLayout(element);

    if (classNames.length) {
      elementsToRTLClasses.set(element, classNames);
    }
  });

  restore();
}

function observeDOMChanges() {
  fixLayout(getPresentedElements());

  const throttleProcessItems = throttleItems<HTMLElement>({
    callback: fixLayout,
    limitInMs: 50,
  });

  observeChanges({
    target: document.body,
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
              .map((element) => [element, ...getPresentedElements({ element })])
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
    target: document.body,
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

let isInitialized = false;

setInterval(async () => {
  if (isInitialized) {
    return;
  }
  if (!shouldRTLBeEnabled()) {
    return;
  }
  isInitialized = true;
  await initRTLGlobalEnabled();
  enableRTLElement(documentElement);
  fixInheritedLayout(documentElement);
  observeDOMChanges();
  observeClassNamesChanges();
}, 500);
