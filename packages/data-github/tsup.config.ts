import { defineConfig } from 'tsup'

const tsupConfig = defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    external: ['cheerio'],
    splitting: false,
    minify: true,
    clean: true,
    tsconfig: 'tsconfig.prod.json',
})

export default tsupConfig
