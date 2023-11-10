const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        link: 'var(--color-link)',
        'toggle-bar-checked': 'var(--color-toggle-bar-checked)',
        'toggle-bar-unchecked': 'var(--color-toggle-bar-unchecked)',
        'toggle-button-checked': 'var(--color-toggle-button-checked)',
        'toggle-button-unchecked': 'var(--color-toggle-button-unchecked)',
      },
    },
  },
  plugins: [],
};
