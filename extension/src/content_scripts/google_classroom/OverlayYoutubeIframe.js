const API_HOST = "localhost:3000";
const POST_REQUEST = "POST";
const YOUTUBE_VIDEO_ID = "youtube_video_id";
const YOUTUBE_VIDEO_DURATION = "youtube_video_duration";
const YOUTUBE_VIDEO_TITLE = "youtube_video_title";
const QUESTION_CONFIRMATION = "Got it. We will let your teacher know.";
const STUDENT_NAME = "student_name";

const YOUTUBE_WATCH_KEYWORD = "youtube.com/watch?v=";
var player;
function addYoutubeIframe(rawDestination) {
    let overlay = document.getElementById("studyModeLocker");

    // TODO: we might need better extraction mechanism
    let splittedUrl = rawDestination.split(YOUTUBE_WATCH_KEYWORD);
    let videoID = "hXDiv7f73H0";
    if (splittedUrl.length == 2) {
        videoID = splittedUrl[1];
    } else {
        videoID = splittedUrl[0];
    }

    // Create nodes first
    let wrapperDiv = document.createElement("div");
    let iframe = document.createElement("iframe");

    wrapperDiv.id = "videoWrapper";
    iframe.id = "videoIFrame";
    iframe.origin = "youtube.com";
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "100%");
    iframe.setAttribute("class", "youtubeIFrame");
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoID}?enablejsapi=1&controls=0`;

    wrapperDiv.appendChild(iframe);
    overlay.appendChild(wrapperDiv);

    // Add event handlers to capture various iFrame events
    // player = YouTubeAPI("videoIFrame");
    // player.on("ready", () => {
    //     console.log("player ready");
    // });
    console.log("trying to register12");
    // console.log(player);
    player = new YT.Player("videoIFrame", {
        events: {
            "onReady": (event) =>  {
                console.debug("Embedded Youtube Player is ready");

                // Save the video id and the video title to local storage
                window.localStorage.setItem(YOUTUBE_VIDEO_ID, videoID);
                window.localStorage.setItem(
                    YOUTUBE_VIDEO_DURATION,
                    event.target.getDuration());
                window.localStorage.setItem(
                    YOUTUBE_VIDEO_TITLE,
                    event.target.getVideoData().title
                );
            },
            "onStateChange": (event) => {
                console.debug("Embedded Youtube Player has a new change");
                if (event.data == YT.PlayerState.ENDED) {
                    // videoFinishedHandler();
                }
            }
        }
    });
}

export { addYoutubeIframe };
