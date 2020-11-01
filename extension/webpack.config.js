const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
    entry: {
        Background: "./src/background_scripts/background.js",
        StudentRegistration: "./src/standalone_pages/StudentRegistration.js"
    },
    output: {
        filename: "scripts/[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "style", to: "style" },
                { from: "images", to: "images" },
                {
                    context: "src/standalone_pages",
                    from: "*.html",
                    to: "html"
                }
            ],
        }),
    ]
};
