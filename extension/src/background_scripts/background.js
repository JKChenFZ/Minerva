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
