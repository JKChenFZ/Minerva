let activeFeedback = [{x: new Date(0, 0, 0, 0, 1, 2, 0), y: "2", students: ["Yuki", "John"]}, {x: new Date(0, 0, 0, 0, 20, 1, 0), y: "3", students: ["John", "Jack", "Seth"]}];
let passiveFeedback = [{x: new Date(0, 0, 0, 0, 12, 45, 0), y: "1", students: ["Seth"] }, {x: new Date(0, 0, 0, 1, 14, 5, 0), y: "2", students: ["Yuki", "John"] }];
let data = [activeFeedback, passiveFeedback];
function displayFormatFunction(label, index) {
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
window.onload = function() {
    let color=["#5959e6", "#800000"];
    let passiveChart = document.getElementById("passiveFeedback").getContext("2d");
    new Chart(passiveChart, {
        type: "line",
        data: {
            datasets: [
            {
                label: "Passive Feedback",
                borderColor: color[1],
                pointBackgroundColor: color[1],
                pointBorderColor: color[1],
                pointHoverBackgroundColor:color[1],
                pointHoverBorderColor: color[1],
                data: passiveFeedback
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
    });
    let activeChart = document.getElementById("activeFeedback").getContext("2d");
    new Chart(activeChart, {
        type: "bar",
        data
    });
};
