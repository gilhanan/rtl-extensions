import {
  ComputedStyle,
  StylePropsCamelCase,
  Styles,
  injectCSS,
  injectCSSOnce,
} from '@rtl-extensions/dom';
import { AUTO_DIR_ENABLED_CLASS, AUTO_DIR_RTL_CLASS } from './toggle-rtl';

const baseRule = `.${AUTO_DIR_ENABLED_CLASS}.${AUTO_DIR_RTL_CLASS}`;

export const injectCSSOnceWrapper: typeof injectCSSOnce = (params) => {
  return injectCSSOnce({
    ...params,
    rule: (...args) => `${baseRule} ${params.rule(...args)}`,
  });
};

export const injectCSSWrapper: typeof injectCSS = (params) => {
  return injectCSS({
    ...params,
    rule: `${baseRule} ${params.rule}`,
  });
};

export function swapStyleValues({
  element,
  computedStyle,
  styleProps,
  rule,
}: {
  element: Element;
  computedStyle: ComputedStyle;
  styleProps: [StylePropsCamelCase, StylePropsCamelCase][];
  rule: (className: string) => string;
}): string | undefined {
  const styles: Styles = Object.fromEntries(
    styleProps
      .map(([prop1, prop2]) => ({
        prop1,
        prop2,
        value1: computedStyle.get(prop1) || '0px',
        value2: computedStyle.get(prop2) || '0px',
      }))
      .filter(({ value1, value2 }) => value1 !== value2)
      .flatMap(({ prop1, prop2, value1, value2 }) => [
        [prop1, value2],
        [prop2, value1],
      ])
  );

  return injectCSSOnceWrapper({
    element,
    rule,
    styles,
  });
}
