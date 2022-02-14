const path = require("path");

const {merge} = require('webpack-merge');

const common = require("./webpack.common.js");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const EslintWebpackPlugin = require("eslint-webpack-plugin");

module.exports = merge(common, {

    mode: "production",

    bail: true,

    output: {
        path: path.resolve(__dirname, 'dist/MyPluginReact'),
    },

    plugins: [

        new EslintWebpackPlugin({

            files: "./src/**/*.{ts,tsx}",
            threads: true,

        }),

        new ForkTsCheckerWebpackPlugin({

            async: false,

        }),

    ],

});

console.log("");
console.log("[WP] mode        : ", "production");
console.log("");
console.log("[WP] output.path : ", module.exports.output.path);
console.log("");