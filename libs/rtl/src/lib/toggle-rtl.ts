import { toggleClass } from '@rtl-extensions/dom';

export const AUTO_DIR_ENABLED_CLASS = 'auto-dir-enabled';
export const AUTO_DIR_RTL_CLASS = 'auto-dir-rtl';

const { documentElement } = document;

export function toggleRTLGlobal({ enabled }: { enabled: boolean }): void {
  toggleClass({
    element: documentElement,
    className: AUTO_DIR_ENABLED_CLASS,
    enabled,
  });
}

export function enableRTLGlobal(): void {
  toggleRTLGlobal({ enabled: true });
}

export function tempDisableRTLGlobal(): {
  restore: () => void;
} {
  const enabled = documentElement.classList.contains(AUTO_DIR_ENABLED_CLASS);

  toggleRTLGlobal({ enabled: false });

  return {
    restore: () => toggleRTLGlobal({ enabled }),
  };
}

export function isRTLGlobalEnabled(): boolean {
  return documentElement.classList.contains(AUTO_DIR_RTL_CLASS);
}

export function toggleRTLElement({
  element,
  enabled,
}: {
  element: HTMLElement;
  enabled: boolean;
}): void {
  toggleClass({
    element,
    className: AUTO_DIR_RTL_CLASS,
    enabled,
  });
}
