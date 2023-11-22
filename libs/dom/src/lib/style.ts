import { generateHash } from '@rtl-extensions/utils';

type SupportedProperties = 'paddingLeft' | 'paddingRight' | 'transform';

type Styles = Partial<Record<SupportedProperties, string>>;

type StringValueKeysOf<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type StyleProperty = StringValueKeysOf<CSSStyleDeclaration>;

const cssTextToClassName = new Map<string, string>();

export function getCSSText(styles: Styles): string {
  const rules = document.createElement('span').style;

  Object.entries(styles).forEach(([key, value]) => {
    rules[key as SupportedProperties] = value as string;
  });

  return rules.cssText;
}

export function getConsistStyles<T extends StyleProperty[]>({
  elements,
  styleProperties,
  pseudoElt,
}: {
  elements: Element[];
  styleProperties: T;
  pseudoElt?: string;
}): Partial<{ [K in T[number]]: string }> | null {
  const styles: Partial<{ [K in T[number]]: string }> = {};

  for (const element of elements) {
    const computedStyle = getComputedStyle(element, pseudoElt);

    for (const prop of styleProperties) {
      const key = prop as T[number];

      if (styles[key] === undefined) {
        styles[key] = computedStyle[key];
      }

      if (styles[key] !== computedStyle[key]) {
        return null;
      }
    }
  }

  if (
    styleProperties.every((prop) => styles[prop as T[number]] === undefined)
  ) {
    return null;
  }

  return styles;
}

export function injectCSS({
  rule,
  cssText,
}: {
  rule: string;
  cssText: string;
}): void {
  const style = document.createElement('style');

  style.innerHTML = `${rule} { ${cssText} }`;

  document.head.appendChild(style);
}

export function injectCSSOnce({
  element,
  rule,
  styles,
}: {
  element: Element;
  rule: (className: string) => string;
  styles: Styles;
}): void {
  const cssText = getCSSText(styles);

  const existingClass = cssTextToClassName.get(cssText);

  if (existingClass) {
    element.classList.add(existingClass);

    return;
  }

  const hashedClass = generateHash(5);

  element.classList.add(hashedClass);

  injectCSS({
    rule: rule(hashedClass),
    cssText,
  });

  cssTextToClassName.set(cssText, hashedClass);
}
