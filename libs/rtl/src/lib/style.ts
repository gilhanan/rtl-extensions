import { injectCSS, injectCSSOnce } from '@rtl-extensions/dom';
import { AUTO_DIR_ENABLED_CLASS } from './toggle-rtl';

export const injectCSSOnceWrapper: typeof injectCSSOnce = (params) => {
  return injectCSSOnce({
    ...params,
    rule: (...args) => `.${AUTO_DIR_ENABLED_CLASS} ${params.rule(...args)}`,
  });
};

export const injectCSSWrapper: typeof injectCSS = (params) => {
  return injectCSS({
    ...params,
    rule: `.${AUTO_DIR_ENABLED_CLASS} ${params.rule}`,
  });
};
