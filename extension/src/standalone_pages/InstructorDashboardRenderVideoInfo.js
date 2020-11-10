import Chart from "chart.js";
import Swal from "sweetalert2";

function displayFormatFunction(label) {
    let hoursIndex = label.indexOf(":");
    if (label.substring(0, hoursIndex) == "12") {
        return "0:" + label.substring(hoursIndex + 1);
    } else {
        return label;
    }
}
function displayStudents(TooltipItem) {
    let time = TooltipItem[0].label.split(" ");
    console.log(time);
    return displayFormatFunction(time[3].substr(0, 8));
}

function displayStudentQuestions(label, questionsMap) {
    let htmlQuestions = "";
    questionsMap[label].forEach((question) => {
        htmlQuestions += `<div>${question.name} asked ${question.text}<div>`;
    });

    Swal.fire({
        title: `Questions at timestamp ${label}`,
        html: 
            `<html>
                ${htmlQuestions}
            </html>`,
        confirmButtonText: "Close"
    });
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
    response.active_questions.sort((a, b) => {
        return a.timestamp - b.timestamp;
    });
    let labels = response.active_questions.flatMap((question) => {
        if (question.timestamp !== null) {
            return [question.timestamp];
        } else {
            return [];
        }
    });
    let amounts = response.active_questions.flatMap(question => {
        if (question.count !== null) {
            return [question.count];
        } else {
            return [];
        }
    });
    let questionsMap = new Map();
    labels.forEach((timestamp) => {
        questionsMap[timestamp] = response.active_questions_text.filter(question => question.timestamp === timestamp);
    });
    let chart = new Chart(activeChart, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Active Feedback",
                borderColor: color,
                pointBackgroundColor: color,
                pointBorderColor: color,
                pointHoverBackgroundColor:color,
                pointHoverBorderColor: color,
                data: amounts,
            }],
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Timestamp (s)"
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }], 
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "# of Questions"
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    /* The following function definition must be initialized here
    because we need a reference to the chart variable.
    */
    let canvas = document.getElementById(`activeFeedback_${video.videoID}`);
    canvas.onclick = function(evt) {
        var firstPoint = chart.getElementAtEvent(evt)[0];

        if (firstPoint) {
            var label = chart.data.labels[firstPoint._index];
            console.log(label, questionsMap[label]);
            displayStudentQuestions(label, questionsMap);
        }
    };
}

function renderPassiveFeedback(video, response) {
    let color= "#5959e6";

    let passiveChart = document.getElementById(`passiveFeedback_${video.videoID}`).getContext("2d");
    response.passive_question.sort((a, b) => {
        return a.timestamp - b.timestamp;
    });
    let transformedData = response.passive_question.map((question) => { 
        return { x: new Date(0, 0, 0, 0, 0, question.timestamp, 0), y: question.count };
    });
    console.log(transformedData);
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
                data: transformedData
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
                    scaleLabel: {
                        display: true,
                        labelString: "Timestamp (h:m:s)"
                    },
                    type: "time",
                    distribution: "linear",
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
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "# of Emotional Responses"
                    },
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            }
        }
    });
}

export { renderActiveFeedback, renderPassiveFeedback, renderVideoAccordian };
