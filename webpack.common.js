const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;

const deps = require("./package.json").dependencies;

module.exports = {

    entry: "./src/index.ts",

    output: {
        /**
         * The icCube server is processing those links to ensure cache busting w/ tenant URLs.
         */
        chunkFilename: '[name]-chunk.js?t=' + new Date().getTime() /* cache busting */,
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [],
    },

    module: {
        rules: [{
            oneOf: [
                {
                    test: /\.tsx?$/,
                    exclude: [/node_modules/],
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["@babel/react", "@babel/env"],
                            }
                        },
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: true,
                            },
                        },
                    ]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /PluginLocalization\.csv$/,
                    use: require.resolve("raw-loader"),
                },
                {
                    loader: require.resolve("file-loader"),
                    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                    options: {
                        name: "static/media/[name].[hash:8].[ext]",
                    }
                },
            ]
        }],
    },

    plugins: [

        new CleanWebpackPlugin(),

        new ModuleFederationPlugin({
            name: "MyPluginReact",
            filename: "remoteEntry.js",
            exposes: {
                "./PluginDefinition": "./src/PluginDefinition",
            },
            shared: {

                // https://github.com/mui-org/material-ui/issues/21916
                "@mui/private-theming": {singleton: true},
                "@mui/material": {singleton: true, requiredVersion: deps["@mui/material"]},
                "@mui/styles": {singleton: true},
                "@emotion/styled": {singleton: true},
                "@emotion/core": {singleton: true},
                "@emotion/react": {singleton: true, requiredVersion: deps["@emotion/react"]},

                "react": {singleton: true, requiredVersion: deps["react"]},
                "react-dom": {singleton: true, requiredVersion: deps["react-dom"]},

            },
        }),

        new HtmlWebpackPlugin({
            template: "./public/index.html",
            hash: true,
        }),

    ],


};
