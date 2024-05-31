import { defineConfig } from 'tsup'

const cfg = {
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: false,
    dts: true,
    format: ['esm', 'cjs'],
    external: ['react', 'react-dom', /^@mui/, /^@emotion/, /^next/, 'next-contentlayer/hooks'],
    tsconfig: 'tsconfig.prod.json',
}

export default defineConfig([
    {
        ...cfg,
        entry: {
            index: 'src/index.ts',
        },
        outDir: 'dist',
    },
    // special exporting for use-client components
    // https://github.com/egoist/tsup/issues/835#issuecomment-1854845303
    // https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js
    {
        ...cfg,
        entry: {
            index: 'src/_client/index.ts',
        },
        outDir: 'dist/_client',
        esbuildOptions: (options) => {
            // Append "use client" to the top of the react entry point
            options.banner = {
                js: '"use client";',
            }
        },
    },
    // {
    //     ...cfg,
    //     entry: {
    //         index: 'src/server/index.ts',
    //     },
    //     outDir: 'dist/server',
    // },
])
