import { toggleClass } from '@rtl-extensions/dom';
import { Direction } from '@rtl-extensions/shared';

const AUTO_DIR_RTL_CLASS = 'auto-dir-rtl';
const AUTO_DIR_LTR_CLASS = 'auto-dir-ltr';

const { documentElement } = document;

export function clearGlobalDirection(): void {
  documentElement.classList.remove(AUTO_DIR_RTL_CLASS);
  documentElement.classList.remove(AUTO_DIR_LTR_CLASS);
}

export function getGlobalDirection(): Direction {
  if (documentElement.classList.contains(AUTO_DIR_RTL_CLASS)) {
    return 'rtl';
  }

  if (documentElement.classList.contains(AUTO_DIR_LTR_CLASS)) {
    return 'ltr';
  }

  return null;
}

export function setGlobalDirection(direction: Direction): void {
  if (direction === 'rtl') {
    documentElement.classList.remove(AUTO_DIR_LTR_CLASS);
    documentElement.classList.add(AUTO_DIR_RTL_CLASS);
  }

  if (direction === 'ltr') {
    documentElement.classList.remove(AUTO_DIR_RTL_CLASS);
    documentElement.classList.add(AUTO_DIR_LTR_CLASS);
  }
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

export function toggleLTRElement({
  element,
  enabled,
}: {
  element: HTMLElement;
  enabled: boolean;
}): void {
  toggleClass({
    element,
    className: AUTO_DIR_LTR_CLASS,
    enabled,
  });
}
