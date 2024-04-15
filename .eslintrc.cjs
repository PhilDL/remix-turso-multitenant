module.exports = {
  extends: [
    '@remix-run/eslint-config/node',
    '@remix-run/eslint-config',
    'prettier',
    // "plugin:tailwindcss/recommended",
  ],
  plugins: [],
  rules: {
    // "tailwindcss/no-custom-classname": "off",
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-useless-constructor': 0,
  },
  settings: {
    jest: {
      version: 28,
    },
  },
}
