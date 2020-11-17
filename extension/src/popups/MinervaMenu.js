import { filterAvailableStoreStickers, renderCurrentStudentInfo, renderStudentRankings } from "./MinervaMenuRenderInfo.js";
import { getStudentHandle } from "../utils/ApiInterface.js";

function transitionToMainMenu(studentName) {
    diplayCurrentStudentInfo(studentName);
    $("#minervaMenuCollapseCard").collapse("show");
    $("#studentCollapseCard").collapse("hide");
    let studentNamePanel = document.getElementById("studentName-youPanel");
    studentNamePanel.innerText = "Hi " + studentName;
}

function displayClassRankings() {
    let classRankingBody = document.getElementById("class-ranking-body");
    chrome.runtime.sendMessage({
        type: "FetchStudentRankings"
    }, (response) => {
        if (response.status) {
            renderStudentRankings(classRankingBody, response.studentInfo);
        } else {
            let navRanking = document.getElementById("nav-ranking");
            navRanking.innerHTML = "No students";
        }
    });
}

function diplayCurrentStudentInfo(studentName) {
    chrome.runtime.sendMessage({
        type: "FetchCurrentStudentInfo",
        studentName: studentName
    }, (response) => {
        if (response.status) {
            renderCurrentStudentInfo(response);
            filterAvailableStoreStickers(response.owned_badges);
        } else {
            let studentInfoBody = document.getElementById("card-body-youPanel");
            studentInfoBody.innerHTML = "No information could be found";
        }
    });
}

window.onload = function() {
    let studentHandle = getStudentHandle();
    studentHandle.then((studentName) => {
        transitionToMainMenu(studentName);
    }, (reject) => {
        chrome.tabs.create({url: chrome.extension.getURL("StudentRegistration.html")});
    });
    displayClassRankings();
};
