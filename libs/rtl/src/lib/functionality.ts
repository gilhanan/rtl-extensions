import { toggleClass } from '@rtl-extensions/dom';

export const FUNCTIONALITY_CLASS = 'auto-dir-enabled';

const { documentElement } = document;

export function toggleFunctionality({ enabled }: { enabled: boolean }): void {
  toggleClass({
    element: documentElement,
    className: FUNCTIONALITY_CLASS,
    enabled,
  });
}

export function enableFunctionality(): void {
  toggleClass({
    element: documentElement,
    className: FUNCTIONALITY_CLASS,
    enabled: true,
  });
}

export function disableFunctionality(): void {
  toggleClass({
    element: documentElement,
    className: FUNCTIONALITY_CLASS,
    enabled: false,
  });
}

export function runOnDisabledFunctionality<T>(callback: () => T): T {
  const enabled = documentElement.classList.contains(FUNCTIONALITY_CLASS);

  disableFunctionality();

  const result = callback();

  toggleFunctionality({ enabled });

  return result;
}
