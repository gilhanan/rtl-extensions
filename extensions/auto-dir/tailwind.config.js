const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const sharedTailwindConfig = require('../../libs/styles/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedTailwindConfig],
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
};
