window.onload = function() {
	console.log("onloading");
	let studentNameField = document.getElementById('studentName');
	studentNameField.onkeydown  = function(event) {
		if (event.code == "Enter" || event.key == "Enter") {
			chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
	    		var activeTab = tabs[0];
				console.log(studentNameField.value);
				console.log(tabs);
				chrome.tabs.sendMessage(activeTab.id, {"message": studentNameField.value});
			});
		}
	}

	let images = ["golden_star.jpg", "pencil.jpg", "ruler.jpg"]
	for (var i = 1; i <= 3; i++) {
		let image = document.getElementById(`item-${i}-image`);
		var imgURL = chrome.extension.getURL(`images/${images[i - 1]}`);
		console.log(imgURL)
		image.src = imgURL;
	}

}
