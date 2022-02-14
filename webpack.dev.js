const {merge} = require("webpack-merge");

const common = require("./webpack.common.js");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const EslintWebpackPlugin = require("eslint-webpack-plugin");

module.exports = merge(common, {

    mode: "development",

    devtool: "source-map",

    devServer: {

        port: 4001,
        open: true,

        client: {
            overlay: false,
        },

    },

    plugins: [

        new EslintWebpackPlugin({

            files: "./src/**/*.{ts,tsx}",
            threads: true,

        }),

        new ForkTsCheckerWebpackPlugin({

            async: true,

        }),

    ],

});

console.log("");
console.log("[WP] mode : ", "development");
console.log("");
