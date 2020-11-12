let variables = {
    // Embedded Youtube Player
    player: null,
    // Webcam & Canvas
    video: null,
    stream: null,
    ctx: null,
    canvas: null,
    // Facial Expression
    model: null,
    // Post lecture iframe
    gameIframe: null
};

const constants = {
    DEFAULT_VIDEO_ID: "hXDiv7f73H0",
    YOUTUBE_VIDEO_ID: "youtube_video_id",
    YOUTUBE_VIDEO_DURATION: "youtube_video_duration",
    YOUTUBE_VIDEO_TITLE: "youtube_video_title",
    YOUTUBE_WATCH_KEYWORD: "youtube.com/watch?v="
};

export { variables as GVars, constants as CONSTANTS };
