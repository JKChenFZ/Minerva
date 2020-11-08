import Chart from "chart.js";

function displayFormatFunction(label) {
    let hoursIndex = label.indexOf(":");
    if (label.substring(0, hoursIndex) == "12") {
        return label.substring(hoursIndex + 1);
    } else {
        return label;
    }
}
function displayStudents(TooltipItem) {
    /* eslint-disable no-unused-vars */
    let label = [];
    let index = TooltipItem[0].index;
    let datasetIndex = TooltipItem[0].datasetIndex;
    for (let i = 0; i < data[datasetIndex][index].students.length; i++) {
        label.push(data[datasetIndex][index].students[i]);
    }
    return label.join(" ");
    /* eslint-enable no-unused-vars */  
}
function displayFeedback(videoObjects) {
    if (videoObjects.status == true) {
        videoObjects["video_info"].forEach(video => {
            chrome.runtime.sendMessage({
                type: "FetchVideoFeedback",
                videoID: video.videoID
                }, (response) => {
                    console.log(video.videoID, response)
                    renderPassiveFeedback(video, response);
                    renderActiveFeedback(video, response);
                });
        });
    }
}
function renderVideoAccordian(document, videoObjects) {
    let accordianDiv = document.createElement("DIV");
        accordianDiv.id = "accordion";
        videoObjects["video_info"].forEach(video => {
            let card = document.createElement("DIV");
            card.className = "card";
            let cardHeader = document.createElement("DIV");
            cardHeader.className = "card-header";
            let videoButton = document.createElement("BUTTON");
            videoButton.innerHTML = `${video.video_title}`;
            videoButton.className = "btn btn-link collapsed";
            videoButton.setAttribute("data-toggle", "collapse");
            videoButton.setAttribute("data-target", `#collapse_${video.videoID}`); 
            videoButton.setAttribute("aria-controls", "collapseOne");

            cardHeader.appendChild(videoButton);
            card.appendChild(cardHeader);

            let graphs = document.createElement("DIV");
            graphs.id = `collapse_${video.videoID}`;
            graphs.className = "collapse";
            graphs.setAttribute("aria-labelledby", "headingOne");
            graphs.setAttribute("data-parent", "#accordion");

            let activeFeedback = document.createElement("canvas");
            let passiveFeedback = document.createElement("canvas");

            activeFeedback.id = `activeFeedback_${video.videoID}`;
            passiveFeedback.id = `passiveFeedback_${video.videoID}`;

            graphs.appendChild(activeFeedback);
            graphs.appendChild(passiveFeedback);

            card.appendChild(graphs);

            accordianDiv.appendChild(card);
            console.log(`processed ${video.video_title}`);
        });
    document.getElementById("nav-videos").appendChild(accordianDiv);
}
function renderActiveFeedback(video, response) {
    let color= "#5959e6";
    let activeChart = document.getElementById(`activeFeedback_${video.videoID}`).getContext("2d");
    new Chart(activeChart, {
        type: "bar",
        data: {
            datasets: [{
                label: "Active Feedback",
                borderColor: color,
                pointBackgroundColor: color,
                pointBorderColor: color,
                pointHoverBackgroundColor:color,
                pointHoverBorderColor: color,
                data: response.active_questions
            }],
        },
        options: {
            tooltips: {
                callbacks: {
                    title: displayStudents
                }
            }
        }
    });
}
function renderPassiveFeedback(video, response) {
    let color= "#5959e6";
    let passiveChart = document.getElementById(`passiveFeedback_${video.videoID}`).getContext("2d");
    new Chart(passiveChart, {
        type: "line",
        data: {
            datasets: [{
                label: "Passive Feedback",
                borderColor: color,
                pointBackgroundColor: color,
                pointBorderColor: color,
                pointHoverBackgroundColor:color,
                pointHoverBorderColor: color,
                data: response.passive_question
            }],
        },
        options: {
            tooltips: {
                callbacks: {
                    title: displayStudents
                }
            },
            scales: {
                xAxes: [{
                    type: "time",
                    distribution: "series",
                    time: {
                        displayFormats: {
                            "millisecond": "h:m:ss",
                            "second": "h:m:ss",
                            "minute": "h:m:ss",
                            "hour": "h:m:ss"
                        },
                    },
                    ticks: {
                        callback: displayFormatFunction
                    },

                }]
            }
        }
}

export { displayFeedback, renderVideoAccordian };
