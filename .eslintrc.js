module.exports = {

    parser: "@typescript-eslint/parser",

    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        },
        project: "./tsconfig.json"
    },

    extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],

    plugins: [
        "@typescript-eslint", "react-hooks"
    ],

    rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-unused-vars": "off",
        "react/display-name": "off",
        "react/prop-types": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    },

    settings: {
        react: {
            version: "detect"
        }
    }

};
