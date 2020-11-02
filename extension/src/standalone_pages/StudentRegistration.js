window.onload = function() {
    let studentNameField = document.getElementById("studentNameField");
    studentNameField.onkeydown = function(event) {
        if (event.code == "Enter" || event.key == "Enter") {
            $("#studentCollapseCard").collapse("hide");
            $("#loginConfirmationCollapseCard").collapse("show");
            chrome.storage.local.set({"student_name": studentNameField.value}, function() {
                console.debug("Student name has been set", studentNameField.value);
            });
        }
    };
};
