import { generateHash } from '@rtl-extensions/utils';
import { Styles } from './shared';
import { getCSSText, injectCSS } from './style';

const cssToClass = new Map<string, string>();

export function injectCSSOnce({
  element,
  rule,
  styles,
}: {
  element: Element;
  rule: (className: string) => string;
  styles: Styles;
}): void {
  if (!Object.keys(styles).length) {
    return;
  }

  const cssText = getCSSText(styles);

  const css = `${rule('')} { ${cssText} }`;

  const existingClass = cssToClass.get(css);

  if (existingClass) {
    element.classList.add(existingClass);

    return;
  }

  const hashedClass = generateHash();

  element.classList.add(hashedClass);

  injectCSS({
    rule: rule(hashedClass),
    styles: cssText,
  });

  cssToClass.set(css, hashedClass);
}
