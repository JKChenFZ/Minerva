function addStyleSheet() {
    // Add the style sheet
    let style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.extension.getURL('style.css');
    (document.head||document.documentElement).appendChild(style);

    console.log("Added common stylesheet");
}

window.addEventListener('load', addStyleSheet);