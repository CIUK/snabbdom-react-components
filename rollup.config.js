import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const outputs = [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'esm' }]

export default {
	input: 'src.js',
	external: ['lodash'],
	output: outputs.map((type) => ({
		...type,
		exports: 'named',
	})),
	plugins: [
		resolve(),
		commonjs(),
		babel({
			runtimeHelpers: true,
			exclude: 'node_modules/**',
			presets: ['@babel/preset-env'],
			plugins: ['@babel/plugin-transform-runtime'],
		})
	]
}