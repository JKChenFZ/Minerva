const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        Background: "./src/background_scripts/background.js",
        FreeHoursSettings: "./src/standalone_pages/FreeHoursSettings.js",
        GoogleClassroomContentScript: "./src/content_scripts/google_classroom/GoogleClassroom.js",
        InstructorDashboard: "./src/standalone_pages/InstructorDashboard.js",
        MinervaMenu: "./src/popups/MinervaMenu.js",
        MinervaMenuRenderInfo: "./src/popups/MinervaMenuRenderInfo.js",
        Options: "./src/standalone_pages/Options.js",
        PostLectureGame: "./src/standalone_pages/PostLectureGame.js",
        StudentRegistration: "./src/standalone_pages/StudentRegistration.js",
        StudyModeLocker: "./src/content_scripts/youtube/StudyModeLocker.js"
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
                },
                {
                    context: "src/vendor_scripts",
                    from: "*.js",
                    to: "js"
                }
            ],
        })
    ],
    module: {
        rules: [
            {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
            }
        ]
    }
};
