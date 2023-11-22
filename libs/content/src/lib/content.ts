import { throttle, throttleItems } from '@rtl-extensions/utils';
import {
  addEventListenerOnce,
  getParentList,
  isHTMLElement,
  isHTMLListElement,
  isInputElement,
  observeChanges,
  observeChangesOnce,
  processElementsOnce,
  toggleClass,
} from '@rtl-extensions/dom';
import {
  getRTLEnabledValue,
  isToggleRTLGlobalMessage,
  isRTLText,
  isListRTL,
  rtlListLayout,
} from '@rtl-extensions/rtl';

const RTL_CLASS = 'rtl';
const RTL_ENABLED_CLASS = 'rtl-enabled';

function toggleRTLGlobal({ enabled }: { enabled: boolean }): void {
  toggleClass({
    element: document.body,
    className: RTL_ENABLED_CLASS,
    enabled,
  });
}

function isRTLApplicable(element: Element): boolean {
  if (isHTMLListElement(element) && isListRTL({ list: element })) {
    return true;
  }

  return Array.from(element.childNodes).some((childNode) => {
    return (
      childNode.nodeType === Node.TEXT_NODE && isRTLText(childNode.textContent)
    );
  });
}

function enableRTLElement(element: Element): void {
  applyRTLElement({ element, enabled: true });
}

function applyRTLElement({
  element,
  enabled,
}: {
  element: Element;
  enabled: boolean;
}): void {
  toggleClass({
    element,
    className: RTL_CLASS,
    enabled,
  });

  if (isHTMLListElement(element) && enabled) {
    rtlListLayout({ list: element, rootClass: RTL_ENABLED_CLASS });
  }
}

function queryAndAplyRTL({ element }: { element: Element }): void {
  Array.from(element.querySelectorAll('*'))
    .concat(element)
    .filter(isRTLApplicable)
    .forEach(enableRTLElement);
}

async function initRTLEnabled(): Promise<void> {
  const enabled = await getRTLEnabledValue();
  toggleRTLGlobal({ enabled });
}

chrome.runtime.onMessage.addListener((message) => {
  if (isToggleRTLGlobalMessage(message)) {
    const { enabled } = message;
    toggleRTLGlobal({ enabled });
  }
});

function observeInputsElements({ element }: { element: Element }) {
  Array.from(element.querySelectorAll('*'))
    .concat(element)
    .filter(isInputElement)
    .forEach((element) => {
      observeChangesOnce({
        target: element,
        options: {
          subtree: true,
          characterData: true,
        },
        callback: () =>
          applyRTLElement({ element, enabled: isRTLText(element.textContent) }),
      });
      addEventListenerOnce({
        element,
        type: 'input',
        callback: () =>
          applyRTLElement({ element, enabled: isRTLText(element.textContent) }),
      });
    });
}

function domChangesCallback(element: Element) {
  queryAndAplyRTL({ element });
  observeInputsElements({ element });
}

function observeDOMChanges() {
  domChangesCallback(document.body);

  const throttleProcessItems = throttleItems<Element>({
    callback: (items) => items.forEach(domChangesCallback),
    limitInMs: 1000,
  });

  observeChanges({
    target: document.body,
    options: {
      subtree: true,
      childList: true,
    },
    callback: (mutations) => {
      const elements = mutations
        .map(({ addedNodes }) => Array.from(addedNodes))
        .flat()
        .filter(isHTMLElement);
      throttleProcessItems(elements);
    },
  });
}

function observeTextContentsChanges() {
  const throttleProcessItems = throttleItems<Element>({
    callback: (items) =>
      items.forEach((element) => {
        applyRTLElement({
          element,
          enabled: isRTLApplicable(element),
        });

        const list = getParentList({ element });

        if (list) {
          applyRTLElement({
            element: list,
            enabled: isListRTL({ list }),
          });
        }
      }),
    limitInMs: 1000,
  });

  observeChanges({
    target: document.body,
    options: {
      subtree: true,
      characterData: true,
    },
    callback: (mutations) => {
      const items = mutations
        .map(({ target: { parentElement } }) => parentElement)
        .filter(isHTMLElement);
      throttleProcessItems(items);
    },
  });
}

export function main() {
  initRTLEnabled();
  observeDOMChanges();
  observeTextContentsChanges();
}
