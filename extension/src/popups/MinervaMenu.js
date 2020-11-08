import { renderStudentRankings } from "./MinervaMenuRenderInfo.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import {$,jQuery} from "jquery";

function transitionToMainMenu(studentName) {
    jQuery("#minervaMenuCollapseCard").collapse("show");
    jQuery("#studentCollapseCard").collapse("hide");
    let studentNamePanel = document.getElementById("studentName-youPanel");
    studentNamePanel.innerText = "Hi " + studentName;
}

function displayClassRankings() {
    let classRankingBody = document.getElementById("class-ranking-body");
    chrome.runtime.sendMessage({
        type: "FetchStudentRankings"
    }, (response) => {
        if (response.status == true) {
            renderStudentRankings(classRankingBody, response.studentInfo);
        } else {
            let navRanking = document.getElementById("nav-ranking");
            navRanking.innerHTML = "No students";
        }
    });
}

window.onload = function() {
    chrome.storage.local.get(["student_name"], (result) => {
        if (result.hasOwnProperty("student_name")) {
            transitionToMainMenu(result["student_name"]);
        } else {
            chrome.tabs.create({url: chrome.extension.getURL("StudentRegistration.html")});
        }
    });
    displayClassRankings();
    let images = ["golden_star.jpg", "pencil.jpg", "ruler.jpg"];
    for (var i = 1; i <= 3; i++) {
        let image = document.getElementById(`item-${i}-image`);
        let imgURL = chrome.extension.getURL(`images/${images[i - 1]}`);
        image.src = imgURL;
        image.width = "50";
        image.height = "50";
    }
};
