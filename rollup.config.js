import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const outputs = [
  { file: pkg.module, format: 'esm', exports: 'named', sourcemap: true },
];

const dev = {
  input: 'examples/app.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
  ],
};

const prod = {
  input: 'src.js',
  external: ['lodash'],
  output: outputs.map(type => ({ ...type })),
  plugins: [
    resolve(),
    commonjs(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime'],
    }),
  ],
};

export default process.argv[4] === 'dev' ? dev : prod;
