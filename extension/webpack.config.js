const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
    entry: {
        background: "./src/background_scripts/background.js"
    },
    output: {
        filename: "[entry].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "style", to: "style" },
                { from: "images", to: "images"}
            ],
        }),
    ]
};
