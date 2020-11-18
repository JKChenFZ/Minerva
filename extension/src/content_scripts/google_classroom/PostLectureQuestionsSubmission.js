import { GVars } from "./GlobalVariablesAndConstants";
import Swal from "sweetalert2";

function addNewQuestion(videoID, question, correct, wrong, anotherWrong) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            type: "AddNewVideoQuestion",
            videoID,
            question,
            correct,
            wrong,
            "another_wrong": anotherWrong
        }, (response) => {
            resolve(response);
        });
    });
}

async function addQuestionButtonOnClick(event) {
    event.stopPropagation();
    // Barebone parsing
    let videoID = event.target.value.split("=")[1];

    let result = await Swal.fire({
        icon: "question",
        title: "Add a custom question",
        confirmButtonText: "Submit",
        confirmButtonColor: "green",
        html: `
        <input type="text" id="questionTitle" class="swal2-input" placeholder="Question prompt">
        <input type="text" id="correct" class="swal2-input" placeholder="Correct answer">
        <input type="text" id="wrong1" class="swal2-input" placeholder="Wrong answer">
        <input type="text" id="wrong2" class="swal2-input" placeholder="Alternative wrong answer">
        <select id="gameType" class="swal2-input">
          <option selected="selected">Three Cups and A Ball</option>
        </select>
        `,
        preConfirm: async() => {
            const question = Swal.getPopup().querySelector("#questionTitle").value;
            const correct = Swal.getPopup().querySelector("#correct").value;
            const wrong = Swal.getPopup().querySelector("#wrong1").value;
            const anotherWrong = Swal.getPopup().querySelector("#wrong2").value;
            if (!question || !correct || !wrong || !anotherWrong) {
                Swal.showValidationMessage("Please enter all information");

                return;
            }

            return await addNewQuestion(videoID, question, correct, wrong, anotherWrong);
        }
    });

    if (result.value) {
        if (result.value.status) {
            Swal.fire({
                icon: "success",
                title: "Question added"
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Try again later"
            });
        }
    } 
}

// eslint-disable-next-line no-unused-vars
function observerHandler(mutationsList, observer) {
    console.debug("Detected a change in DOM");
    // Directly query the DOM for Youtube links
    let candidates = document.getElementsByTagName("A");
    for (const candidate of candidates) {
        let link = candidate.href;
        if (link && 
            link.includes("www.youtube.com/watch?v") && 
            !GVars.modifiedURL.includes(link))
        {
            // Avoid revisiting the same URL
            GVars.modifiedURL.push(link);

            // Create and inject question submission button
            let button = document.createElement("BUTTON");
            button.innerText = "Add Question";
            button.setAttribute("class", "add-question-button");
            button.setAttribute("value", link);
            button.addEventListener("click", (e) => addQuestionButtonOnClick(e));

            candidate.parentElement.insertBefore(button, candidate);
        }
    }
}

async function registerAddPostLectureQuestionsButton() {
    if (GVars.teacherMode) {
        let siteBody = document.getElementsByTagName("BODY")[0];
        GVars.observer = new MutationObserver(observerHandler);
        GVars.observer.observe(siteBody, {
            childList: true,
            subtree: true
        });

        console.log("Registered DOM Mutation Observer");
    }
}

export { registerAddPostLectureQuestionsButton };
