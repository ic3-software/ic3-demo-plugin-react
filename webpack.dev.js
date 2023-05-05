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

        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }

    },

    plugins: [

        new EslintWebpackPlugin({

            files: "./src/**/*.{ts,tsx}",
            cache: true,
            cacheStrategy: "content",

        }),

        new ForkTsCheckerWebpackPlugin({

            async: true,

        }),

    ],

});

console.log("");
console.log("[WP] mode : ", "development");
console.log("");
