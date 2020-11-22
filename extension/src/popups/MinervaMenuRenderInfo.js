import Swal from "sweetalert2";

function addStickerAfterPurchase(badge) {
    let ownedBadgesBody = getOwnedBagesSideBar();
    let image = document.createElement("img");

    image.classList.add("animate__animated");
    image.classList.add("animate__backInDown");
    image.classList.add("animate__delay-.5s");

    image.src = chrome.extension.getURL(`images/${badge.id}.jpg`);
    image.width = "25";
    image.height = "25";
    ownedBadgesBody.appendChild(image);

    image.addEventListener("animationend", () => {
        image.classList.remove("animate__backInDown");
        image.classList.remove("animate__delay-.5s");
        image.classList.add("animate__bounce");
        image.classList.add("animate__repeat-3");
    });
}

function removeStickerFromStore(sticker) {
    $(`#store-image-${sticker.id}`).tooltip("disable");
    let tableRow = document.getElementById(sticker.id);
    tableRow.addEventListener("animationend", () => {
        tableRow.remove();
    });
    tableRow.classList.add("animate__animated");
    tableRow.classList.add("animate__backOutDown");
}

function getOwnedBagesSideBar() {
    return document.getElementById("side-bar-owned-badges");
}

async function buyStoreSticker(sticker) {
    let result = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
            type: "BuySticker",
            id: sticker.id,
            price: sticker.price
        }, (response) => {
            resolve(response);
        });
    });

    if (result.status) {
        removeStickerFromStore(sticker);
        addStickerAfterPurchase(sticker);
    } else {
        Swal.fire({
            title: `Could not buy ${sticker.name}`,
            confirmButtonText: "Close"
        });
    }
}

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

        // let button = document.createElement("BUTTON");
        image.setAttribute("class", "store-image");
        image.setAttribute("data-toggle", "tooltip");
        image.setAttribute("title", `Buy ${sticker.name}`);
        image.setAttribute("data-placement", "left");
        image.setAttribute("id", `store-image-${sticker.id}`);

        image.src = imgURL;
        image.width = "50";
        image.height = "50";

        // button.appendChild(image)
        itemImage.appendChild(image);
        tableRow.id = sticker.id;
        itemImage.onclick = async function() {
            buyStoreSticker(sticker);
        };

        storeStickerBody.append(tableRow);
        $("[data-toggle=tooltip]").tooltip();
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

    let ownedBadgesBody = getOwnedBagesSideBar();
    response.owned_badges.forEach((badge) => {
        let image = document.createElement("img");

        image.classList.add("animate__animated");
        image.classList.add("animate__backInDown");
        image.classList.add("animate__delay-.5s")

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
