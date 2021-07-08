const path = require("path");

const {merge} = require('webpack-merge');

const common = require("./webpack.common.js");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = merge(common, {

    mode: "production",

    bail: true,

    output: {
        path: path.resolve(__dirname, 'dist/MyPluginReact'),
    },

    plugins: [

        new ForkTsCheckerWebpackPlugin({

            async: false,

            eslint: {
                files: "./src/**/*.{ts,tsx}"
            }

        }),

    ],

});

console.log("");
console.log("[WP] mode        : ", "production");
console.log("");
console.log("[WP] output.path : ", module.exports.output.path);
console.log("");