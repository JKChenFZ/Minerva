let variables = {
    // Functionality Knob
    teacherMode: null,
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
    gameIframe: null,
    // DOM Obserser
    observer: null,
    modifiedURL: []
};

const constants = {
    DEFAULT_VIDEO_ID: "hXDiv7f73H0",
    // Post Video Question Keys
    QUESTION_TITLE: "lecture_question_title",
    QUESTION_CORRECT_ANSWER: "lecture_question_correct_answer",
    QUESTION_WRONG_ANSWER_ONE: "lecture_question_wrong_answer_one",
    QUESTION_WRONG_ANSWER_TWO: "lecture_question_wrong_answer_two",
    // Youtube Meta Keys
    YOUTUBE_VIDEO_ID: "youtube_video_id",
    YOUTUBE_VIDEO_DURATION: "youtube_video_duration",
    YOUTUBE_VIDEO_TITLE: "youtube_video_title",
    YOUTUBE_WATCH_KEYWORD: "youtube.com/watch?v="
};

export { variables as GVars, constants as CONSTANTS };
