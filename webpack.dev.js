const {merge} = require("webpack-merge");

const common = require("./webpack.common.js");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

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

        new ForkTsCheckerWebpackPlugin({

            async: true,

            eslint: {
                files: "./src/**/*.{ts,tsx}"
            }

        }),

    ],

});

console.log("");
console.log("[WP] mode : ", "development");
console.log("");
