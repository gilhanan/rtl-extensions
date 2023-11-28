export type StylePropsKebabCase =
  | 'padding-left'
  | 'padding-right'
  | 'margin-left'
  | 'margin-right'
  | 'transform';

export type StylePropsCamelCase = Extract<
  'paddingLeft' | 'paddingRight' | 'marginLeft' | 'marginRight' | 'transform',
  keyof CSSStyleDeclaration
>;

export const styleKebabToCamel: Record<
  StylePropsKebabCase,
  StylePropsCamelCase
> = {
  'padding-left': 'paddingLeft',
  'padding-right': 'paddingRight',
  'margin-left': 'marginLeft',
  'margin-right': 'marginRight',
  transform: 'transform',
};

export const styleCamelToKebab: Record<
  StylePropsCamelCase,
  StylePropsKebabCase
> = {
  paddingLeft: 'padding-left',
  paddingRight: 'padding-right',
  marginLeft: 'margin-left',
  marginRight: 'margin-right',
  transform: 'transform',
};

export type Styles = Partial<Record<StylePropsCamelCase, string>>;
