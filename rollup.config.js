import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const outputs = [{ file: pkg.main, format: 'umd' }]

export default {
	input: 'src.js',
	output: outputs.map((type) => ({
		...type,
		globals: {
			lodash: 'lodash'
		},
		name: 'snabbdomReactComponents',
		exports: 'named',
	})),
	plugins: [
		resolve(),
		commonjs(),
		babel({
			runtimeHelpers: true,
			exclude: 'node_modules/**',
			presets: [['@babel/preset-env', {modules: false}]],
			plugins: ['@babel/plugin-transform-runtime'],
		}),
		// uglify()
	]
}