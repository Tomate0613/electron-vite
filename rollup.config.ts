import { createRequire } from 'node:module'
import { defineConfig } from 'rollup'
import ts from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import rm from 'rollup-plugin-rm'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]

export default defineConfig([
  {
    input: ['src/index.ts', 'src/cli.ts'],
    output: [
      {
        dir: 'dist',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/lib-[hash].js',
        format: 'es'
      }
    ],
    external,
    plugins: [
      rm('dist', 'buildStart'),
      json(),
      resolve(),
      ts({
        tsconfig: './tsconfig.json',
        include: ['src/**/*.ts'],
        filterRoot: process.cwd(),
        compilerOptions: {
          rootDir: 'src',
          outDir: 'dist',
          declaration: true,
          declarationDir: 'dist/types'
        }
      })
    ],
    treeshake: {
      moduleSideEffects: false
    }
  },
  {
    input: 'dist/types/index.d.ts',
    external: ['vite'],
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts(), rm('dist/types', 'buildEnd')]
  }
])
