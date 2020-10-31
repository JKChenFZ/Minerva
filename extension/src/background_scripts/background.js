chrome.runtime.onInstalled.addListener(function() {
    // eslint-disable-next-line no-undefined
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher ({
                pageUrl: { hostEquals: "classroom.google.com"},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "chrome"}, function (tab) {
        console.log("New tab launched with http://yoursite.com/");
    });
});
