import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.ts',
  plugins: [
    resolve({
      extensions: ['.ts'],
    }),
    babel({
      extensions: ['.ts'],
      include: ['src/**/*'],
    }),
  ],
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
    },
    {
      file: 'dist/es/index.js',
      format: 'es',
    },
  ],
  external: ['react'],
};
