window.onload = function() {
    let studentNameField = document.getElementById("studentNameField");
    studentNameField.onkeydown = function(event) {
        if (event.code == "Enter" || event.key == "Enter") {
            $("#studentCollapseCard").collapse("hide");
            $("#loginConfirmationCollapseCard").collapse("show");
            chrome.storage.local.set({"studentName": studentNameField.value}, function() {
                chrome.storage.local.get(console.log);
            });
        }
    };
};
