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

const distinctProccessedNodes = new Set<Node>();
let proccessedNodes = 0;

async function fixLayout(elements: HTMLElement[]) {
  const rtlElements = elements.filter(
    (element) => computeStyle({ element }).get('direction') === 'rtl'
  );

  const { restore } = await tempDisableRTLGlobal();

  rtlElements.forEach((element) => {
    swapIndentation(element);
    swapBorders(element);
    swapPositions(element);
    swapFloat(element);
    flipBackground(element);
    proccessedNodes++;
    distinctProccessedNodes.add(element);
  });

  console.log('proccessedNodes', proccessedNodes);
  console.log('distinctProccessedNodes', distinctProccessedNodes.size);

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

// TODO: Fix infinite loop
function observeClassNamesChanges() {
  const throttleProcessItems = throttleItems<HTMLElement>({
    callback: fixLayout,
    limitInMs: 5000,
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
        mutations.map(({ target }) => target).filter(isHTMLElement)
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
