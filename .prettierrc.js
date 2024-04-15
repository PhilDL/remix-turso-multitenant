/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig*/
/** @typedef  {import("prettier").Config} PrettierConfig*/
/** @typedef  {{ tailwindConfig: string }} TailwindConfig*/

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  printWidth: 80,
  tabWidth: 2,
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(remix/(.*)$)|^(remix$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^~/styles/(.*)$',
    '^~/utils/(.*)$',
    '^~/ui/(.*)$',
    '^~/storage/(.*)$',
    '^~/models/(.*)$',
    '^~/services/(.*)$',
    '^@shuken/(.*)$',
    '^~/(.*)$',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
}

export default config
