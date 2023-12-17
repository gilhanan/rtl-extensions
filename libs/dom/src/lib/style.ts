import { camelCasetoKebabCase } from '@rtl-extensions/utils';
import { StylePropsCamelCase, Styles } from './shared';

export interface ComputedStyle {
  get(prop: StylePropsCamelCase): string | undefined;
}

export function computeStyle({
  element,
  pseudoElt,
}: {
  element: Element;
  pseudoElt?: string;
}): ComputedStyle {
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
  return Object.entries(styles)
    .map(([key, value]) => `${camelCasetoKebabCase(key)}: ${value} !important;`)
    .join(' ');
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
