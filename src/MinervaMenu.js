window.onload = function() {
    console.log("onloading");
    let studentNameField = document.getElementById('studentName');
    studentNameField.onkeydown  = function(event) {
        if (event.code == "Enter" || event.key == "Enter") {
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
                var activeTab = tabs[0];
                console.log(studentNameField.value);
                // chrome.tabs.sendMessage(activeTab.id, {"message": studentNameField.value});
                chrome.storage.local.set({"studentName": studentNameField.value}, function() {
                    console.log('Value is set to ' + studentNameField.value);
                    chrome.storage.local.get(console.log)
                });
            });
        }
    }

    let images = ["golden_star.jpg", "pencil.jpg", "ruler.jpg"]
    for (var i = 1; i <= 3; i++) {
        let image = document.getElementById(`item-${i}-image`);
        let imgURL = chrome.extension.getURL(`images/${images[i - 1]}`);
        console.log(imgURL)
        image.src = imgURL;
    }

}
