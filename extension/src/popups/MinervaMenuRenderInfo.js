function filterAvailableStoreStickers(studentOwnedStickers) {
    chrome.runtime.sendMessage({
        type: "GetStickers"
    }, (storeStickers) => {
        let availableStickers = storeStickers.filter(sticker => !studentOwnedStickers.includes(sticker.id));
        console.debug(storeStickers, studentOwnedStickers);
        renderAvailableStoreStickers(availableStickers);
    });        
}

function renderAvailableStoreStickers(availableStickers) {
    let storeStickerBody = document.getElementById("store-sticker-body");

    availableStickers.forEach((sticker) => {
        let tableRow = document.createElement("TR");
        let itemPrice = tableRow.insertCell(0);
        itemPrice.innerText = sticker.price;

        let itemName = tableRow.insertCell(1);
        itemName.innerText = sticker.name;

        let itemImage = tableRow.insertCell(2);
        let image = document.createElement("img");
        let imgURL = chrome.extension.getURL(`images/${sticker.id}.jpg`);
        image.src = imgURL;
        image.width = "50";
        image.height = "50";

        itemImage.appendChild(image);
        storeStickerBody.append(tableRow);
    });
}

function renderCurrentStudentInfo(response) {
    console.debug(response);
    let time = document.getElementById("time-record");
    time.innerText = secondToHoursAndMinutes(zeroIfNull(response.time_record));

    let coinBalance = document.getElementById("coin-balance");
    coinBalance.innerText = zeroIfNull(response.coin_balance);

    let correctCount = document.getElementById("correct-count");
    correctCount.innerText = zeroIfNull(response.correct_count);

    let incorrectCount = document.getElementById("incorrect-count");
    incorrectCount.innerText = zeroIfNull(response.incorrect_count);

    let ownedBadgesBody = document.getElementById("side-bar-owned-badges");
    response.owned_badges.forEach((badge) => {
        let image = document.createElement("img");
        image.src = chrome.extension.getURL(`images/${badge}.jpg`);
        image.width = "25";
        image.height = "25";
        ownedBadgesBody.appendChild(image);
    });
}

function renderStudentRankings(classRankingBody, response) {
    response.sort((a, b) => {
        return b.time - a.time;
    });
    console.debug(response);
    response.forEach(function(student, index) {
        let tableRow = document.createElement("TR");
        let rank = tableRow.insertCell(0);
        let name = tableRow.insertCell(1);
        let amount = tableRow.insertCell(2);
        rank.innerText = index + 1;
        name.innerText = student.name;
        amount.innerText = secondToHoursAndMinutes(student.time);
        classRankingBody.appendChild(tableRow);
    });
}

function secondToHoursAndMinutes(time) {
    let date = new Date(null);
    date.setSeconds(time);
    
    // ISOString format 2011-10-05T14:48:00.000Z
    // Start at index 11 and grab 5 characters.
    return date.toISOString().substr(11, 5);
}

function zeroIfNull(input) {
    return input ? input : "0";
}

export { filterAvailableStoreStickers, renderCurrentStudentInfo, renderStudentRankings };
