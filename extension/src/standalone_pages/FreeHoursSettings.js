import Swal from "sweetalert2";

let newHourStart = null;
let newHourEnd = null;
const NAMELESS_STUDENT = "<Nameless Student>";

async function confirmButtonOnClick() {
    if (!newHourStart || !newHourEnd) {
        Swal.fire({
            icon: "error",
            title: "Time is invalid",
            text: "Try setting the free hours again"
        });

        return;
    }

    if (newHourStart >= newHourEnd) {
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
        title: result.status ? "New hours have been set." : "Unable to change free hours",
    });
}

async function getCurrentStudentHandle() {
    // eslint-disable-next-line no-unused-vars
    let getNameMessage = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "GetStudentName"
        }, (response) => {
            resolve(response);
        });
    });

    let result = await getNameMessage;
    if (result.status) {
        return result.name;
    } else {
        return NAMELESS_STUDENT;
    }
}

async function getCurrentFreeHours() {
    // eslint-disable-next-line no-unused-vars
    let getHourMessage = new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "GetStudentFreeHours"
        }, (response) => {
            resolve(response);
        });
    });

    let result = await getHourMessage;
    if (result.status) {
        newHourStart = result["hour_start"];
        newHourEnd = result["hour_end"];
    } else {
        console.error("Unable to retrieve free hours for current student");
    }
}

async function main() {
    console.log("Free Hours Settings Page Loaded");
    let studentName = await getCurrentStudentHandle();
    if (studentName !== NAMELESS_STUDENT) {
        await getCurrentFreeHours();
    }

    // Update UI
    let title = document.getElementById("title");
    title.innerText = `Set new free hours for ${studentName}`;
    console.debug(`Current free hours are set from ${newHourStart} to ${newHourEnd}`);

    $("#hourStart").timepicker({
        timeFormat: "hh:mm p",
        defaultTime: new Date(0, 0, 0, newHourStart, 0, 0),
        minHour: 8,
        maxHour: 22,
        interval: 60,
        change: (selectedTime) => {
            // This will trigger right away because a default time is set
            newHourStart = selectedTime.getHours();
            console.debug(`New starting hour is set to ${newHourStart}`);
        }
    });
    $("#hourEnd").timepicker({
        timeFormat: "hh:mm p",
        defaultTime: new Date(0, 0, 0, newHourEnd, 0, 0),
        minHour: 8,
        maxHour: 22,
        interval: 60,
        change: (selectedTime) => {
            // This will trigger right away because a default time is set
            newHourEnd = selectedTime.getHours();
            console.debug(`New ending hour is set to ${newHourEnd}`);
        }
    });

    let confirmButton = document.getElementById("confirmButton");
    confirmButton.removeAttribute("disabled");
    confirmButton.addEventListener("click", confirmButtonOnClick);
}

window.addEventListener("load", main);
