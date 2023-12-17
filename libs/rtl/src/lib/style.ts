import {
  ComputedStyle,
  StylePropsCamelCase,
  Styles,
  injectCSS,
  injectCSSOnce,
} from '@rtl-extensions/dom';
import {
  AUTO_DIR_ENABLED_CLASS,
  AUTO_DIR_LTR_CLASS,
  AUTO_DIR_RTL_CLASS,
} from './toggle';

const baseRuleRTL = `.${AUTO_DIR_ENABLED_CLASS}.${AUTO_DIR_RTL_CLASS}`;
const baseRuleLTR = `.${AUTO_DIR_ENABLED_CLASS}.${AUTO_DIR_LTR_CLASS}`;

function wrapRule(rule: string): string {
  return `${baseRuleLTR} ${rule}, ${baseRuleRTL} ${rule}`;
}

export const injectCSSOnceWrapper: typeof injectCSSOnce = (params) =>
  injectCSSOnce({
    ...params,
    rule: (...args) => wrapRule(params.rule(...args)),
  });

export const injectCSSWrapper: typeof injectCSS = (params) =>
  injectCSS({
    ...params,
    rule: wrapRule(params.rule),
  });

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
