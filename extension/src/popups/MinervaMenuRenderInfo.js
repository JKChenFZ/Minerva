function renderCurrentStudentInfo(studentInfoBody, response) {
    console.debug(response);
    let time = document.getElementById("time-balance");
    time.innerText = secondToHoursAndMinutes(response.time_record);

    let coin_balance = document.getElementById("coin-balance");
    coin_balance.innerText = secondToHoursAndMinutes(response.coin_balance);

    let correct_count = document.getElementById("correct-count");
    correct_count.innerText = secondToHoursAndMinutes(response.correct_count);

    let incorrect_count = document.getElementById("incorrect-count");
    incorrect_count.innerText = secondToHoursAndMinutes(response.incorrect_count);
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

export { renderCurrentStudentInfo, renderStudentRankings };
