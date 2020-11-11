import Swal from "sweetalert2";

let newHourStart = null;
let newHourEnd = null;

async function confirmButtonOnClick() {
    if (!newHourStart || !newHourEnd) {
        Swal.fire({
            icon: "error",
            title: "Time is invalid",
            text: "Try setting the free hours again"
        });

        return;
    }

    if (newHourStart == newHourEnd) {
        Swal.fire({
            icon: "error",
            title: "Invalid Time Interval",
            text: "Ending time must be after the starting time"
        });

        return;
    }

    // eslint-disable-next-line no-unused-vars
    let setRequest = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "SetNewFreeHours",
            hourStart: newHourStart,
            hourEnd: newHourEnd,
        }, (response) => {
            resolve(response);
        });
    });

    let result = await setRequest;
    Swal.fire({
        icon: result.status ? "success" : "error",
        text: result.status ? "New hours have been set." : "Unable to change free hours",
    });
}

function main() {
    console.log("Free  Hours Settings Page Loaded");
    $("#hourStart").timepicker({
        timeFormat: "hh:mm p",
        minHour: 8,
        maxHour: 22,
        interval: 60,
        change: (selectedTime) => {
            newHourStart = selectedTime.getHours();
            console.debug(`New starting hour is set to ${newHourStart}`);
        }
    });
    $("#hourEnd").timepicker({
        timeFormat: "hh:mm p",
        minHour: 8,
        maxHour: 22,
        interval: 60,
        change: (selectedTime) => {
            newHourEnd = selectedTime.getHours();
            console.debug(`New ending hour is set to ${newHourEnd}`);
        }
    });

    let confirmButton = document.getElementById("confirmButton");
    confirmButton.addEventListener("click", confirmButtonOnClick);
}

window.addEventListener("load", main);
