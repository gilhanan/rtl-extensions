const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

module.exports = composePlugins(withNx(), withReact(), (config) => {
  if (config.mode === 'development') {
    config.devtool = 'inline-source-map';
  }
  return config;
});
