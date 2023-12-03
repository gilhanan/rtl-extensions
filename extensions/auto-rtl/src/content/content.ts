import './content.scss';
import {
  computeStyle,
  getPresentedElements,
  getTextNodes,
  isHTMLElement,
  observeChanges,
} from '@rtl-extensions/dom';
import {
  enableRTLElement,
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

const elementsToRTLClasses = new WeakMap<HTMLElement, string[]>();

async function fixLayout(elements: HTMLElement[]) {
  if (!elements.length) {
    return;
  }

  const rtlElements = elements.filter(
    (element) => computeStyle({ element }).get('direction') === 'rtl'
  );

  const { restore } = await tempDisableRTLGlobal();

  rtlElements.forEach((element) => {
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
    limitInMs: 100,
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
              .map((element) => getPresentedElements({ element }))
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
    limitInMs: 100,
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

if (shouldRTLBeEnabled()) {
  await initRTLGlobalEnabled();
  enableRTLElement(document.documentElement);
  observeDOMChanges();
  observeClassNamesChanges();
}

//   initRTLGlobalEnabled();
//   observeDOMChanges();
//   observeTextContentsChanges();
