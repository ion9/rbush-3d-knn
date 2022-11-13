import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

const output = (file, plugins) => ({
    input: 'index.js',
    output: {
        name: 'rbush-3d-knn',
        format: 'umd',
        file
    },
    plugins
});

export default [
    output('rbush-3d-knn.js', [resolve()]),
    output('rbush-3d-knn.min.js', [resolve(), terser()])
];
