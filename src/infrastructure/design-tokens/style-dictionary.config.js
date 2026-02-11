/**
 * Style Dictionary configuration
 * Transforms tokens.json → Tailwind CSS configuration
 */

export default {
  source: ['src/infrastructure/design-tokens/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/infrastructure/design-tokens/',
      files: [
        {
          destination: 'css-variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/infrastructure/design-tokens/',
      files: [
        {
          destination: 'tailwind-tokens.js',
          format: 'javascript/module-flat',
        },
      ],
    },
  },
};
