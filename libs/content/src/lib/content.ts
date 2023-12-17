import { throttleItems } from '@rtl-extensions/utils';
import {
  addEventListenerOnce,
  getParentList,
  getPresentedNestedChildren,
  isHTMLElement,
  isHTMLListElement,
  isInputElement,
  observeChanges,
  observeChangesOnce,
} from '@rtl-extensions/dom';
import {
  getFunctionalityAbilityValue,
  isFunctionalityAbilityMessage,
  isRTLText,
  toggleFunctionality,
  toggleRTLElement,
  rtlListLayout,
  isListRTL,
} from '@rtl-extensions/rtl';

async function initRTLGlobalEnabled(): Promise<void> {
  const enabled = await getFunctionalityAbilityValue();
  toggleFunctionality({ enabled });

  chrome.runtime.onMessage.addListener((message) => {
    if (isFunctionalityAbilityMessage(message)) {
      const { enabled } = message;
      toggleFunctionality({ enabled });
    }
  });
}

function isRTLApplicable(element: HTMLElement): boolean {
  if (isHTMLListElement(element) && isListRTL({ list: element })) {
    return true;
  }

  return Array.from(element.childNodes).some(
    ({ nodeType, textContent }) =>
      nodeType === Node.TEXT_NODE && isRTLText(textContent)
  );
}

function toggleRTLElementWrapper(element: HTMLElement): void {
  const enabled = isRTLApplicable(element);

  toggleRTLElement({ element, enabled });

  if (enabled && isHTMLListElement(element)) {
    rtlListLayout({ list: element });
  }
}

function observeInputsElements({ element }: { element: HTMLElement }) {
  getPresentedNestedChildren(element)
    .concat(element)
    .filter(isInputElement)
    .forEach((element) => {
      const callback = () =>
        toggleRTLElement({ element, enabled: isRTLText(element.textContent) });

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
  function callback(element: HTMLElement) {
    getPresentedNestedChildren(element)
      .concat(element)
      .forEach(toggleRTLElementWrapper);
    observeInputsElements({ element });
  }

  callback(document.body);

  const throttleProcessItems = throttleItems<HTMLElement>({
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
  const throttleProcessItems = throttleItems<HTMLElement>({
    callback: (items) => items.forEach(toggleRTLElementWrapper),
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

      throttleProcessItems(
        [...items, ...items.map(getParentList)].filter(isHTMLElement)
      );
    },
  });
}

export function main() {
  initRTLGlobalEnabled();
  observeDOMChanges();
  observeTextContentsChanges();
}
