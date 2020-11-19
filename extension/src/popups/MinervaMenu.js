import { filterAvailableStoreStickers, renderCurrentStudentInfo, renderStudentRankings } from "./MinervaMenuRenderInfo.js";

function transitionToMainMenu(studentName) {
    if (!studentName.status) {
        chrome.tabs.create({url: chrome.extension.getURL("StudentRegistration.html")});

        return;
    }
    $("#minervaMenuCollapseCard").collapse("show");
    $("#studentCollapseCard").collapse("hide");
    let studentNamePanel = document.getElementById("studentName-youPanel");
    studentNamePanel.innerText = "Hi " + studentName.name;
}

async function displayClassRankings() {
    let classRankingBody = document.getElementById("class-ranking-body");
    let result = await getStudentRankingsPromise();
    
    if (result.status) {
        renderStudentRankings(classRankingBody, result.studentInfo);
    } else {
        let navRanking = document.getElementById("nav-ranking");
        navRanking.innerHTML = "No students";
    }
}

async function diplayCurrentStudentInfo(studentName) {
    if (!studentName.status) {
        return;
    }
    let result = await getStudentInfoPromise();

    if (result.status) {
        renderCurrentStudentInfo(result);
        filterAvailableStoreStickers(result.owned_badges);
    } else {
        let studentInfoBody = document.getElementById("card-body-youPanel");
        studentInfoBody.innerHTML = "No information could be found";
    }
}

async function getNamePromise() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            type: "GetStudentName"
        }, (response) => {
            resolve(response);
        });
    });
}

async function getStudentInfoPromise() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "FetchCurrentStudentInfo"
        }, (response) => {
            resolve(response);
        });
    });
}

async function getStudentRankingsPromise() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            type: "FetchStudentRankings"
        }, (response) => {
            resolve(response);
        });
    });
}

window.onload = async function() {
    displayClassRankings();

    let name = await getNamePromise();
    transitionToMainMenu(name);
    diplayCurrentStudentInfo(name);
};
