import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

function createConfig({ format, file }) {
    return {
        input: 'src/index.ts',
        output: {
            format,
            file,
            sourcemap: true,
        },
        plugins: [
            typescript(),
            nodeResolve(),
            getBabelOutputPlugin({
                presets: [["@babel/preset-env", {
                    targets: { node: 18 }
                }]]
            }),
        ],
        external: (id) => {
            const external = ["@babel/helper-module-imports"];
            return external.includes(id);
        }
    };
}

export default [
    createConfig({ format: 'es', file: 'dist/esm/index.js' }),
    createConfig({ format: 'cjs', file: 'dist/cjs/index.js' })
]
