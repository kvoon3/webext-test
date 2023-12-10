import { defineConfig } from 'taze'

export default defineConfig({
  // ignore packages from bumping
  exclude: [],
  // fetch latest package info from registry without cache
  force: true,
  // write to package.json
  write: false,
  // run `npm install` or `yarn install` right after bumping
  install: false,
  // override with different bumping mode for each package
  packageMode: {
    'typescript': 'major',
    // regex starts and ends with '/'
    'vue': 'major',
    'vue-router': 'major',
    '@antfu/eslint-config': 'latest',
    'eslint': 'latest',
    'eslint-plugin-vue': 'latest',
    'vite': 'latest',
    '/unocss/': 'latest',
  },
})
