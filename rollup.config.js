import { createRequire } from 'node:module'
import { defineConfig } from 'rollup'
import ts from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const dependencies = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]

const external = id => dependencies.some(dep => id === dep || id.startsWith(`${dep}/`))

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
      resolve(),
      json(),
      ts({
        tsconfig: './tsconfig.json',
        include: ['src/**/*.ts'],
        filterRoot: process.cwd(),
        compilerOptions: {
          rootDir: 'src',
          outDir: 'dist',
          declaration: false,
          declarationMap: false,
          emitDeclarationOnly: false
        }
      })
    ],
    treeshake: {
      moduleSideEffects: false
    }
  }
])
