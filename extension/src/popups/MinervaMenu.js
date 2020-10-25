function transitionToMainMenu(studentName) {
    $("#minervaMenuCollapseCard").collapse("show");
    $("#studentCollapseCard").collapse("hide");
    let studentNamePanel = document.getElementById("studentName-youPanel");
    studentNamePanel.innerText = "Hi " + studentName;
}
window.onload = function() {
    chrome.storage.local.get(["studentName"], (result) => {
        console.log(result);
        if (result.hasOwnProperty("studentName")) {
            transitionToMainMenu(result.studentName);
        } else {
            let studentNameField = document.getElementById("studentNameField");
            studentNameField.onkeydown = function(event) {
                if (event.code == "Enter" || event.key == "Enter") {
                    transitionToMainMenu(studentNameField.value);
                    chrome.storage.local.set({"studentName": studentNameField.value}, function() {
                        chrome.storage.local.get(console.log);
                    });
                }
            };
        }
    });
    let images = ["golden_star.jpg", "pencil.jpg", "ruler.jpg"];
    for (var i = 1; i <= 3; i++) {
        let image = document.getElementById(`item-${i}-image`);
        let imgURL = chrome.extension.getURL(`images/${images[i - 1]}`);
        image.src = imgURL;
        image.width = "50";
        image.height = "50";
    }
};
