import './content.scss';

import {
  getRTLEnabledValue,
  isToggleRTLGlobalMessage,
  throttle,
} from '@rtl-extensions/utils';
import {
  addEventListenerOnce,
  observeChanges,
  observeChangesOnce,
} from '@rtl-extensions/dom';
import {
  toggleRTLGlobal,
  applyRTLToElements,
  applyRTLToInput,
} from './rtl-utils';

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

void initRTLEnabled();

observeChanges({
  target: document.body,
  options: {
    childList: true,
    subtree: true,
  },
  callback: throttle({
    callback: applyRTLToElements,
    limitInMs: 1000,
  }),
});

setInterval(() => {
  Array.from(
    document.querySelectorAll('input,textarea,[contenteditable="true"]')
  ).forEach((element) => {
    observeChangesOnce({
      target: element,
      options: {
        subtree: true,
        characterData: true,
      },
      callback: () => applyRTLToInput(element),
    });
    addEventListenerOnce({
      element,
      type: 'input',
      callback: () => applyRTLToInput(element),
    });
  });
}, 2000);
