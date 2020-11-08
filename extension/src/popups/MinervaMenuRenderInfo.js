function renderStudentRankings(classRankingBody, response) {
    response.sort((a, b) => {
        return parseInt(a.time) < parseInt(b.time) ? 1: -1;
    });
    response.forEach(function(student, index) {
        let tableRow = document.createElement("TR");
        let rank = tableRow.insertCell(0);
        let name = tableRow.insertCell(1);
        let amount = tableRow.insertCell(2);

        rank.innerText = index + 1;
        name.innerText = student.name;

        let date = new Date(null);
        date.setSeconds(student.time);
        let result = date.toISOString().substr(11, 5);

        amount.innerText = result;

        classRankingBody.appendChild(tableRow);

    });
}

export { renderStudentRankings };
