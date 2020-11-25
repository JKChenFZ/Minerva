import Chart from "chart.js";
import Swal from "sweetalert2";

let keywordsMap = new Map();

// tooltipItem example
// datasetIndex: 0
// index: 1
// label: "5"
// value: "4"
// x: 284.2205989583333
// xLabel: 5
// y: 32
// yLabel: 4
function displayStudents(tooltipItem) {
    let time = tooltipItem[0].xLabel;
    let date = new Date(null);
    date.setSeconds(time); 
    let result = date.toISOString().substr(11, 8);

    return result;
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

function handleStudentBreakdownResponse(video, response) {
    if (Swal.isVisible()) {
        Swal.close();
    }
    let csvOutput = "data:text/csv;charset=utf-8,Student Name,Times Watched,Correct Answers\n"

    Swal.fire({
        title: `Student Responses for ${video.video_title}`,
        html: 
            `<html>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Times Watched</th>
                            <th scope="col">Correct Answers</th>
                        </tr>
                    </thead>
                    <tbody id="studentBreakdown">
                    </tbody>
                </table>
            </html>`,
        width: "800px",
        confirmButtonText: "Close",
        showCancelButton: true,
        cancelButtonText: "Download CSV"
    }).then((result) => {
        console.debug(result);
        if (result.isDismissed) {
            let encodedUri = encodeURI(csvOutput);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${video.video_title}_student_breakdown.csv`);
            document.body.appendChild(link);

            link.click();
        }
    });

    let breakdownBody = document.getElementById("studentBreakdown");
    if (response.status) {
        response.data.forEach((student) => {
            let tableRow = document.createElement("TR");
            let name = tableRow.insertCell(0);
            name.innerText = student.student_name;

            let timesWatched = tableRow.insertCell(1);
            timesWatched.innerText = student.watch_times;

            let correctAnswers = tableRow.insertCell(2);
            correctAnswers.innerText = student.question_correct_time;

            csvOutput += `${student.student_name},${student.watch_times},${student.question_correct_time}\n`
            breakdownBody.append(tableRow);
        });
    } else {
        breakdownBody.innerText = "No student responses could be found";
    }
}

function displayStudentBreakdownForVideo(video) {

    Swal.fire({
        title: "Student Responses",
        html: 
            `<html>
                <div class="spinner-border text-success" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </html>`,
        confirmButtonText: "Close"
    });
    chrome.runtime.sendMessage({
        type: "FetchStudentBreakdownVideo",
        videoID: video.videoID
    }, (response) => {
        handleStudentBreakdownResponse(video, response);
    });
}

function renderVideoStudentBreakdown(videoObjects) {
    let videoBreakdownBody = document.getElementById("video-breakdown-list");

    videoObjects["video_info"].forEach(video => {
        let videoButton = document.createElement("BUTTON");
        videoButton.type = "button";
        videoButton.className = "btn btn-dark";
        videoButton.innerHTML = `${video.video_title}`;
        videoButton.onclick = function() {
            displayStudentBreakdownForVideo(video);
        };

        let containerDiv = document.createElement("LI");
        containerDiv.className = "list-group-item";
        containerDiv.appendChild(videoButton);

        videoBreakdownBody.appendChild(containerDiv);
    });
}

function renderActiveFeedback(video, response) {
    let color = "#5959e6";
    let activeChart = document.getElementById(`activeFeedback_${video.videoID}`).getContext("2d");
    response.active_questions.sort((a, b) => {
        return a.timestamp - b.timestamp;
    });
    let filteredData = response.active_questions.filter(question => question.timestamp !== null && question.count !== null);
    let amounts = filteredData.map(question => question.count);
    let labels = filteredData.map(question => question.timestamp);
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
    let canvas = document.getElementById(`activeFeedback_${video.videoID}`);
    canvas.onclick = function(evt) {
        let firstPoint = chart.getElementAtEvent(evt)[0];

        if (firstPoint) {
            let label = chart.data.labels[firstPoint._index];
            console.debug(label, questionsMap[label]);
            displayStudentQuestions(label, questionsMap);
        }
    };
}

function displayContextKeyWords(label) {
    
    if (!keywordsMap[label]) {
        Swal.fire({
            title: `Keywords at timestamp ${label}`,
            html: 
                `<html>
                    <div class="spinner-border text-success" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </html>`,
            confirmButtonText: "Close"
        });
    } else {
        Swal.fire({
            title: `Keywords at timestamp ${label}`,
            html: 
                `<html>
                    <body>
                    <div class="container">
                      <div class="row">
                        <div class="col">
                            <div class="card text-white bg-success mb-3" style="max-width: 18rem;">
                                <h5 class="card-title">Bert found these phrases</h5>
                                <div id="berk" class="card-body"></div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card text-white bg-danger mb-3" style="max-width: 18rem;">
                                <h5 class="card-title">Rake found these phrases</h5>
                                <div id="rake" class="card-body"></div>
                            </div>
                        </div>
                      </div>
                    </div>
                    </body>
                </html>`,
            confirmButtonText: "Close"
        });
        let berkBody = document.getElementById("berk");
        keywordsMap[label].bert.forEach((phrase) => {
            let node = document.createElement("DIV");
            node.innerHTML = phrase;
            berkBody.appendChild(node);
        });

        let rakeBody = document.getElementById("rake");
        keywordsMap[label].rake.forEach((phrase) => {
            let node = document.createElement("DIV");
            node.innerHTML = phrase;
            rakeBody.appendChild(node);
        });
    }
}

async function renderPassiveFeedback(video, response) {
    let color = "#5959e6";
    console.debug(video);
    let passiveChart = document.getElementById(`passiveFeedback_${video.videoID}`).getContext("2d");
    response.passive_question.sort((a, b) => {
        return a.timestamp - b.timestamp;
    });
    let filteredData = response.passive_question.filter(question => question.timestamp !== null && question.count !== null);
    let amounts = filteredData.map(question => question.count);
    let labels = filteredData.map(question => question.timestamp);

    console.debug(filteredData);
    let chart = new Chart(passiveChart, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Passive Feedback",
                borderColor: color,
                pointBackgroundColor: color,
                pointBorderColor: color,
                pointHoverBackgroundColor:color,
                pointHoverBorderColor: color,
                data: amounts,
                pointHoverRadius: 20,
                pointHoverBackgroundColor: "green"
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
                    gridLines: { display: false },
                    scaleLabel: {
                        display: true,
                        labelString: "Timestamp"
                    },
                    distribution: "linear",
                    ticks: {
                        display: true
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "# of Emotional Responses"
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function(value){ if(value % 1 === 0) { return value; }}
                    }
                }]
            }
        }
    });

    let canvas = document.getElementById(`passiveFeedback_${video.videoID}`);
    canvas.onclick = function(evt) {
        let firstPoint = chart.getElementAtEvent(evt)[0];

        if (firstPoint) {
            let label = chart.data.labels[firstPoint._index];
            console.debug(label, keywordsMap[label]);
            if (!keywordsMap[label]) {
                getVideoContextKeyWords(video, label);
            }
            displayContextKeyWords(label);
        }
    };
}

async function getVideoContextKeyWords(video, timestamp) {
    chrome.runtime.sendMessage({
        type: "FetchVideoContextKeyWords",
        videoID: video.videoID,
        timestamp: timestamp,
        duration: video.video_duration
    }, (response) => {
        keywordsMap[timestamp] = processContextKeyWords(response);
        if (Swal.isVisible()) {
            Swal.close();
        }
        displayContextKeyWords(timestamp);
    });
}

function processContextKeyWords(result) {
    if (result.status) {
        return { rake: result.data.rake, bert: result.data.bert };
    } else {
        
        return { rake: ["No context words could be found"], bert: ["No context words could be found"] };
    }
}

export { renderActiveFeedback, renderPassiveFeedback, renderVideoAccordian, renderVideoStudentBreakdown };
