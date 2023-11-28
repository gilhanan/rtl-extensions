import { camelCasetoKebabCase } from '@rtl-extensions/utils';
import { StylePropsCamelCase, Styles } from './shared';
import { injectCSSOnce } from './inject-css-once';

function computeStyle({
  element,
  pseudoElt,
}: {
  element: Element;
  pseudoElt?: string;
}) {
  const styles = pseudoElt
    ? getComputedStyle(element, pseudoElt)
    : element.computedStyleMap();

  function get(prop: StylePropsCamelCase): string | undefined {
    const kebabCasedProp = camelCasetoKebabCase(prop);
    return styles instanceof CSSStyleDeclaration
      ? styles.getPropertyValue(kebabCasedProp)
      : styles.get(kebabCasedProp)?.toString();
  }

  return {
    get,
  };
}

export function getCSSText(styles: Styles): string {
  const rules = document.createElement('span').style;

  Object.entries(styles).forEach(([key, value]) => {
    rules[key as StylePropsCamelCase] = value as string;
  });

  return rules.cssText;
}

export function getConsistStyles<T extends StylePropsCamelCase[]>({
  elements,
  styleProperties,
  pseudoElt,
}: {
  elements: Element[];
  styleProperties: T;
  pseudoElt?: string;
}): Partial<{ [K in T[number]]: string }> | null {
  const consistStyles: Partial<{ [K in T[number]]: string }> = {};

  for (const element of elements) {
    const computedStyle = computeStyle({ element, pseudoElt });

    for (const prop of styleProperties) {
      const key = prop as T[number];
      const value = computedStyle.get(key);

      if (consistStyles[key] === undefined) {
        consistStyles[key] = value;
      }

      if (consistStyles[key] !== value) {
        return null;
      }
    }
  }

  if (
    styleProperties.every(
      (prop) => consistStyles[prop as T[number]] === undefined
    )
  ) {
    return null;
  }

  return consistStyles;
}

export function injectCSS({
  rule,
  styles,
}: {
  rule: string;
  styles: Styles | string;
}): void {
  const style = document.createElement('style');

  const cssText = typeof styles === 'string' ? styles : getCSSText(styles);

  style.innerHTML = `${rule} { ${cssText} }`;

  document.head.appendChild(style);
}

export function swapStyleValues({
  element,
  styleProps,
  rule,
}: {
  element: Element;
  styleProps: [StylePropsCamelCase, StylePropsCamelCase][];
  rule: (className: string) => string;
}): void {
  const computedStyles = computeStyle({ element });

  const styles: Styles = Object.fromEntries(
    styleProps
      .map(([prop1, prop2]) => ({
        prop1,
        prop2,
        value1: computedStyles.get(prop1) || '0px',
        value2: computedStyles.get(prop2) || '0px',
      }))
      .filter(({ value1, value2 }) => value1 !== value2)
      .flatMap(({ prop1, prop2, value1, value2 }) => [
        [prop1, value2],
        [prop2, value1],
      ])
  );

  injectCSSOnce({
    element,
    rule,
    styles,
  });
}
