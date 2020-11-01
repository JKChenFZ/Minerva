const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        Background: "./src/background_scripts/background.js",
        GoogleClassroomContentScript: "./src/content_scripts/GoogleClassroom.js",
        MinervaMenu: "./src/popups/MinervaMenu.js",
        StudentRegistration: "./src/standalone_pages/StudentRegistration.js",
        StudyModeLocker: "./src/content_scripts/StudyModeLocker.js"
    },
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "style", to: "style" },
                { from: "images", to: "images" },
                {
                    context: "src/standalone_pages",
                    from: "*.html"
                },
                {
                    context: "src/popups",
                    from: "*.html"
                }
            ],
        }),
    ]
};
