import { throttleItems } from '@rtl-extensions/utils';
import {
  addEventListenerOnce,
  getParentList,
  isHTMLElement,
  isInputElement,
  observeChanges,
  observeChangesOnce,
} from '@rtl-extensions/dom';
import {
  getRTLEnabledValue,
  isToggleRTLGlobalMessage,
  isRTLText,
  toggleRTLGlobal,
  applyRTLElement,
  isRTLApplicable,
  queryAndAplyRTL,
} from '@rtl-extensions/rtl';

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

function observeInputsElements({ element }: { element: Element }) {
  Array.from(element.querySelectorAll('*'))
    .concat(element)
    .filter(isInputElement)
    .forEach((element) => {
      const callback = () =>
        applyRTLElement({ element, enabled: isRTLText(element.textContent) });

      observeChangesOnce({
        target: element,
        options: {
          subtree: true,
          characterData: true,
        },
        callback,
      });
      addEventListenerOnce({
        element,
        type: 'input',
        callback,
      });
    });
}

function observeDOMChanges() {
  function callback(element: Element) {
    queryAndAplyRTL({ element });
    observeInputsElements({ element });
  }

  callback(document.body);

  const throttleProcessItems = throttleItems<Element>({
    callback: (items) => items.forEach(callback),
    limitInMs: 1000,
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
          .map(({ addedNodes }) => Array.from(addedNodes))
          .flat()
          .filter(isHTMLElement)
      );
    },
  });
}

function observeTextContentsChanges() {
  const throttleProcessItems = throttleItems<Element>({
    callback: (items) =>
      [...items, ...items.map(getParentList)]
        .filter(isHTMLElement)
        .forEach((element) =>
          applyRTLElement({
            element,
            enabled: isRTLApplicable(element),
          })
        ),
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
  initRTLGlobalEnabled();
  observeDOMChanges();
  observeTextContentsChanges();
}
