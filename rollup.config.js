import { terser } from 'rollup-plugin-terser';

export default {
  input: 'index.js',
  output: [
    { file: 'dist/cjs/custom-element-loader.js', format: 'cjs', plugins: [terser()] },
    { file: 'dist/esm/custom-element-loader.js', format: 'esm', plugins: [terser()] },
  ],
};
