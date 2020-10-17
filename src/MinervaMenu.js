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

