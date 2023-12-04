export type StylePropsKebabCase =
  | 'text-align'
  | 'z-index'
  | 'content'
  | 'background-image'
  | 'background'
  | 'position'
  | 'direction'
  | 'top'
  | 'bottom'
  | 'right'
  | 'left'
  | 'float'
  | 'padding-left'
  | 'padding-right'
  | 'margin-left'
  | 'margin-right'
  | 'border-left'
  | 'border-right'
  | 'border-top-right-radius'
  | 'border-top-left-radius'
  | 'border-bottom-right-radius'
  | 'border-bottom-left-radius'
  | 'transform';

export type StylePropsCamelCase = Extract<
  | 'textAlign'
  | 'zIndex'
  | 'content'
  | 'backgroundImage'
  | 'background'
  | 'position'
  | 'direction'
  | 'top'
  | 'bottom'
  | 'right'
  | 'left'
  | 'float'
  | 'paddingLeft'
  | 'paddingRight'
  | 'marginLeft'
  | 'marginRight'
  | 'borderLeft'
  | 'borderRight'
  | 'borderTopRightRadius'
  | 'borderTopLeftRadius'
  | 'borderBottomRightRadius'
  | 'borderBottomLeftRadius'
  | 'transform',
  keyof CSSStyleDeclaration
>;

export const styleKebabToCamel: Record<
  StylePropsKebabCase,
  StylePropsCamelCase
> = {
  'text-align': 'textAlign',
  'z-index': 'zIndex',
  content: 'content',
  'background-image': 'backgroundImage',
  background: 'background',
  position: 'position',
  direction: 'direction',
  top: 'top',
  bottom: 'bottom',
  right: 'right',
  left: 'left',
  float: 'float',
  'padding-left': 'paddingLeft',
  'padding-right': 'paddingRight',
  'margin-left': 'marginLeft',
  'margin-right': 'marginRight',
  'border-left': 'borderLeft',
  'border-right': 'borderRight',
  'border-top-right-radius': 'borderTopRightRadius',
  'border-top-left-radius': 'borderTopLeftRadius',
  'border-bottom-right-radius': 'borderBottomRightRadius',
  'border-bottom-left-radius': 'borderBottomLeftRadius',
  transform: 'transform',
};

export const styleCamelToKebab: Record<
  StylePropsCamelCase,
  StylePropsKebabCase
> = {
  textAlign: 'text-align',
  zIndex: 'z-index',
  content: 'content',
  backgroundImage: 'background-image',
  background: 'background',
  position: 'position',
  direction: 'direction',
  top: 'top',
  bottom: 'bottom',
  right: 'right',
  left: 'left',
  float: 'float',
  paddingLeft: 'padding-left',
  paddingRight: 'padding-right',
  marginLeft: 'margin-left',
  marginRight: 'margin-right',
  borderLeft: 'border-left',
  borderRight: 'border-right',
  borderTopRightRadius: 'border-top-right-radius',
  borderTopLeftRadius: 'border-top-left-radius',
  borderBottomRightRadius: 'border-bottom-right-radius',
  borderBottomLeftRadius: 'border-bottom-left-radius',
  transform: 'transform',
};

export type Styles = Partial<Record<StylePropsCamelCase, string>>;
